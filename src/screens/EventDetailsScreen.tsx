import { Image, ScrollView, View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import type { ScreenProps } from '../navigation/types';

export function PlaceDetailsScreen({ route }: ScreenProps<'PlaceDetails'>) {
  const { place } = route.params;
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== 'Undefined');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="self-center w-full max-w-[720px] pb-9">
      {hasImage ? (
        <Image accessibilityIgnoresInvertColors source={{ uri: place.imageUrl }} className="h-64 w-full bg-border" />
      ) : (
        <View className="h-64 w-full items-center justify-center bg-primary">
          <Text className="text-3xl font-extrabold text-primary-foreground">Magé Verde</Text>
        </View>
      )}

      <Card className="rounded-none border-0 py-0 shadow-none">
        <CardHeader className="gap-3 px-6 pt-6">
          <Badge className="self-start" variant="secondary">
            <Text>Horário sugerido: {place.suggestedVisitTime || 'a confirmar'}</Text>
          </Badge>
          <CardTitle className="text-3xl font-extrabold leading-10 tracking-tight">
            {place.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-6">
          <View className="gap-5">
            <View>
              <Text className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Localização</Text>
              <Text className="mt-1 text-base leading-6">{place.location || 'Local a confirmar'}</Text>
            </View>
            <View>
              <Text className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Responsável pelo local</Text>
              <Text className="mt-1 text-base leading-6">{place.responsibleParty}</Text>
            </View>
          </View>
          <Separator className="my-6" />
          <Text className="text-xl font-extrabold">Sobre o lugar</Text>
          <Text className="mt-3 text-base leading-7 text-muted-foreground">{place.description}</Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
