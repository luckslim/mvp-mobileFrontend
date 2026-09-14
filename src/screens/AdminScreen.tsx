import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FlatList, Image, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useAuth } from "../auth/AuthContext";
import type { TouristPlace } from "../types";
import type { ScreenProps } from "../navigation/types";

const bodyValidationSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres."),
  collaborators: z.string().min(1, "Os colaboradores são obrigatórios."),
  time: z.string().min(1, "O horário é obrigatório."),
  image: z.string().optional().or(z.literal("")),
});

type BodyValidationSchema = z.infer<typeof bodyValidationSchema>;

type ApiEventItem = {
  _id?: { value?: string | null } | null;
  props?: {
    authorId?: string | null;
    title?: string | null;
    content?: string | null;
    collaborators?: string | null;
    fileUrl?: string | null;
    time?: string | null;
    location?: string | null;
  } | null;
};

const defaultEventImage =
  "https://placehold.co/600x400/edf6ee/1f4d3d?text=Mag%C3%A9+Verde";

function normalizeApiEvent(item: ApiEventItem): TouristPlace | null {
  const props = item?.props ?? {};
  const title = props.title?.trim();

  if (!title && !props.content) {
    return null;
  }

  return {
    id: item?._id?.value ?? props.authorId ?? `event-${Date.now()}`,
    registrantId: props.authorId ?? "unknown",
    name: title || "Evento sem título",
    description: props.content || "Sem descrição disponível.",
    suggestedVisitTime: props.time || "A confirmar",
    location: props.location || "Magé",
    responsibleParty: props.collaborators || "Responsável não informado",
    imageUrl: props.fileUrl || defaultEventImage,
    status: "APPROVED",
  };
}

export function AdminScreen({ navigation }: ScreenProps<"Admin">) {
  const insets = useSafeAreaInsets();
  const { signOut, token } = useAuth();
  const [errorState, SetErrorState] = useState<string | null>(null);
  const [messageState, SetMessageState] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);
  const [events, setEvents] = useState<TouristPlace[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  async function fetchEvents() {
    try {
      setIsLoadingEvents(true);

      const response = await fetch(
        "https://mvp-mageverde.onrender.com/get/events",
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );

      if (!response.ok) {
        throw new Error("Não foi possível carregar os eventos.");
      }

      const payload = (await response.json()) as { event?: ApiEventItem[] };
      const nextEvents = (payload.event ?? [])
        .map(normalizeApiEvent)
        .filter((event): event is TouristPlace => event !== null);

      setEvents(nextEvents);
      SetErrorState(null);
    } catch (error) {
      console.log("Erro ao carregar eventos:", error);
      SetErrorState("Não foi possível carregar os eventos no momento.");
    } finally {
      setIsLoadingEvents(false);
    }
  }

  useEffect(() => {
    void fetchEvents();

    const intervalId = setInterval(() => {
      void fetchEvents();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [token]);

  async function handleDeleteEvent(eventId: string) {
    try {
      SetErrorState(null);
      SetMessageState(null);

      if (!token) {
        SetErrorState("Sessão expirada. Faça login novamente.");
        return;
      }

      const response = await fetch(
        "https://mvp-mageverde.onrender.com/delete/event",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId }),
        },
      );

      const rawBody = await response.text();
      let payload: Record<string, unknown> | null = null;

      try {
        payload = rawBody
          ? (JSON.parse(rawBody) as Record<string, unknown>)
          : null;
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const message =
          (typeof payload?.message === "string"
            ? payload.message
            : undefined) ??
          (typeof payload?.error === "string" ? payload.error : undefined) ??
          "Não foi possível excluir o evento no momento.";

        SetErrorState(message);
        return;
      }

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId),
      );

      if (selectedPlace?.id === eventId) {
        setSelectedPlace(null);
      }

      SetMessageState(
        (typeof payload?.message === "string" ? payload.message : undefined) ??
          "Evento removido com sucesso!",
      );

      await fetchEvents();
    } catch (error) {
      console.log("Erro ao deletar evento:", error);
      SetErrorState("Não foi possível excluir o evento no momento.");
    }
  }

  async function handleLogout() {
    await signOut();
    navigation.navigate("LoginAdmin");
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BodyValidationSchema>({
    resolver: zodResolver(bodyValidationSchema),
    defaultValues: {
      title: "",
      content: "",
      collaborators: "",
      time: "",
      image: "",
    },
  });

  async function pickImage() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      SetErrorState("Permissão para acessar a galeria foi negada.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      setValue("image", imageUri, { shouldValidate: true });
      SetErrorState(null);
    }
  }

  function normalizeTimeValue(value: string) {
    const cleanValue = value.trim().toLowerCase().replace(/\s+/g, "");

    if (/^\d{1,2}h$/i.test(cleanValue)) {
      const hour = cleanValue.replace("h", "");
      return `${hour.padStart(2, "0")}:00`;
    }

    if (/^\d{1,2}h\d{2}$/i.test(cleanValue)) {
      const hour = cleanValue.replace(/h\d{2}$/, "");
      const minutes = cleanValue.slice(-2);
      return `${hour.padStart(2, "0")}:${minutes}`;
    }

    return value.trim();
  }

  function resetForm() {
    setSelectedImage(null);
    reset({
      title: "",
      content: "",
      collaborators: "",
      time: "",
      image: "",
    });
  }

  async function handleCreateEvent({
    title,
    content,
    collaborators,
    time,
  }: BodyValidationSchema) {
    try {
      SetErrorState(null);
      SetMessageState(null);

      if (!token) {
        SetErrorState("Sessão expirada. Faça login novamente.");
        return;
      }

      const normalizedTime = normalizeTimeValue(time);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("collaborators", collaborators);
      formData.append("time", normalizedTime);

      if (selectedImage) {
        const imageName = selectedImage.split("/").pop() ?? "event-image.jpg";

        const localImageResponse = await fetch(selectedImage);
        const imageBlob = await localImageResponse.blob();

        formData.append("file", imageBlob, imageName);
        console.log("IMAGE:", {
          uri: selectedImage,
          blobType: imageBlob.type,
          blobSize: imageBlob.size,
        });
      }

      console.log("Enviando evento para a API:", {
        title,
        content,
        collaborators,
        time,
        image: selectedImage,
      });

      console.log(selectedImage);

      const response = await fetch(
        "https://mvp-mageverde.onrender.com/create/event",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const rawBody = await response.text();
      let payload: Record<string, unknown> | null = null;

      try {
        payload = rawBody
          ? (JSON.parse(rawBody) as Record<string, unknown>)
          : null;
      } catch {
        payload = null;
      }

      console.log("Resposta da API:", payload ?? rawBody);

      if (!response.ok) {
        const message =
          (typeof payload?.message === "string"
            ? payload.message
            : undefined) ??
          (typeof payload?.error === "string" ? payload.error : undefined) ??
          "Não foi possível criar o evento no momento.";

        SetErrorState(message);
        return;
      }

      const successMessage =
        (typeof payload?.message === "string" ? payload.message : undefined) ??
        "Evento criado com sucesso!";

      SetMessageState(successMessage);
      setIsCreateDialogOpen(false);
      resetForm();
      await fetchEvents();
    } catch (error) {
      console.log("Erro ao criar evento:", error);
      SetErrorState("Não foi possível criar o evento no momento.");
    }
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        contentContainerClassName="mx-auto w-full max-w-[720px] px-5 pb-28"
        data={events}
        keyExtractor={(place) => place.id}
        ListHeaderComponent={
          <View className="pb-5 pt-5">
            <View className="mb-3 flex-row items-center justify-between gap-3">
              <Text className="text-sm font-bold text-primary">
                Área restrita
              </Text>
              <Button
                className="h-9 px-3"
                onPress={() => void handleLogout()}
                variant="outline"
              >
                <Text>Sair</Text>
              </Button>
            </View>
            <Text className="mt-2 text-3xl font-extrabold tracking-tight">
              Eventos
            </Text>
            <Text className="mt-2 leading-6 text-muted-foreground">
              Revise e escolha o que deve entrar no guia de Magé.
            </Text>
            <View className="mt-4 flex-row items-center justify-between rounded-xl border border-border bg-card px-3 py-2">
              <Text className="text-sm font-medium text-muted-foreground">
                {isLoadingEvents ? "Atualizando..." : "Eventos Disponíveis"}
              </Text>
              <Badge variant="secondary">
                <Text>{events.length}</Text>
              </Badge>
            </View>
          </View>
        }
        ListEmptyComponent={
          !isLoadingEvents ? (
            <View className="rounded-xl border border-dashed border-border bg-card p-5">
              <Text className="text-center text-muted-foreground">
                Nenhum evento encontrado no momento.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <AdminPlaceCard
            place={item}
            onPressDetails={() => setSelectedPlace(item)}
            onDelete={() => void handleDeleteEvent(item.id)}
          />
        )}
      />

      <Dialog
        open={Boolean(selectedPlace)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlace(null);
          }
        }}
      >
        {selectedPlace ? (
          <DialogContent className="h-[72%] max-w-[440px] gap-0 p-0">
            <ScrollView
              className="flex-1"
              contentContainerClassName="gap-4 p-6 pb-4"
              showsVerticalScrollIndicator={false}
            >
              <DialogHeader>
                <DialogTitle>{selectedPlace.name}</DialogTitle>
                <DialogDescription>
                  Detalhes do evento cadastrado.
                </DialogDescription>
              </DialogHeader>

              <View className="gap-4">
              <Image
                source={{
                  uri: selectedPlace.imageUrl || defaultEventImage,
                }}
                className="h-40 w-full rounded-xl bg-border"
                resizeMode="cover"
              />

              <View className="gap-2">
                <Text className="text-sm font-bold text-primary">Local</Text>
                <Text>{selectedPlace.location || "Magé"}</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-bold text-primary">
                  Descrição
                </Text>
                <Text className="leading-5 text-muted-foreground">
                  {selectedPlace.description}
                </Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-bold text-primary">Horário</Text>
                <Text>{selectedPlace.suggestedVisitTime}</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-bold text-primary">
                  Colaboradores
                </Text>
                <Text>{selectedPlace.responsibleParty}</Text>
              </View>
              </View>

            </ScrollView>
            <DialogFooter className="flex-row justify-end border-t border-border px-6 py-3">
              <DialogClose asChild>
                <Button>
                  <Text>Fechar</Text>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>

      <View
        className="absolute inset-x-0 items-end px-4"
        pointerEvents="box-none"
        style={{ bottom: Math.max(insets.bottom, 16) }}
      >
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 rounded-full px-5 shadow-lg" size="lg">
              <Text>+ Criar evento</Text>
            </Button>
          </DialogTrigger>

          <DialogContent className="h-[88%] max-w-[420px] gap-0 p-0">
            <ScrollView
              className="flex-1"
              contentContainerClassName="gap-4 p-6 pb-4"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <DialogHeader>
                <DialogTitle>Criar evento</DialogTitle>
                <DialogDescription>
                  Preencha os dados do próximo evento da cidade.
                </DialogDescription>
              </DialogHeader>

            {errorState ? (
              <View className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
                <Text className="text-sm text-red-600">{errorState}</Text>
              </View>
            ) : null}

            {messageState ? (
              <View className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                <Text className="text-sm text-emerald-700">{messageState}</Text>
              </View>
            ) : null}

            <View className="gap-4">
              <View className="gap-2">
                <Label>Título</Label>
                <Input
                  {...register("title")}
                  onChangeText={(value) =>
                    setValue("title", value, { shouldValidate: true })
                  }
                  placeholder="Ex.: Feira de cultura"
                />
                {errors.title ? (
                  <Text className="text-sm text-red-500">
                    {errors.title.message}
                  </Text>
                ) : null}
              </View>

              <View className="gap-2">
                <Label>Conteúdo</Label>
                <Input
                  {...register("content")}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={(value) =>
                    setValue("content", value, { shouldValidate: true })
                  }
                  placeholder="Descreva o evento"
                  className="min-h-[100px]"
                />
                {errors.content ? (
                  <Text className="text-sm text-red-500">
                    {errors.content.message}
                  </Text>
                ) : null}
              </View>

              <View className="gap-2">
                <Label>Colaboradores</Label>
                <Input
                  {...register("collaborators")}
                  onChangeText={(value) =>
                    setValue("collaborators", value, { shouldValidate: true })
                  }
                  placeholder="Ex.: Secretaria de Cultura"
                />
                {errors.collaborators ? (
                  <Text className="text-sm text-red-500">
                    {errors.collaborators.message}
                  </Text>
                ) : null}
              </View>

              <View className="gap-2">
                <Label>Horário</Label>
                <Input
                  {...register("time")}
                  onChangeText={(value) =>
                    setValue("time", value, { shouldValidate: true })
                  }
                  placeholder="Ex.: 18:00 às 22:00"
                />
                {errors.time ? (
                  <Text className="text-sm text-red-500">
                    {errors.time.message}
                  </Text>
                ) : null}
              </View>

              <View className="gap-2">
                <Label>Imagem</Label>
                <Button
                  onPress={() => void pickImage()}
                  variant="outline"
                  className="h-32 overflow-hidden rounded-xl border-dashed"
                  disabled={isSubmitting}
                >
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text>Selecionar imagem</Text>
                  )}
                </Button>
                {errors.image ? (
                  <Text className="text-sm text-red-500">
                    {errors.image.message}
                  </Text>
                ) : null}
              </View>
            </View>

            </ScrollView>
            <DialogFooter className="flex-row justify-end border-t border-border px-6 py-3">
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  <Text>Cancelar</Text>
                </Button>
              </DialogClose>
              <Button
                disabled={isSubmitting}
                onPress={() => void handleSubmit(handleCreateEvent)()}
              >
                <Text>{isSubmitting ? "Criando..." : "Criar"}</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
    </View>
  );
}

function AdminPlaceCard({
  place,
  onPressDetails,
  onDelete,
}: {
  place: TouristPlace;
  onPressDetails: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="mb-4 overflow-hidden py-0">
      <Image
        source={{
          uri:
            place.imageUrl ||
            "https://placehold.co/600x400/edf6ee/1f4d3d?text=Mag%C3%A9+Verde",
        }}
        className="h-40 w-full bg-border"
      />
      <CardContent className="gap-3 p-5">
        <View className="flex-row items-center justify-between">
          <Badge variant="secondary">
            <Text>Disponível</Text>
          </Badge>
        </View>
        <Text className="text-xl font-extrabold">{place.name}</Text>
        <Text className="font-semibold text-primary">{place.location}</Text>
        <Text className="leading-5 text-muted-foreground" numberOfLines={3}>
          {place.description}
        </Text>
        <View className="mt-2 flex-row gap-2">
          <Button className="flex-1" variant="outline" onPress={onPressDetails}>
            <Text>Detalhes</Text>
          </Button>
          <Button className="flex-1" variant="destructive" onPress={onDelete}>
            <Text>Deletar</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
