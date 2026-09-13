import { FlatList, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Compass, LogOut, MapPin, Plus } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { colors } from "../theme";
import type { TouristPlace } from "../types";
import type { ScreenProps } from "../navigation/types";

const examplePlaces: TouristPlace[] = [
  {
    id: "example-1",
    registrantId: "demo",
    name: "Mirante da Serra",
    description:
      "Vista panorâmica e trilha leve para quem gosta de observar a cidade.",
    suggestedVisitTime: "1 hora",
    location: "Magé",
    responsibleParty: "Exemplo",
    imageUrl: "",
    status: "APPROVED",
  },
  {
    id: "example-2",
    registrantId: "demo",
    name: "Cachoeira do Vale",
    description:
      "Um ponto tranquilo para descanso, fotos e contato com a natureza.",
    suggestedVisitTime: "2 horas",
    location: "Vale Verde",
    responsibleParty: "Exemplo",
    imageUrl: "",
    status: "APPROVED",
  },
  {
    id: "example-3",
    registrantId: "demo",
    name: "Praça Central",
    description:
      "Espaço de convivência com história, vegetação e boa energia local.",
    suggestedVisitTime: "45 minutos",
    location: "Centro",
    responsibleParty: "Exemplo",
    imageUrl: "",
    status: "APPROVED",
  },
];

function PlaceCard({
  place,
  onPress,
}: {
  place: TouristPlace;
  onPress: () => void;
}) {
  return (
    <Button
      accessibilityLabel={`Abrir lugar ${place.name}`}
      className="mx-5 mb-5 h-auto overflow-hidden rounded-[28px] border border-border bg-card p-0 shadow-none"
      onPress={onPress}
      variant="ghost"
    >
      <View className="w-full">
        <View className="relative h-52 w-full overflow-hidden bg-primary">
          <View className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-secondary/30" />
          <View className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-secondary/15" />
          <View className="flex-1 items-center justify-center px-8">
            <Compass color={colors.leaf} size={34} strokeWidth={1.5} />
            <Text className="mt-3 text-center text-xl font-extrabold text-primary-foreground">
              Magé Verde
            </Text>
            <Text className="mt-1 text-center text-sm text-primary-foreground/70">
              Exemplo de local
            </Text>
          </View>
          <View className="absolute bottom-4 left-4">
            <Badge
              className="border-0 bg-secondary px-3 py-1.5"
              variant="secondary"
            >
              <Text className="font-bold text-secondary-foreground">
                {place.suggestedVisitTime}
              </Text>
            </Badge>
          </View>
        </View>

        <View className="w-full gap-3 px-5 pb-5 pt-4">
          <Text className="text-2xl font-extrabold leading-7 text-card-foreground">
            {place.name}
          </Text>

          <View className="flex-row items-center gap-2">
            <MapPin color={colors.success} size={16} />
            <Text className="flex-1 font-semibold text-primary">
              {place.location}
            </Text>
          </View>

          <Text className="text-[15px] leading-6 text-muted-foreground">
            {place.description}
          </Text>
        </View>
      </View>
    </Button>
  );
}

export function PlacesScreen({ navigation }: ScreenProps<"Places">) {
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
        data={examplePlaces}
        keyExtractor={(place) => place.id}
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
                <Text className="text-2xl font-extrabold text-primary">3</Text>
                <Text className="mt-1 text-xs font-semibold text-muted-foreground">
                  lugares de exemplo
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
                  Lugares para conhecer
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  Cards de exemplo para visualização.
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
