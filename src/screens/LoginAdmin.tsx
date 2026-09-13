import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Compass, MapPin } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuth } from "../auth/AuthContext";
import type { ScreenProps } from "../navigation/types";
import { colors } from "../theme";
import type { UserRole } from "../types";

const bodyValidationSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

type BodyValidationSchema = z.infer<typeof bodyValidationSchema>;

type LoginAdminProps = ScreenProps<"LoginAdmin">;

export function LoginAdminScreen({ navigation }: LoginAdminProps) {
  const role: UserRole = "admin";
  const [errorState, SetErrorState] = useState<string | null>(null);
  const [messageState, SetMessageState] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BodyValidationSchema>({
    resolver: zodResolver(bodyValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin({ email, password }: BodyValidationSchema) {
    try {
      SetErrorState(null);
      SetMessageState(null);
      const response = await fetch(
        "https://mvp-mageverde.onrender.com/authenticate/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const rawBody = await response.text();
      console.log("Resposta do login:", rawBody);

      let payload: Record<string, unknown> | null = null;

      try {
        payload = rawBody
          ? (JSON.parse(rawBody) as Record<string, unknown>)
          : null;
      } catch {
        payload = null;
      }

      const token =
        typeof payload?.access_Token === "string"
          ? payload.access_Token
          : typeof payload?.accessToken === "string"
            ? payload.accessToken
            : typeof payload?.token === "string"
              ? payload.token
              : typeof payload?.jwt === "string"
                ? payload.jwt
                : null;

      console.log("JWT recebido:", token);

      if (!response.ok) {
        const message =
          (payload?.message as string | undefined) ??
          (payload?.error as string | undefined) ??
          "E-mail ou senha inválidos.";

        SetErrorState(message);
        return;
      }

      if (!token) {
        SetErrorState("Resposta do servidor não contém um token válido.");
        return;
      }

      await signIn(email, password, role, token);
      SetMessageState("Login realizado com sucesso!");
      navigation.navigate("Admin");
    } catch (error) {
      console.log("ERRO:", error);
      SetErrorState("Não foi possível conectar com o servidor.");
    }
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor={colors.forest} />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="grow pb-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="relative min-h-[332px] overflow-hidden bg-primary px-6 pb-[70px] pt-6">
              <View className="absolute -right-[112px] -top-[104px] h-[276px] w-[276px] rounded-full border border-secondary/20" />
              <View className="absolute -right-[52px] -top-[44px] h-[156px] w-[156px] rounded-full bg-primary-foreground/5" />
              <View className="absolute -bottom-16 right-8 h-36 w-36 rounded-full border border-secondary/10" />

              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                  <Compass color={colors.forest} size={23} strokeWidth={2.2} />
                </View>
                <View className="ml-3">
                  <Text className="text-xl font-extrabold tracking-tight text-primary-foreground">
                    Magé Verde
                  </Text>
                  <Text className="mt-0.5 text-xs font-medium text-primary-foreground/65">
                    Guia de experiências locais
                  </Text>
                </View>
                <View className="ml-auto h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5">
                  <MapPin color={colors.leaf} size={18} strokeWidth={2.1} />
                </View>
              </View>

              <View className="mt-9">
                <Text className="text-sm font-semibold text-secondary">
                  Área de administração
                </Text>
                <Text className="mt-2 max-w-[370px] text-4xl font-extrabold leading-10 tracking-tight text-primary-foreground">
                  Cuide dos lugares que fazem Magé especial.
                </Text>
                <Text className="mt-4 max-w-[370px] text-base leading-6 text-primary-foreground/75">
                  Entre para revisar, publicar e organizar os lugares
                  cadastrados.
                </Text>
              </View>
            </View>

            <Card className="mx-auto -mt-9 w-[92%] max-w-[520px] rounded-t-3xl border-0 px-0 py-0 shadow-lg">
              <CardContent className="px-6 pb-7 pt-7">
                <View className="mb-6 h-1.5 w-11 rounded-full bg-secondary" />
                <Text className="text-2xl font-extrabold tracking-tight">
                  Entrar como administrador
                </Text>
                <Text className="mt-2 leading-6 text-muted-foreground">
                  Use o acesso administrativo disponibilizado pelo projeto.
                </Text>

                {errorState ? (
                  <View className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2">
                    <Text className="text-sm text-red-600">{errorState}</Text>
                  </View>
                ) : null}

                {messageState ? (
                  <View className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <Text className="text-sm text-emerald-700">
                      {messageState}
                    </Text>
                  </View>
                ) : null}

                <View className="mt-5 gap-2">
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

                <View className="mt-5 gap-2">
                  <Label nativeID="password-label">Senha</Label>
                  <View className="flex-row items-center rounded-md border border-input bg-background">
                    <Input
                      accessibilityLabel="Senha"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect={false}
                      className="h-14 flex-1 border-0 bg-transparent px-4 text-base shadow-none"
                      placeholder="Sua senha"
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      {...register("password")}
                      onChangeText={(value) =>
                        setValue("password", value, { shouldValidate: true })
                      }
                    />
                    <Button
                      accessibilityLabel={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      className="mr-1"
                      onPress={() => setShowPassword((current) => !current)}
                      size="sm"
                      variant="ghost"
                    >
                      <Text>{showPassword ? "ocultar" : "mostrar"}</Text>
                    </Button>
                  </View>
                  {errors.password ? (
                    <Text className="text-sm text-red-500">
                      {errors.password.message}
                    </Text>
                  ) : null}
                </View>

                <Button
                  className="mt-6 h-14"
                  disabled={isSubmitting}
                  onPress={() => void handleSubmit(handleLogin)()}
                  variant="secondary"
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.forest} />
                  ) : (
                    <Text>Entrar na conta</Text>
                  )}
                </Button>

                <Button
                  className="mt-5 self-center"
                  onPress={() => navigation.navigate("Login")}
                  variant="link"
                >
                  <Text>acesso de usuários</Text>
                </Button>
              </CardContent>
            </Card>
            <Text className="mt-5 self-center text-xs text-muted-foreground">
              Magé Verde · turismo em Magé
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
