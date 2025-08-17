import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Dimensions, LogBox, StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/contexts/authProvider";
import { useModuleStore } from "@/store/moduleStore";
import { Toasts } from "@backpackapp-io/react-native-toast";

import AuthRouter from "./authRoute";
import SelecionarStack from "./selecionar-stack";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf") });

  const { moduleType } = useModuleStore();
  const [loading, setLoading] = useState(false);

  LogBox.ignoreLogs([
    "Warning: Invalid prop `style` supplied to `React.Fragment`",
  ]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [moduleType]);

  if (!fontsLoaded) {
    return null;
  }

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
      <RootSiblingParent>
        <AuthProvider>
          {loading && (
            <View
              style={{
                flex: 1,
                position: "absolute",
                zIndex: 999,
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#00A614" />
            </View>
          )}
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <Drawer
            drawerContent={() => <SelecionarStack />}
            backBehavior="history"
            screenOptions={{
              headerShown: false,
              drawerStyle: { width: "80%" },
              drawerType: "slide",
              drawerPosition: "left",
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
      </RootSiblingParent>
    </SafeAreaProvider>
  );
}
