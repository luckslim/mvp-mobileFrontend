import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, CircleAlert, XCircle } from 'lucide-react-native';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ModerationBanner } from '../components/ModerationBanner';
import { useAuth } from '../auth/AuthContext';
import { getAdminTouristPlaces, moderateTouristPlace } from '../lib/api';
import { colors } from '../theme';
import type { TouristPlace } from '../types';
import type { ScreenProps } from '../navigation/types';

export function AdminScreen(_: ScreenProps<'Admin'>) {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [moderationFeedback, setModerationFeedback] = useState<{
    eventName: string;
    status: 'APPROVED' | 'REJECTED';
  } | null>(null);

  const loadPlaces = useCallback(async (refresh = false) => {
    if (!session) return;
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);
    try {
      const response = await getAdminTouristPlaces(session.token);
      setPlaces(response.places);
      setPendingCount(response.pendingCount);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os lugares.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [session]);

  useFocusEffect(useCallback(() => { void loadPlaces(); }, [loadPlaces]));

  useEffect(() => {
    if (!moderationFeedback) return;
    const timeoutId = setTimeout(() => setModerationFeedback(null), 4_500);
    return () => clearTimeout(timeoutId);
  }, [moderationFeedback]);

  async function updateStatus(place: TouristPlace, status: 'APPROVED' | 'REJECTED') {
    if (!session) return;
    setActiveId(place.id);
    try {
      await moderateTouristPlace(session.token, place.id, status);
      setModerationFeedback({ eventName: place.name, status });
      await loadPlaces(true);
    } catch (moderationError) {
      setError(moderationError instanceof Error ? moderationError.message : 'Não foi possível atualizar o lugar.');
    } finally {
      setActiveId(null);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        contentContainerClassName="mx-auto w-full max-w-[720px] px-5 pb-9"
        data={places}
        keyExtractor={(place, index) => place.id || `place-${index}`}
        refreshControl={
          <RefreshControl
            colors={[colors.forest]}
            onRefresh={() => void loadPlaces(true)}
            refreshing={isRefreshing}
            tintColor={colors.forest}
          />
        }
        renderItem={({ item }) => (
          <AdminPlaceCard
            active={activeId === item.id}
            place={item}
            onApprove={() => void updateStatus(item, 'APPROVED')}
            onReject={() => void updateStatus(item, 'REJECTED')}
          />
        )}
        ListHeaderComponent={
          <View className="pb-5 pt-5">
            <Text className="text-sm font-bold text-primary">Área restrita</Text>
            <Text className="mt-2 text-3xl font-extrabold tracking-tight">Eventos pendentes</Text>
            <Text className="mt-2 leading-6 text-muted-foreground">Revise cada contribuição e escolha o que deve entrar no guia de Magé.</Text>
            {pendingCount > 0 ? (
              <View className="mt-5">
                <ModerationBanner pendingCount={pendingCount} />
              </View>
            ) : null}
            {error ? (
              <Alert className="mt-5" icon={CircleAlert} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="items-center py-12"><ActivityIndicator color={colors.forest} /></View>
          ) : (
            <View className="items-center py-12">
              <Text className="text-lg font-extrabold">A fila está limpa.</Text>
              <Text className="mt-2 text-center text-muted-foreground">Nenhum evento aguarda aprovação ou rejeição.</Text>
            </View>
          )
        }
      />

      {moderationFeedback ? (
        <View className="absolute inset-x-0 items-end px-4" pointerEvents="box-none" style={{ bottom: Math.max(insets.bottom, 16) }}>
          <View
            accessibilityLiveRegion="polite"
            className={moderationFeedback.status === 'APPROVED' ? 'w-full max-w-[360px] flex-row items-start gap-3 rounded-[20px] border border-[#bcdcc4] bg-white px-4 py-4 shadow-lg shadow-black/10' : 'w-full max-w-[360px] flex-row items-start gap-3 rounded-[20px] border border-[#e3bdb8] bg-white px-4 py-4 shadow-lg shadow-black/10'}
            role="alert"
          >
            <View className={moderationFeedback.status === 'APPROVED' ? 'h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef8ef]' : 'h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff0ee]'}>
              {moderationFeedback.status === 'APPROVED' ? <CheckCircle2 color={colors.success} size={20} /> : <XCircle color={colors.danger} size={20} />}
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-xs font-bold text-muted-foreground">Decisão registrada</Text>
              <Text className="mt-1 text-base font-extrabold leading-5 text-primary">
                Evento “{moderationFeedback.eventName}” {moderationFeedback.status === 'APPROVED' ? 'aprovado' : 'rejeitado'}.
              </Text>
            </View>
          </View>
        </View>
      ) : null}

    </View>
  );
}

function AdminPlaceCard({ active, place, onApprove, onReject }: {
  active: boolean;
  place: TouristPlace;
  onApprove(): void;
  onReject(): void;
}) {
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
          <Button className="flex-1" disabled={active} onPress={onApprove} variant="secondary"><Text>Aprovar</Text></Button>
          <Button className="flex-1" disabled={active} onPress={onReject} variant="destructive"><Text>Rejeitar</Text></Button>
        </View>
      </CardContent>
    </Card>
  );
}
