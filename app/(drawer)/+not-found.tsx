import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Text style={{ fontSize: 30, marginBottom: 20, color: "red" }}>
        404 Página não encontrada
      </Text>
    </View>
  );
}
