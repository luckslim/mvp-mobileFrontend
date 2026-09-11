import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { CircleAlert, Trash2 } from 'lucide-react-native';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useAuth } from '../auth/AuthContext';
import { deleteTouristPlace } from '../lib/api';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation/types';

export function PlaceDetailsScreen({ navigation, route }: ScreenProps<'PlaceDetails'>) {
  const { session } = useAuth();
  const { place } = route.params;
  const hasImage = Boolean(place.imageUrl && place.imageUrl !== 'Undefined');
  const isAdmin = session?.role === 'admin';
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function removePublishedPlace() {
    if (!session) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteTouristPlace(session.token, place.id);
      setIsDeleteDialogOpen(false);
      navigation.goBack();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Não foi possível retirar o evento do guia.');
    } finally {
      setIsDeleting(false);
    }
  }

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

          {isAdmin && place.status === 'APPROVED' ? (
            <View className="mt-7 border-t border-border pt-6">
              {deleteError ? (
                <Alert className="mt-4" icon={CircleAlert} variant="destructive">
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              ) : null}

              <Button className="mt-4 h-12" disabled={isDeleting} onPress={() => setIsDeleteDialogOpen(true)} variant="destructive">
                <Trash2 color={colors.white} size={16} />
          <Text>{isDeleting ? 'Retirando evento...' : 'Retirar evento'}</Text>
              </Button>
            </View>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
        <DialogTitle>Retirar evento?</DialogTitle>
            <DialogDescription>
              “{place.name}” será removido do guia público. Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isDeleting} onPress={() => setIsDeleteDialogOpen(false)} variant="outline">
              <Text>Cancelar</Text>
            </Button>
            <Button disabled={isDeleting} onPress={() => void removePublishedPlace()} variant="destructive">
              {isDeleting ? <ActivityIndicator color={colors.white} /> : <Trash2 color={colors.white} size={16} />}
              <Text>{isDeleting ? 'Retirando...' : 'Confirmar retirada'}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollView>
  );
}
