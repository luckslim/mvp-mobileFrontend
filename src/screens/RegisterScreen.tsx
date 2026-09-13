import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Axios } from "../utils/axios";

const bodyValidationSchema = z
  .object({
    name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.email("Informe um e-mail válido."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmation: z.string().min(8, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmation"],
  });

type BodyValidationSchema = z.infer<typeof bodyValidationSchema>;

export function RegisterScreen({ navigation }: ScreenProps<"Register">) {
  const [errorState, SetErrorState] = useState<string | null>(null);
  const [messageState, SetMessageState] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BodyValidationSchema>({
    resolver: zodResolver(bodyValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmation: "",
    },
  });

  async function handleRegister({
    name,
    email,
    password,
  }: BodyValidationSchema) {
try {
    SetErrorState(null);
    SetMessageState(null);

    console.log("Enviando:", name, email, password);

    const response = await fetch(
      "https://mvp-mageverde.onrender.com/create/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      },
    );

    console.log("Status:", response.status);

    if (!response.ok) {
      const text = await response.text();

      console.log("Erro:", text);

      SetErrorState("Não foi possível realizar o cadastro.");
      return;
    }

    SetMessageState("Registrado com sucesso!");
    SetErrorState(null);
  } catch (error) {
    console.log("ERRO:", error);

    SetErrorState(
      "Não foi possível conectar com o servidor.",
    );
  }
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
                {errorState ? (
                  <View className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
                    <Text className="text-sm text-red-600">{errorState}</Text>
                  </View>
                ) : null}

                {messageState ? (
                  <View className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <Text className="text-sm text-emerald-700">
                      {messageState}
                    </Text>
                  </View>
                ) : null}

                <View className="gap-2">
                  <Label nativeID="name-label">Nome</Label>
                  <Input
                    accessibilityLabel="Nome"
                    autoCapitalize="words"
                    className="h-14 bg-background px-4 text-base"
                    placeholder="Como podemos chamar você?"
                    {...register("name")}
                    onChangeText={(value) =>
                      setValue("name", value, { shouldValidate: true })
                    }
                  />
                  {errors.name ? (
                    <Text className="text-sm text-red-500">
                      {errors.name.message}
                    </Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Label nativeID="email-label">E-mail</Label>
                  <Input
                    accessibilityLabel="E-mail"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    className="h-14 bg-background px-4 text-base"
                    keyboardType="email-address"
                    placeholder="voce@exemplo.com"
                    textContentType="emailAddress"
                    {...register("email")}
                    onChangeText={(value) =>
                      setValue("email", value, { shouldValidate: true })
                    }
                  />
                  {errors.email ? (
                    <Text className="text-sm text-red-500">
                      {errors.email.message}
                    </Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Label nativeID="password-label">Senha</Label>
                  <Input
                    accessibilityLabel="Senha"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect={false}
                    className="h-14 bg-background px-4 text-base"
                    placeholder="Pelo menos 8 caracteres"
                    secureTextEntry
                    textContentType="newPassword"
                    {...register("password")}
                    onChangeText={(value) =>
                      setValue("password", value, { shouldValidate: true })
                    }
                  />
                  {errors.password ? (
                    <Text className="text-sm text-red-500">
                      {errors.password.message}
                    </Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Label nativeID="confirmation-label">
                    Confirme sua senha
                  </Label>
                  <Input
                    accessibilityLabel="Confirme sua senha"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect={false}
                    className="h-14 bg-background px-4 text-base"
                    placeholder="Repita a senha"
                    secureTextEntry
                    textContentType="newPassword"
                    {...register("confirmation")}
                    onChangeText={(value) =>
                      setValue("confirmation", value, { shouldValidate: true })
                    }
                  />
                  {errors.confirmation ? (
                    <Text className="text-sm text-red-500">
                      {errors.confirmation.message}
                    </Text>
                  ) : null}
                </View>

                <Button
                  className="mt-2 h-14"
                  disabled={isSubmitting}
                  onPress={() => void handleSubmit(handleRegister)()}
                  variant="secondary"
                >
                  {isSubmitting ? (
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
