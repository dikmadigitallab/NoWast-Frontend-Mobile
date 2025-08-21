// Ocorrencias.tsx
import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import StatusIndicator from "@/components/StatusIndicator";
import { useGetActivity } from "@/hooks/atividade/get";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import MapScreen from "../../../components/renderMapOcorrencias";
import { useAuth } from "../../../contexts/authProvider";
import { useItemsStore } from "../../../store/storeOcorrencias";
import { StyledMainContainer } from "../../../styles/StyledComponents";

export default function Mainpage() {

    const router = useRouter();
    const { user } = useAuth();
    const { data, refetch } = useGetActivity({});
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showMap, setShowMap] = useState(false);
    const [openDate, setOpenDate] = useState(false);
    const { setitems } = useItemsStore();
    const [atividadeSelecionada, setAtividadeSelecionada] = useState({ atividade: "", label: "" });

    useFocusEffect(
        useCallback(() => {
            if (refetch) {
                refetch();
            }
            setDate(undefined);
            setAtividadeSelecionada({ atividade: "", label: "" });
        }, [refetch])
    );

    const onDismissSingle = useCallback(() => {
        setOpenDate(false);
    }, [setOpenDate]);

    const onConfirmSingle = useCallback(
        (params: { date: Date }) => {
            setOpenDate(false);
            setDate(params.date);
        },
        [setOpenDate, setDate]
    );

    const pickerRef = useRef<Picker<string> | null>(null);
    const atividades = ["Atividades", "Ocorrências"];

    function open() {
        pickerRef.current?.focus();
    }

    const onSelected = (data: any, rota: string) => {
        setitems(data);
        router.push(rota as never);
    };

    if (!data) {
        return (<LoadingScreen />)
    }

    const renderAtividadeItem = ({ item }: { item: any }) => {
        const [date, time] = item.dateTime.split(' ');

        return (
            <TouchableOpacity
                onPress={() => onSelected(item, "detalharAtividade")}
                style={styles.mainOccurrenceItem}
            >
                <View style={styles.occurrenceItem}>
                    <View style={styles.photoContainer}>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {item?.activityFiles.length > 1 ? (
                                <Image
                                    source={{ uri: item.activityFiles[0] }}
                                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                                />
                            ) :
                                <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
                            }
                        </View>
                    </View>
                    <View style={styles.detailsSection}>
                        <View style={styles.dateSection}>
                            <Text style={styles.dateTimeText}>{date} / {time}</Text>
                        </View>
                        <View style={styles.locationSection}>
                            <Ionicons name="location" size={15} color="#385866" />
                            <Text style={styles.locationText}>
                                {item.environment}
                            </Text>
                        </View>
                        <View style={styles.locationSection}>
                            <MaterialCommunityIcons name="ruler-square" size={15} color="black" />
                            <Text style={styles.locationText}>
                                Dimensão: {item.dimension}
                            </Text>
                        </View>
                        <View style={styles.locationSection}>
                            <FontAwesome name="user" size={15} color="#385866" />
                            <Text style={styles.locationText}>Responsável: {item.supervisor}</Text>
                        </View>
                        <StatusIndicator status={item.statusEnum} />
                    </View>
                </View>
                <View style={{ width: "100%", height: 40 }}>
                    <AprovacoStatus status={item.approvalStatus} date={item?.approvalDate} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <StyledMainContainer>
            <View style={{ flex: 1 }}>
                {user?.userType === "ADM_DIKMA" && (
                    <View style={{ height: 50, marginBottom: 10 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.filterButtonsContainer}
                        >
                            <TouchableOpacity
                                style={styles.filterButton}
                                onPress={() => setOpenDate(true)}
                            >
                                <MaterialCommunityIcons name="calendar" size={24} color="black" />
                                <Text>Data</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => open()}
                                style={styles.filterButton}
                            >
                                <Text>
                                    {atividadeSelecionada.label ? atividadeSelecionada.label : "Atividades"}
                                </Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterButton}>
                                <Text>Todos</Text>
                                <AntDesign name="caretdown" size={10} color="black" />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}

                <FlatList
                    data={data || []}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => String(item?.id)}
                    contentContainerStyle={{
                        gap: 10,
                        paddingHorizontal: 10,
                        paddingBottom: 20
                    }}
                    renderItem={renderAtividadeItem}
                />

                <Picker
                    style={{ display: "none" }}
                    ref={pickerRef}
                    selectedValue={atividadeSelecionada.atividade}
                    onValueChange={(itemValue, itemIndex) =>
                        setAtividadeSelecionada((prev) => ({
                            ...prev,
                            atividade: itemValue,
                            label: atividades[itemIndex]
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
                    onConfirm={() => onConfirmSingle}
                    presentationStyle="pageSheet"
                    label="Selecione uma data"
                    saveLabel="Confirmar"
                />

                {showMap && (
                    <MapScreen
                        location={undefined}
                        showMap={() => setShowMap(!showMap)}
                    />
                )}

                {user?.userType !== "ADM_DIKMA" && (
                    <TouchableOpacity
                        onPress={() => router.push('criarOcorrencia' as never)}
                        style={styles.containerCreate}
                    >
                        <AntDesign name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        </StyledMainContainer>
    );
}

const styles = StyleSheet.create({
    filterButtonsContainer: {
        gap: 10,
        height: "100%",
        paddingHorizontal: 10
    },
    filterButton: {
        height: 40,
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        flexDirection: "row",
        borderColor: "#d9d9d9",
        backgroundColor: "#eff5f0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
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
    containerCreate: {
        width: 60,
        height: 60,
        position: 'absolute',
        right: 20,
        borderRadius: 10,
        backgroundColor: '#186B53',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 20
    }
});