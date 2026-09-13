import { FlatList, Image, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, Clock3, Compass, LogOut, MapPin, Plus, RefreshCw } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme';
import type { TouristPlace } from '../types';
import type { ScreenProps } from '../navigation/types';

function formatSuggestedTime(time?: string | null) {
  const normalizedTime = typeof time === 'string' ? time.trim() : '';
  return normalizedTime ? normalizedTime : 'A confirmar';
}

function PlaceCard({ place, onPress }: { place: TouristPlace; onPress: () => void }) {
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== 'Undefined');

  return (
    <Button
      accessibilityLabel={`Abrir lugar ${place.name}`}
      className="mx-5 mb-5 h-auto overflow-hidden rounded-[28px] border border-border bg-card p-0 shadow-none"
      onPress={onPress}
      variant="ghost"
    >
      <View className="w-full">
        <View className="relative h-52 w-full overflow-hidden bg-primary">
          {hasImage ? (
            <Image accessibilityIgnoresInvertColors resizeMode="cover" source={{ uri: place.imageUrl }} className="h-full w-full" />
          ) : (
            <>
              <View className="absolute -right-10 -top-16 h-52 w-52 rounded-full border border-secondary/30" />
              <View className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-secondary/15" />
              <View className="flex-1 items-center justify-center px-8">
                <Compass color={colors.leaf} size={34} strokeWidth={1.5} />
                <Text className="mt-3 text-center text-xl font-extrabold text-primary-foreground">Magé Verde</Text>
                <Text className="mt-1 text-center text-sm text-primary-foreground/70">Um lugar para descobrir</Text>
              </View>
            </>
          )}
          <View className="absolute bottom-4 left-4">
            <Badge className="border-0 bg-secondary px-3 py-1.5" variant="secondary">
              <Clock3 color={colors.forest} size={14} strokeWidth={2.5} />
              <Text className="font-bold text-secondary-foreground">Visita: {formatSuggestedTime(place.suggestedVisitTime)}</Text>
            </Badge>
          </View>
        </View>

        <View className="w-full gap-3 px-5 pb-5 pt-4">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-2xl font-extrabold leading-7 text-card-foreground" numberOfLines={2}>
              {place.name}
            </Text>
            <View className="mt-1 h-9 w-9 items-center justify-center rounded-full bg-background">
              <ArrowUpRight color={colors.forest} size={18} />
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <MapPin color={colors.success} size={16} />
            <Text className="flex-1 font-semibold text-primary" numberOfLines={1}>
              {place.location || 'Localização a confirmar'}
            </Text>
          </View>
          <Text className="text-[15px] leading-6 text-muted-foreground" numberOfLines={2}>
            {place.description}
          </Text>
        </View>
      </View>
    </Button>
  );
}

export function PlacesScreen({ navigation }: ScreenProps<'Places'>) {
  const { session, signOut } = useAuth();
  const places: TouristPlace[] = [];
  const myPlaces: TouristPlace[] = [];
  const pendingCount = 0;

  if (!session) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
      <FlatList
        contentContainerStyle={{ alignSelf: 'center', maxWidth: 720, paddingBottom: 30, width: '100%' }}
        data={places}
        keyExtractor={(place, index) => place.id || `place-${index}`}
        ListEmptyComponent={
          <View className="mx-5 mt-1 overflow-hidden rounded-[28px] bg-primary px-6 py-8">
            <Compass color={colors.leaf} size={30} strokeWidth={1.5} />
            <Text className="mt-4 text-2xl font-extrabold text-primary-foreground">O mapa ainda está começando.</Text>
            <Text className="mt-2 leading-6 text-primary-foreground/75">
              Seja a primeira pessoa a registrar um lugar especial para conhecer em Magé.
            </Text>
            <Button className="mt-6 self-start" onPress={() => navigation.navigate('CreatePlace')} variant="secondary">
              <Plus color={colors.forest} size={17} />
              <Text>Cadastrar primeiro lugar</Text>
            </Button>
          </View>
        }
        ListHeaderComponent={
          <View className="px-5 pb-7 pt-4">
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                <Compass color={colors.forest} size={23} strokeWidth={2.2} />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-extrabold text-primary">Magé Verde</Text>
                <Text className="mt-0.5 text-xs font-semibold tracking-wide text-muted-foreground">GUIA TURÍSTICO LOCAL</Text>
              </View>
              <Button accessibilityLabel="Sair da conta" onPress={() => void signOut()} size="sm" variant="outline">
                <LogOut color={colors.forest} size={15} />
                <Text>Sair</Text>
              </Button>
            </View>

            {session.role === 'admin' && pendingCount > 0 ? (
              <View className="mt-4">
                <Text className="text-sm font-bold text-primary">Pendências</Text>
              </View>
            ) : null}

            <View className="relative mt-7 overflow-hidden rounded-[30px] bg-primary px-6 pb-7 pt-6">
              <View className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-secondary/25" />
              <View className="absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-secondary/10" />
              <Badge className="self-start border-0 bg-primary-foreground/10" variant="default">
                <Text className="font-bold text-secondary">Seu próximo passeio</Text>
              </Badge>
              <Text className="mt-5 max-w-[390px] text-[32px] font-extrabold leading-9 tracking-tight text-primary-foreground">
                Encontre um canto especial de Magé.
              </Text>
              <Text className="mt-3 max-w-[390px] text-[15px] leading-6 text-primary-foreground/75">
                Trilhas, cachoeiras e histórias registradas por quem conhece a cidade.
              </Text>
              <Button className="mt-6 self-start" onPress={() => navigation.navigate('CreatePlace')} variant="secondary">
                <Plus color={colors.forest} size={17} />
                <Text>Cadastrar lugar</Text>
              </Button>
            </View>

            <View className="mt-4 flex-row gap-3">
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-4">
                <Text className="text-2xl font-extrabold text-primary">{places.length}</Text>
                <Text className="mt-1 text-xs font-semibold text-muted-foreground">lugares publicados</Text>
              </View>
              <View className="flex-1 rounded-2xl border border-border bg-card px-4 py-4">
                <Text className="text-2xl font-extrabold text-primary">Magé</Text>
                <Text className="mt-1 text-xs font-semibold text-muted-foreground">para explorar com calma</Text>
              </View>
            </View>

            <View className="mt-8 flex-row items-end justify-between">
              <View>
                <Text className="text-2xl font-extrabold tracking-tight">Lugares para conhecer</Text>
                <Text className="mt-1 text-sm text-muted-foreground">Escolha um destino para começar.</Text>
              </View>
              <Button accessibilityLabel="Atualizar lugares" size="icon" variant="ghost">
                <RefreshCw color={colors.forest} size={18} />
              </Button>
            </View>
          </View>
        }
        ListFooterComponent={session.role === 'admin' ? null : <MySubmissions places={myPlaces} />}
        renderItem={({ item }) => (
          <PlaceCard place={item} onPress={() => navigation.navigate('PlaceDetails', { place: item })} />
        )}
      />
    </SafeAreaView>
  );
}

function MySubmissions({ places }: { places: TouristPlace[] }) {
  if (!places.length) return null;

  return (
    <View className="mx-5 mt-8 border-t border-border pb-8 pt-7">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-extrabold tracking-tight">Meus envios</Text>
          <Text className="mt-1 text-sm text-muted-foreground">Acompanhe o que você compartilhou com o guia.</Text>
        </View>
        <Badge variant="outline"><Text>{places.length}</Text></Badge>
      </View>
    </View>
  );
}
