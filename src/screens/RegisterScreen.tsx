import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { colors } from "../theme";
import type { ScreenProps } from "../navigation/types";

export function RegisterScreen({ navigation }: ScreenProps<"Register">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading] = useState(false);

  async function handleSubmit() {
    return;
  }

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="mx-auto w-full max-w-[520px] px-6 pb-10"
            keyboardShouldPersistTaps="handled"
          >
            <Text className="mt-5 text-base font-bold text-primary">
              Magé Verde
            </Text>
            <Text className="mt-7 text-4xl font-extrabold tracking-tight">
              Crie seu acesso
            </Text>
            <Text className="mt-2 text-base leading-6 text-muted-foreground">
              Faça parte do guia turístico de Magé.
            </Text>

            <Card className="mt-7 py-0">
              <CardContent className="gap-5 p-6">
                <Field
                  autoCapitalize="words"
                  label="Nome"
                  onChangeText={setName}
                  placeholder="Como podemos chamar você?"
                  value={name}
                />
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
                <Button
                  className="mt-2 h-14"
                  disabled={isLoading}
                  onPress={() => void handleSubmit()}
                  variant="secondary"
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.forest} />
                  ) : (
                    <Text>Criar conta</Text>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Button
              className="mt-5 self-center"
              onPress={() => navigation.replace("Login", { role: "user" })}
              variant="link"
            >
              <Text>Já tenho uma conta</Text>
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Field({
  label,
  ...props
}: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <Input className="h-14 bg-background px-4 text-base" {...props} />
    </View>
  );
}
