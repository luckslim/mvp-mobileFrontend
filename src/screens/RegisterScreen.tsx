import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, CircleAlert } from 'lucide-react-native';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { createUser } from '../lib/api';
import { colors } from '../theme';
import type { ScreenProps } from '../navigation/types';

export function RegisterScreen({ navigation }: ScreenProps<'Register'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  async function handleSubmit() {
    setFeedback(null);
    const normalizedEmail = email.trim();
    if (!name.trim()) return setFeedback({ kind: 'error', text: 'Digite seu nome para continuar.' });
    if (!normalizedEmail.includes('@')) return setFeedback({ kind: 'error', text: 'Digite um e-mail válido para continuar.' });
    if (password.length < 6) return setFeedback({ kind: 'error', text: 'A senha precisa ter pelo menos 6 caracteres.' });
    if (password !== confirmation) return setFeedback({ kind: 'error', text: 'As senhas precisam ser iguais.' });

    setIsLoading(true);
    try {
      await createUser(name.trim(), normalizedEmail, password);
      setFeedback({ kind: 'success', text: 'Conta criada. Agora entre para conhecer os lugares de Magé.' });
      setTimeout(() => navigation.replace('Login', { role: 'user' }), 700);
    } catch (error) {
      setFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'Não foi possível criar sua conta.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
          <ScrollView contentContainerClassName="mx-auto w-full max-w-[520px] px-6 pb-10" keyboardShouldPersistTaps="handled">
            <Text className="mt-5 text-base font-bold text-primary">Magé Verde</Text>
            <Text className="mt-7 text-4xl font-extrabold tracking-tight">Crie seu acesso</Text>
            <Text className="mt-2 text-base leading-6 text-muted-foreground">Faça parte do guia turístico de Magé.</Text>

            <Card className="mt-7 py-0">
              <CardContent className="gap-5 p-6">
                {feedback ? (
                  <Alert icon={feedback.kind === 'error' ? CircleAlert : CheckCircle2} variant={feedback.kind === 'error' ? 'destructive' : 'default'}>
                    <AlertDescription>{feedback.text}</AlertDescription>
                  </Alert>
                ) : null}
                <Field autoCapitalize="words" label="Nome" onChangeText={setName} placeholder="Como podemos chamar você?" value={name} />
                <Field
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  label="E-mail"
                  onChangeText={setEmail}
                  placeholder="voce@exemplo.com"
                  textContentType="emailAddress"
                  value={email}
                />
                <Field
                  autoCapitalize="none"
                  autoComplete="new-password"
                  label="Senha"
                  onChangeText={setPassword}
                  placeholder="Pelo menos 6 caracteres"
                  secureTextEntry
                  textContentType="newPassword"
                  value={password}
                />
                <Field
                  autoCapitalize="none"
                  autoComplete="new-password"
                  label="Confirme sua senha"
                  onChangeText={setConfirmation}
                  placeholder="Repita a senha"
                  secureTextEntry
                  textContentType="newPassword"
                  value={confirmation}
                />
                <Button className="mt-2 h-14" disabled={isLoading} onPress={handleSubmit} variant="secondary">
                  {isLoading ? <ActivityIndicator color={colors.forest} /> : <Text>Criar conta</Text>}
                </Button>
              </CardContent>
            </Card>

            <Button className="mt-5 self-center" onPress={() => navigation.replace('Login', { role: 'user' })} variant="link">
              <Text>Já tenho uma conta</Text>
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({ label, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <Input className="h-14 bg-background px-4 text-base" {...props} />
    </View>
  );
}
