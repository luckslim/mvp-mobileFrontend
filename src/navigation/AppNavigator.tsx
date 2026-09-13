import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../theme";
import type { RootStackParamList } from "../types";
import { AdminScreen } from "../screens/AdminScreen";
import { CreatePlaceScreen } from "../screens/CreateEventScreen";
import { PlaceDetailsScreen } from "../screens/EventDetailsScreen";
import { PlacesScreen } from "../screens/EventsScreen";
import { LoginAdminScreen } from "../screens/LoginAdmin";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          contentStyle: { backgroundColor: colors.paper },
          headerBackTitle: "Voltar",
          headerTintColor: colors.forest,
          headerTitleStyle: { color: colors.ink, fontWeight: "700" },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginAdmin"
          component={LoginAdminScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: "Criar conta" }}
        />
        <Stack.Screen
          name="Places"
          component={PlacesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetailsScreen}
          options={{ title: "Detalhes do lugar" }}
        />
        <Stack.Screen
          name="CreatePlace"
          component={CreatePlaceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: "Moderação" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
