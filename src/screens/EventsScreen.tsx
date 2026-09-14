import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Compass, LogOut, MapPin } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "../auth/AuthContext";
import { colors } from "../theme";
import type { TouristPlace } from "../types";
import type { ScreenProps } from "../navigation/types";

const defaultEventImage =
  "https://placehold.co/600x400/edf6ee/1f4d3d?text=Mag%C3%A9+Verde";

type ApiEventItem = {
  _id?: { value?: string | null } | null;
  props?: {
    authorId?: string | null;
    title?: string | null;
    content?: string | null;
    colaborators?: string | null;
    collaborators?: string | null;
    fileUrl?: string | null;
    time?: string | null;
    location?: string | null;
  } | null;
};

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
    responsibleParty:
      props.colaborators || props.collaborators || "Responsável não informado",
    imageUrl: props.fileUrl || defaultEventImage,
    status: "APPROVED",
  };
}

function PlaceCard({
  place,
  onPress,
}: {
  place: TouristPlace;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Abrir lugar ${place.name}`}
      onPress={onPress}
      className="mx-5 mb-5 w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-none"
      style={{
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        minHeight: 280,
      }}
    >
      <View className="w-full flex-col self-stretch">
        <View className="relative h-56 w-full overflow-hidden bg-primary">
          <Image
            source={{ uri: place.imageUrl || defaultEventImage }}
            className="absolute inset-0 h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
          <View className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-secondary/30" />
          <View className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-secondary/15" />
          <View className="h-full items-center justify-center px-8 py-6">
            <Compass color={colors.leaf} size={34} strokeWidth={1.5} />
            <Text className="mt-3 text-center text-xl font-extrabold text-primary-foreground">
              {place.name}
            </Text>
            <Text className="mt-1 text-center text-sm text-primary-foreground/70">
              {place.location || "Magé"}
            </Text>
          </View>
          <View className="absolute bottom-4 left-4">
            <Badge
              className="border-0 bg-secondary/95 px-3 py-1.5"
              variant="secondary"
            >
              <Text className="font-bold text-secondary-foreground">
                {place.suggestedVisitTime}
              </Text>
            </Badge>
          </View>
        </View>

        <View className="w-full flex-col gap-3 px-5 pb-5 pt-4">
          <Text className="text-2xl font-extrabold leading-7 text-card-foreground">
            {place.name}
          </Text>

          <View className="flex-row items-center gap-2">
            <MapPin color={colors.success} size={16} />
            <Text className="flex-1 font-semibold text-primary">
              {place.location || "Magé"}
            </Text>
          </View>

          <Text className="text-[15px] leading-6 text-muted-foreground">
            {place.description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function PlacesScreen({ navigation }: ScreenProps<"Places">) {
  const { token } = useAuth();
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
    } catch (error) {
      console.log("Erro ao carregar eventos:", error);
      setEvents([]);
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
      <FlatList
        contentContainerStyle={{
          alignSelf: "center",
          maxWidth: 720,
          paddingBottom: 30,
          width: "100%",
        }}
        data={events}
        keyExtractor={(place) => place.id}
        ListEmptyComponent={
          !isLoadingEvents ? (
            <View className="px-5 pb-7 pt-4">
              <Text className="text-center text-muted-foreground">
                Nenhum evento encontrado no momento.
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View className="px-5 pb-7 pt-4">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                <Compass color={colors.forest} size={23} strokeWidth={2.2} />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-extrabold text-primary">
                  Magé Verde
                </Text>
                <Text className="mt-0.5 text-xs font-semibold tracking-wide text-muted-foreground">
                  GUIA TURÍSTICO LOCAL
                </Text>
              </View>
              <Button
                accessibilityLabel="Voltar para login"
                onPress={() => navigation.navigate("Login")}
                size="sm"
                variant="outline"
              >
                <LogOut color={colors.forest} size={15} />
                <Text>Sair</Text>
              </Button>
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-4">
                <Text className="text-2xl font-extrabold text-primary">
                  {isLoadingEvents ? "..." : events.length}
                </Text>
                <Text className="mt-1 text-xs font-semibold text-muted-foreground">
                  {isLoadingEvents ? "atualizando" : "eventos disponíveis"}
                </Text>
              </View>
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-4">
                <Text className="text-2xl font-extrabold text-primary">
                  Magé
                </Text>
                <Text className="mt-1 text-xs font-semibold text-muted-foreground">
                  para explorar com calma
                </Text>
              </View>
            </View>

            <View className="mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-2xl font-extrabold tracking-tight">
                  Eventos para conhecer
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  {isLoadingEvents
                    ? "Atualizando a lista em tempo real..."
                    : "Lista sincronizada com o backend."}
                </Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            onPress={() => navigation.navigate("PlaceDetails", { place: item })}
          />
        )}
      />
    </SafeAreaView>
  );
}
