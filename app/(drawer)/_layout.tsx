import { AuthProvider } from '@/contexts/authProvider';
import { useModuleStore } from '@/store/moduleStore';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthRouter from './authRoute';
import SelecionarStack from './selecionar-stack';

export default function RootLayout() {

  const { moduleType } = useModuleStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [moduleType]);

  if (moduleType === null) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Toasts />
        <AuthProvider>
          <AuthRouter>
            <SelecionarStack />
          </AuthRouter>
        </AuthProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {loading && (
          <View style={{ flex: 1, position: 'absolute', zIndex: 999, width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: "#fff", justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#00A614" />
          </View>
        )}
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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
      </AuthProvider>
    </SafeAreaProvider>

  );
}