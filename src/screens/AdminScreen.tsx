import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FlatList, Image, View } from "react-native";
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

const examplePlaces: TouristPlace[] = [
  {
    id: "example-1",
    registrantId: "demo",
    name: "Mirante do Vale",
    description:
      "Ponto com vista ampla e boa estrutura para receber visitantes e fotos.",
    suggestedVisitTime: "1 hora",
    location: "Magé",
    responsibleParty: "Exemplo",
    imageUrl: "",
    status: "PENDING",
  },
  {
    id: "example-2",
    registrantId: "demo",
    name: "Cachoeira do Bosque",
    description:
      "Local de valor ambiental com trilha curta e paisagem tranquila.",
    suggestedVisitTime: "2 horas",
    location: "Bosque da Cidade",
    responsibleParty: "Exemplo",
    imageUrl: "",
    status: "PENDING",
  },
  {
    id: "example-3",
    registrantId: "demo",
    name: "Praça das Artes",
    description:
      "Espaço cultural com convivência, eventos locais e boa circulação de pessoas.",
    suggestedVisitTime: "45 minutos",
    location: "Centro",
    responsibleParty: "Exemplo",
    imageUrl: "",
    status: "PENDING",
  },
];

export function AdminScreen({ navigation }: ScreenProps<"Admin">) {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [errorState, SetErrorState] = useState<string | null>(null);
  const [messageState, SetMessageState] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);

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

      console.log("Criando evento:", {
        title,
        content,
        collaborators,
        time,
        image: selectedImage,
      });

      SetMessageState("Evento criado com sucesso!");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      SetErrorState("Não foi possível criar o evento no momento.");
    }
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        contentContainerClassName="mx-auto w-full max-w-[720px] px-5 pb-28"
        data={examplePlaces}
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
          </View>
        }
        renderItem={({ item }) => (
          <AdminPlaceCard
            place={item}
            onPressDetails={() => setSelectedPlace(item)}
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
          <DialogContent className="max-w-[440px]">
            <DialogHeader>
              <DialogTitle>{selectedPlace.name}</DialogTitle>
              <DialogDescription>
                Detalhes do evento cadastrado.
              </DialogDescription>
            </DialogHeader>

            <View className="gap-4">
              <Image
                source={{
                  uri:
                    selectedPlace.imageUrl ||
                    "https://placehold.co/600x400/edf6ee/1f4d3d?text=Mag%C3%A9+Verde",
                }}
                className="h-40 w-full rounded-xl bg-border"
                resizeMode="cover"
              />

              <View className="gap-2">
                <Text className="text-sm font-bold text-primary">Local</Text>
                <Text>{selectedPlace.location}</Text>
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
                <Text className="text-sm font-bold text-primary">
                  Tempo sugerido
                </Text>
                <Text>{selectedPlace.suggestedVisitTime}</Text>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-bold text-primary">
                  Responsável
                </Text>
                <Text>{selectedPlace.responsibleParty}</Text>
              </View>
            </View>

            <DialogFooter className="mt-2 flex-row justify-end">
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

          <DialogContent className="max-w-[420px]">
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

            <DialogFooter className="mt-2 flex-row justify-end">
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
}: {
  place: TouristPlace;
  onPressDetails: () => void;
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
          <Button className="flex-1" variant="destructive">
            <Text>Deletar</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}
