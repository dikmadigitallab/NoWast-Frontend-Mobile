import { useAuth } from "@/contexts/authProvider";
import { formatRouteNameQuedaZero } from "@/utils/formatRouteNameQuedaZero";
import { Feather, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

interface TopBarProps {
  router: any;
  pathname: string;
  customBack?: () => void
}

export function TopBar({ customBack, router, pathname }: TopBarProps) {

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const title = formatRouteNameQuedaZero(pathname);

  const handleBack = () => {
    customBack ? customBack() : router.back();
  };

  const isHomeOrDashboard = pathname === "/";

  if (pathname === "/cronograma") {
    return null;
  }

  const { user } = useAuth();
  const navigation = useNavigation() as DrawerNavigationProp<any>;
  const showIcons = ["/mapa", "/detalharOcorrencia", "/detalharAtividade", "/checklist", "/notificacoes", "/criarOcorrencia", "/tag"]

  console.log(open)

  const onDismiss = () => setOpen(false);

  const onConfirm = (params: { date: any }) => {
    setOpen(false);
    setSelectedDate(params.date);
  };
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isHomeOrDashboard ? "#186B53" : "#fff",
        marginTop: 0,
        marginBottom: 0
      }
    ]}>

      <DatePickerModal
        locale="pt-BR"
        mode="single"
        visible={open}
        onDismiss={onDismiss}
        date={selectedDate}
        onConfirm={onConfirm}
        presentationStyle="pageSheet"
        label="Selecione uma data"
        saveLabel="Confirmar"
      />

      <Pressable onPress={() => navigation.openDrawer() as never} style={styles.settingsButton}>

        {!showIcons.includes(pathname) && (
          <FontAwesome6
            name="bars-staggered"
            size={28}
            color={isHomeOrDashboard ? "#fff" : "#186b53"}
          />
        )}

        {showIcons.includes(pathname) && (

          <TouchableOpacity onPress={handleBack}>
            <Feather name="chevron-left" size={28} color="#186b53" />
          </TouchableOpacity>
        )}

        {isHomeOrDashboard && (
          <Text style={styles.textName}>Olá, {user?.name?.split(' ')[0]}!</Text>
        )}
      </Pressable>

      {!isHomeOrDashboard && (
        <View style={styles.containerLogo}>
          {pathname === "/main" && (
            <MaterialCommunityIcons name="excavator" size={24} color="#43575f" />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {isHomeOrDashboard ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity style={styles.calendarButton} onPress={() => setOpen(true)} >
            <MaterialCommunityIcons name="calendar" size={18} color="#fff" />
            <Text style={{ fontSize: 15, color: "#fff" }}>{selectedDate ? `${selectedDate.getDate()}/${("0" + (selectedDate.getMonth() + 1)).slice(-2)}` : "Selecione uma data"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ position: "relative" }} onPress={() => router.push("/notificacoes" as never)}>
            <View style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, zIndex: 1, backgroundColor: "#FF0000", borderRadius: 50 }} />
            <Feather name="bell" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        null)}

      {
        !isHomeOrDashboard && (
          <TouchableOpacity style={{ position: "relative", justifyContent: "center", alignItems: "center", width: 30 }} onPress={() => router.push("/notificacoes" as never)}>
            <View style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, zIndex: 1, backgroundColor: "#FF0000", borderRadius: 50 }} />
            <Feather name="bell" size={24} color="#43575f" />
          </TouchableOpacity>
        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    alignSelf: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
    height: "100%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: "#43575f",
    fontWeight: "600",
    marginLeft: 4,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  textName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  calendarButton: {
    zIndex: 999999,
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