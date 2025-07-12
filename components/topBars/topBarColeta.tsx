import { formatRouteNameColeta } from "@/utils/formatRouteNameColeta";
import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TopBarProps {
  router: any;
  pathname: string;
}

export function TopBar({ router, pathname }: TopBarProps) {
  const showIcon = pathname === "/ocorrencias";
  const title = formatRouteNameColeta(pathname);

  const handleBack = () => {
    router.back();
  };

  const isHomeOrDashboard = pathname === "/dashboard";

  if (pathname === "/cronograma") {
    return null;
  }

  const navigation = useNavigation() as DrawerNavigationProp<any>;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isHomeOrDashboard ? "#186B53" : "#fff",
        marginTop: 0,
        marginBottom: 0
      }
    ]}>
      <Pressable onPress={() => navigation.openDrawer() as never} style={styles.settingsButton}>
        {!["/mapa", "/detalharOcorrencia", "/detalharAtividade", "/checklist", "/notificacoes"].includes(pathname) && (
          <FontAwesome6
            name="bars-staggered"
            size={28}
            color={isHomeOrDashboard ? "#fff" : "#000"}
          />
        )}

        {(pathname === "/detalharOcorrencia" || pathname === "/detalharAtividade" || pathname === "/checklist" || pathname === "/notificacoes") && (
          <TouchableOpacity onPress={handleBack}>
            <Feather name="chevron-left" size={28} color="#000" />
          </TouchableOpacity>
        )}

        {isHomeOrDashboard && (
          <Text style={styles.textName}>Olá, Warllei</Text>
        )}
      </Pressable>

      {!isHomeOrDashboard && (
        <View style={styles.containerLogo}>
          {showIcon && (
            <MaterialCommunityIcons name="excavator" size={24} color="black" />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {isHomeOrDashboard ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity style={styles.calendarButton}>
            <MaterialCommunityIcons name="calendar" size={18} color="#fff" />
            <Text style={{ fontSize: 15, color: "#fff" }}>12/34</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ position: "relative" }} onPress={() => router.push("/notificacoes" as never)}>
            <View style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, zIndex: 1, backgroundColor: "#FF0000", borderRadius: 50 }} />
            <Feather name="bell" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ backgroundColor: "red", width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: Dimensions.get("window").width,
    alignSelf: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerLogo: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    opacity: 0,
    pointerEvents: "none",
  },
  backButtonVisible: {
    opacity: 1,
    pointerEvents: "auto",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
    marginLeft: 4,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  textName: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "600",
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    borderRadius: 5,
  },
});