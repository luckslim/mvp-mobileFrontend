import { FlatList, Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { TouristPlace } from '../types';
import type { ScreenProps } from '../navigation/types';

export function AdminScreen(_: ScreenProps<'Admin'>) {
  const insets = useSafeAreaInsets();
  const places: TouristPlace[] = [];
  const pendingCount = 0;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        contentContainerClassName="mx-auto w-full max-w-[720px] px-5 pb-9"
        data={places}
        keyExtractor={(place, index) => place.id || `place-${index}`}
        ListHeaderComponent={
          <View className="pb-5 pt-5">
            <Text className="text-sm font-bold text-primary">Área restrita</Text>
            <Text className="mt-2 text-3xl font-extrabold tracking-tight">Eventos pendentes</Text>
            <Text className="mt-2 leading-6 text-muted-foreground">Revise cada contribuição e escolha o que deve entrar no guia de Magé.</Text>
            {pendingCount > 0 ? (
              <View className="mt-5">
                <Text className="text-sm font-bold text-primary">Pendências</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-lg font-extrabold">A fila está limpa.</Text>
            <Text className="mt-2 text-center text-muted-foreground">Nenhum evento aguarda aprovação ou rejeição.</Text>
          </View>
        }
        renderItem={({ item }) => <AdminPlaceCard place={item} />}
      />

      <View className="absolute inset-x-0 items-end px-4" pointerEvents="box-none" style={{ bottom: Math.max(insets.bottom, 16) }}>
        <View className="w-full max-w-[360px] flex-row items-start gap-3 rounded-[20px] border border-[#bcdcc4] bg-white px-4 py-4 shadow-lg shadow-black/10">
          <View className="h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ef]" />
          <View className="min-w-0 flex-1">
            <Text className="text-xs font-bold text-muted-foreground">Status</Text>
            <Text className="mt-1 text-base font-extrabold leading-5 text-primary">Sem pendências.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function AdminPlaceCard({ place }: { place: TouristPlace }) {
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== 'Undefined');

  return (
    <Card className="mb-4 overflow-hidden py-0">
      {hasImage ? <Image source={{ uri: place.imageUrl }} className="h-40 w-full bg-border" /> : null}
      <CardContent className="gap-3 p-5">
        <View className="flex-row items-center justify-between">
          <Badge variant="secondary"><Text>Pendente</Text></Badge>
        </View>
        <Text className="text-xl font-extrabold">{place.name}</Text>
        <Text className="font-semibold text-primary">{place.location || 'Local a confirmar'}</Text>
        <Text className="leading-5 text-muted-foreground" numberOfLines={3}>{place.description}</Text>
        <View className="mt-2 flex-row gap-2">
          <Button className="flex-1" variant="secondary"><Text>Aprovar</Text></Button>
          <Button className="flex-1" variant="destructive"><Text>Rejeitar</Text></Button>
        </View>
      </CardContent>
    </Card>
  );
}
