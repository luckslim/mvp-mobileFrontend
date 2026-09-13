import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, MapPin, Send, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation/types';

export function CreatePlaceScreen({ navigation }: ScreenProps<'CreatePlace'>) {
  const [name, setName] = useState('');
  const [suggestedVisitTime, setSuggestedVisitTime] = useState('');
  const [location, setLocation] = useState('');
  const [responsibleParty, setResponsibleParty] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<{ uri: string; name: string; mimeType: string } | null>(null);
  const [isLoading] = useState(false);

  async function chooseImage() {
    setImage({
      mimeType: 'image/jpeg',
      name: 'foto.jpg',
      uri: '',
    });
  }

  async function handleSubmit() {
    return;
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor={colors.forest} />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView
            contentContainerClassName="mx-auto w-full max-w-[720px] pb-10"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="relative overflow-hidden bg-primary px-6 pb-9 pt-3">
              <View className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-secondary/25" />
              <Button className="-ml-3 self-start" onPress={() => navigation.goBack()} variant="ghost">
                <ArrowLeft color={colors.leaf} size={18} />
                <Text className="text-primary-foreground">Voltar ao guia</Text>
              </Button>
              <View className="mt-8 flex-row items-center gap-2">
                <Sparkles color={colors.leaf} size={17} />
                <Text className="font-bold text-secondary">Contribua com a cidade</Text>
              </View>
              <Text className="mt-3 max-w-[430px] text-[32px] font-extrabold leading-9 tracking-tight text-primary-foreground">
                Compartilhe um lugar que vale a visita.
              </Text>
              <Text className="mt-3 max-w-[440px] text-[15px] leading-6 text-primary-foreground/75">
                Conte para outras pessoas por que esse canto de Magé merece entrar no roteiro.
              </Text>
            </View>

            <View className="-mt-5 px-5">
              <Card className="rounded-[28px] border-0 py-0 shadow-lg">
                <CardContent className="gap-5 p-5">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
                      <MapPin color={colors.forest} size={19} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-extrabold">Informações do lugar</Text>
                      <Text className="mt-0.5 text-sm text-muted-foreground">Preencha o que um visitante precisa saber.</Text>
                    </View>
                  </View>

                  <View className="gap-2">
                    <Label>Foto principal</Label>
                    <Button
                      accessibilityLabel={image ? 'Trocar foto do lugar' : 'Adicionar foto do lugar'}
                      className="h-48 w-full overflow-hidden rounded-2xl border border-dashed border-primary/35 bg-background p-0"
                      onPress={() => void chooseImage()}
                      variant="ghost"
                    >
                      {image ? (
                        <View className="relative h-full w-full">
                          <Image accessibilityIgnoresInvertColors resizeMode="cover" source={{ uri: image.uri }} className="h-full w-full" />
                          <View className="absolute bottom-3 right-3 flex-row items-center gap-2 rounded-full bg-primary px-3 py-2">
                            <Camera color={colors.leaf} size={15} />
                            <Text className="text-xs font-bold text-primary-foreground">Trocar foto</Text>
                          </View>
                        </View>
                      ) : (
                        <View className="items-center px-5">
                          <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary">
                            <Camera color={colors.forest} size={23} />
                          </View>
                          <Text className="mt-3 font-extrabold text-primary">Adicione uma foto do lugar</Text>
                          <Text className="mt-1 text-center text-sm text-muted-foreground">Uma imagem ajuda outras pessoas a reconhecerem o destino.</Text>
                        </View>
                      )}
                    </Button>
                  </View>

                  <Field label="Nome do lugar" onChangeText={setName} placeholder="Ex.: Poço da Laje" value={name} />
                  <Field
                    label="Horário sugerido para visita"
                    onChangeText={setSuggestedVisitTime}
                    placeholder="Ex.: das 8h às 16h"
                    value={suggestedVisitTime}
                  />
                  <Field label="Onde fica?" onChangeText={setLocation} placeholder="Ex.: Suruí, Magé" value={location} />
                  <Field
                    label="Quem cuida do local?"
                    helper="Opcional — se não souber, deixaremos como comunidade."
                    onChangeText={setResponsibleParty}
                    placeholder="Ex.: associação local"
                    value={responsibleParty}
                  />
                  <Field
                    label="Sobre o lugar"
                    multiline
                    numberOfLines={5}
                    onChangeText={setDescription}
                    placeholder="Conte como é o lugar, o que há para fazer e algum cuidado importante."
                    textAlignVertical="top"
                    value={description}
                  />

                  <View className="mt-1 gap-3">
                    <Button className="h-14 rounded-2xl" disabled={isLoading} onPress={() => void handleSubmit()} variant="secondary">
                      {isLoading ? <ActivityIndicator color={colors.forest} /> : <Send color={colors.forest} size={17} />}
                      <Text>Enviar lugar</Text>
                    </Button>
                    <Button disabled={isLoading} onPress={() => navigation.goBack()} variant="ghost">
                      <Text>Cancelar</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({ label, helper, ...props }: React.ComponentProps<typeof Input> & { label: string; helper?: string }) {
  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <Input className="h-14 rounded-xl bg-background px-4 text-base" {...props} />
      {helper ? <Text className="text-xs leading-4 text-muted-foreground">{helper}</Text> : null}
    </View>
  );
}
