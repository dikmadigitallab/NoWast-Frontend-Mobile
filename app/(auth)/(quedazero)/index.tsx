// Ocorrencias.tsx
import AprovacoStatus from "@/components/aprovacaoStatus";
import { customTheme } from "@/config/inputsTheme";
import { getStatusColor } from "@/utils/statusColor";
import { AntDesign, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { FlatList, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { useAuth } from "../../../auth/authProvider";
import BotaoCriarOcorrencia from "../../../components/botaoCriarOcorrencia";
import MapScreen from "../../../components/renderMapOcorrencias";
import { Dados } from "../../../data";
import { useOcorrenciasStore } from "../../../store/storeOcorrencias";
import { StatusContainer, StyledMainContainer } from "../../../styles/StyledComponents";
export default function Ocorrencias() {

    const router = useRouter();
    const { user } = useAuth();
    const [showMap, setShowMap] = useState(false);
    const { setOcorrenciaSelecionada } = useOcorrenciasStore();
    const [atividadeSelecionada, setAtividadeSelecionada] = useState({ atividade: "", label: "" });
    const [date, setDate] = useState(undefined);
    const [openDate, setOpenDate] = useState(false);

    const onDismissSingle = useCallback(() => {
        setOpenDate(false);
    }, [setOpenDate]);

    const onConfirmSingle = useCallback(
        (params: any) => {
            setOpenDate(false);
            setDate(params.date);
        },
        [setOpenDate, setDate]
    );

    const pickerRef = useRef<any>(null);

    const atividades = ["Atividades", "Ocorrências"];

    function open() {
        pickerRef.current?.focus();
    }

    const onSelected = (data: any, rota: string) => {
        setOcorrenciaSelecionada(data);
        router.push(rota as never);
    };

    const dataForUser =
        (() => {
            if (user?.tipoColaborador.id === 1) {
                return Dados.filter(atividade => atividade.aprovacao === null);
            }
            if (user?.tipoColaborador.id === 3) {
                return Dados.filter(atividade =>
                    atividade.tipo === 1 &&
                    (atividade.status === "Aberto" || atividade.status === "Pendente")
                );
            }
            return Dados.filter(atividade => atividade.aprovacao !== null);
        })();

    return (
        <>
            <StyledMainContainer>
                {user?.tipoColaborador.id !== 3 &&
                    <View style={{ height: 50, marginBottom: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterButtonsContainer}>
                            <TouchableOpacity style={styles.filterButton} onPress={() => setOpenDate(true)}>
                                <MaterialCommunityIcons name="calendar" size={24} color="black" />
                                <Text>Data</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => open()} style={styles.filterButton}>
                                <Text>{atividadeSelecionada.label ? atividadeSelecionada.label : "Atividades"}
                                </Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text>Siterização</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text>Pessoa</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text>Atividades</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text>Aprovadas</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                }
                <FlatList
                    data={dataForUser}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => String(item?.id)}
                    contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
                    renderItem={({ item, index }: any) => (
                        <TouchableOpacity onPress={() => onSelected(item, item.tipo === 1 ? "detalharAtividade" : "detalharOcorrencia")} style={styles.mainOccurrenceItem}>
                            <View style={styles.occurrenceItem}>
                                <View style={styles.photoContainer}>
                                    {item?.foto?.[0] && (
                                        <ImageBackground
                                            source={item.foto[0]}
                                            style={{ width: "100%", height: "100%" }}
                                            resizeMode="cover"
                                            imageStyle={styles.imageStyle}
                                        />
                                    )}
                                </View>
                                <View style={styles.detailsSection}>
                                    <View style={styles.dateSection}>
                                        <Text style={styles.dateTimeText}>{item?.data} / {item?.hora}</Text>
                                    </View>
                                    <View style={styles.locationSection}>
                                        <Ionicons name="location" size={15} color="#385866" />
                                        <Text style={styles.locationText}>
                                            {item?.localizacao?.local} -  {item?.localizacao?.origem}
                                        </Text>
                                    </View>
                                    <View style={styles.locationSection}>
                                        <MaterialCommunityIcons name="weight" size={15} color="black" />
                                        <Text style={styles.locationText}>
                                            {item?.peso}
                                        </Text>
                                    </View>
                                    <View style={styles.locationSection}>
                                        <FontAwesome name="user" size={15} color="#385866" />
                                        <Text style={styles.locationText}>{item?.nome}</Text>
                                    </View>
                                    <StatusContainer backgroundColor={getStatusColor(item?.status)}>
                                        <Text style=
                                            {[styles.statusText, { color: "#fff" }]}>
                                            {item?.status === "Concluído" ? `Concluído em ${item?.dataConclusao} / ${item?.horaConclusao}` : item?.status}
                                        </Text>
                                    </StatusContainer>
                                </View>
                            </View>
                            <View style={{ width: "100%", height: 40 }}>
                                <AprovacoStatus status={item.aprovacao !== null ? item.aprovacao : "Sem Aprovacao"} date={item.dataAprovacao} />
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <PaperProvider theme={customTheme}>
                    <Picker
                        style={{ display: "none" }}
                        ref={pickerRef}
                        selectedValue={atividadeSelecionada.atividade}
                        onValueChange={(itemValue, itemIndex) =>
                            setAtividadeSelecionada((prev) => ({
                                ...prev,
                                atividade: itemValue,
                                label: atividades[itemIndex],
                            }))
                        }
                    >
                        <Picker.Item label="Atividades" value="atividades" />
                        <Picker.Item label="Ocorrências" value="ocorrências" />
                    </Picker>
                    <DatePickerModal
                        locale="pt-BR"
                        mode="single"
                        visible={openDate}
                        onDismiss={onDismissSingle}
                        date={date}
                        onConfirm={onConfirmSingle}
                        presentationStyle="pageSheet"
                        label="Selecione uma data"
                        saveLabel="Confirmar"
                    />

                </PaperProvider>
            </StyledMainContainer>
            {showMap ? (
                <MapScreen location={location} showMap={() => setShowMap(!showMap)} />
            ) : null}
            <BotaoCriarOcorrencia />
        </>
    );
}

const styles = StyleSheet.create({
    filterButtonsContainer: {
        gap: 10,
        height: "100%",
        paddingHorizontal: 10
    },
    filterButton: {
        height: 50,
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 0.5,
        flexDirection: "row",
        borderColor: "#d9d9d9",
        backgroundColor: "#fff"
    },
    mainOccurrenceItem: {
        width: "100%",
        height: 210,
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        justifyContent: "space-between",
        borderWidth: 0.5,
        borderColor: "#d9d9d9",
        borderRadius: 10,
        overflow: "hidden"
    },
    occurrenceItem: {
        width: "100%",
        height: "80%",
        padding: 7,
        flexDirection: "row",
        gap: 10
    },
    containerCheck: {
        width: "100%",
        height: "20%",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#00A614"
    },
    imageStyle: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#fff",
    },
    dateTimeText: {
        fontSize: 16,
        fontWeight: "800",
    },
    locationText: {
        letterSpacing: -0.5,
    },
    completionText: {
        paddingLeft: 4,
        fontSize: 10,
        fontWeight: "600",
    },
    photoContainer: {
        width: "35%",
        height: "100%",
    },
    detailsSection: {
        width: "60%",
        height: "100%",
        paddingRight: 10,
        gap: 6,
    },
    dateSection: {
        gap: 3,
        flexDirection: "row",
        alignItems: "center",
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },
    locationSection: {
        gap: 3,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});

