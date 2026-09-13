import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Compass, MapPin } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import type { ScreenProps } from '../navigation/types';
import { colors } from '../theme';
import type { UserRole } from '../types';

type LoginProps = ScreenProps<'Login'>;

export function LoginScreen({ navigation, route }: LoginProps) {
  const role: UserRole = route.params?.role ?? 'user';
  const isAdmin = role === 'admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading] = useState(false);

  async function handleSubmit() {
    return;
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor={colors.forest} />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView contentContainerClassName="grow pb-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="relative min-h-[332px] overflow-hidden bg-primary px-6 pb-[70px] pt-6">
              <View className="absolute -right-[112px] -top-[104px] h-[276px] w-[276px] rounded-full border border-secondary/20" />
              <View className="absolute -right-[52px] -top-[44px] h-[156px] w-[156px] rounded-full bg-primary-foreground/5" />
              <View className="absolute -bottom-16 right-8 h-36 w-36 rounded-full border border-secondary/10" />

              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <Compass color={colors.forest} size={23} strokeWidth={2.2} />
                </View>
                <View className="ml-3">
                  <Text className="text-xl font-extrabold tracking-tight text-primary-foreground">Magé Verde</Text>
                  <Text className="mt-0.5 text-xs font-medium text-primary-foreground/65">Guia de experiências locais</Text>
                </View>
                <View className="ml-auto h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5">
                  <MapPin color={colors.leaf} size={18} strokeWidth={2.1} />
                </View>
              </View>

              <View className="mt-9">
                <Text className="text-sm font-semibold text-secondary">
                  {isAdmin ? 'Área de administração' : 'Descubra Magé'}
                </Text>
                <Text className="mt-2 max-w-[370px] text-4xl font-extrabold leading-10 tracking-tight text-primary-foreground">
                  {isAdmin ? 'Cuide dos lugares que fazem Magé especial.' : 'Conheça os lugares que fazem Magé especial.'}
                </Text>
                <Text className="mt-4 max-w-[370px] text-base leading-6 text-primary-foreground/75">
                  {isAdmin
                    ? 'Entre para revisar, publicar e organizar os lugares cadastrados.'
                    : 'Entre para descobrir trilhas, cachoeiras e pontos turísticos perto de você.'}
                </Text>
              </View>
            </View>

            <Card className="mx-auto -mt-9 w-[92%] max-w-[520px] rounded-t-3xl border-0 px-0 py-0 shadow-lg">
              <CardContent className="px-6 pb-7 pt-7">
                <View className="mb-6 h-1.5 w-11 rounded-full bg-secondary" />
                <Text className="text-2xl font-extrabold tracking-tight">
                  {isAdmin ? 'Entrar como administrador' : 'Conheça Magé'}
                </Text>
                <Text className="mt-2 leading-6 text-muted-foreground">
                  {isAdmin
                    ? 'Use o acesso administrativo disponibilizado pelo projeto.'
                    : 'Acesse sua conta para explorar os lugares turísticos de Magé.'}
                </Text>

                <View className="mt-5 gap-2">
                  <Label nativeID="email-label">E-mail</Label>
                  <Input
                    accessibilityLabel="E-mail"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    className="h-14 bg-background px-4 text-base"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="voce@exemplo.com"
                    textContentType="emailAddress"
                    value={email}
                  />
                </View>

                <View className="mt-5 gap-2">
                  <Label nativeID="password-label">Senha</Label>
                  <View className="flex-row items-center rounded-md border border-input bg-background">
                    <Input
                      accessibilityLabel="Senha"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect={false}
                      className="h-14 flex-1 border-0 bg-transparent px-4 text-base shadow-none"
                      onChangeText={setPassword}
                      placeholder="Sua senha"
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      value={password}
                    />
                    <Button
                      accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      className="mr-1"
                      onPress={() => setShowPassword((current) => !current)}
                      size="sm"
                      variant="ghost"
                    >
                      <Text>{showPassword ? 'ocultar' : 'mostrar'}</Text>
                    </Button>
                  </View>
                </View>

                <Button className="mt-6 h-14" disabled={isLoading} onPress={() => void handleSubmit()} variant="secondary">
                  {isLoading ? <ActivityIndicator color={colors.forest} /> : <Text>Entrar na conta</Text>}
                </Button>

                {!isAdmin ? (
                  <>
                    <View className="my-6 flex-row items-center gap-3">
                      <Separator className="flex-1" />
                      <Text className="text-sm text-muted-foreground">ou</Text>
                      <Separator className="flex-1" />
                    </View>
                    <Button onPress={() => navigation.navigate('Register')} variant="outline">
                      <Text>Criar uma conta</Text>
                    </Button>
                  </>
                ) : null}

                <Button
                  className="mt-5 self-center"
                  onPress={() => navigation.navigate('Login', { role: isAdmin ? 'user' : 'admin' })}
                  variant="link"
                >
                  <Text>{isAdmin ? 'Voltar para o acesso de usuário' : 'Acesso administrativo'}</Text>
                </Button>
              </CardContent>
            </Card>
            <Text className="mt-5 self-center text-xs text-muted-foreground">Magé Verde · turismo em Magé</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
