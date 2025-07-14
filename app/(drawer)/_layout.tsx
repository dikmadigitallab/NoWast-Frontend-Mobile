import { AuthProvider } from '@/auth/authProvider';
import StatusBarComponent from '@/components/statusBar';
import { useAuthStore } from '@/store/storeApp';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import AuthRouter from './login';
import SelecionarStack from './selecionar-stack';

export default function RootLayout() {
  
  const { userType } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [userType]);

  if (userType === null) {
    return (
      <AuthProvider>
        <AuthRouter>
          <StatusBarComponent />
          <SelecionarStack />
        </AuthRouter>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AuthRouter>
        {loading && (
                <View style={{ flex: 1, position: 'absolute', zIndex: 999, width:  Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#00A614" />
                </View>
        )}
        <StatusBarComponent />
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
      </AuthRouter>
    </AuthProvider>
  );
}