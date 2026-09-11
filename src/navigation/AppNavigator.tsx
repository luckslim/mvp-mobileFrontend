import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';
import { AdminScreen } from '../screens/AdminScreen';
import { CreatePlaceScreen } from '../screens/CreateEventScreen';
import { PlaceDetailsScreen } from '../screens/EventDetailsScreen';
import { PlacesScreen } from '../screens/EventsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.forest} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: colors.paper },
          headerBackTitle: 'Voltar',
          headerTintColor: colors.forest,
          headerTitleStyle: { color: colors.ink, fontWeight: '700' },
        }}
      >
        {session ? (
          <>
            <Stack.Screen
              name="Places"
              component={PlacesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PlaceDetails"
              component={PlaceDetailsScreen}
              options={{ title: 'Detalhes do lugar' }}
            />
            <Stack.Screen
              name="CreatePlace"
              component={CreatePlaceScreen}
              options={{ headerShown: false }}
            />
            {session.role === 'admin' ? (
              <Stack.Screen
                name="Admin"
                component={AdminScreen}
                options={{ title: 'Moderação' }}
              />
            ) : null}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Criar conta' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.paper,
    flex: 1,
    justifyContent: 'center',
  },
});
