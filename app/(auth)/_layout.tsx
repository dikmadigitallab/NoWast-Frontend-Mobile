import { AuthProvider } from '@/auth/authProvider';
import StatusBarComponent from '@/components/statusBar';
import { useAuthStore } from '@/store/storeApp';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import ProtectRoute from './login';
import SelecionarStack from './selecionar-stack';

export default function RootLayout() {

  const { userType } = useAuthStore();

  return (
    <AuthProvider>
      <ProtectRoute>
        <StatusBarComponent />
        {userType === null ? (<SelecionarStack />) : (
          <Drawer
            drawerContent={() => <SelecionarStack />}
            backBehavior="history"
            screenOptions={{
              headerShown: false,
              drawerStyle: { width: '80%' },
              drawerType: 'slide',
              drawerPosition: 'left',
            }}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(quedazero)" />
              <Stack.Screen name="(coleta)" />
              <Stack.Screen name="(residuos)" />
              <Stack.Screen name="perfil" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </Drawer>
        )}
      </ProtectRoute>
    </AuthProvider>
  );
}
