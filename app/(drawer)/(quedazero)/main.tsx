import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import StatusIndicator from "@/components/StatusIndicator";
import { useGetActivity } from "@/hooks/atividade/get";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { useAuth } from "../../../contexts/authProvider";
import { useItemsStore } from "../../../store/storeOcorrencias";
import { StyledMainContainer } from "../../../styles/StyledComponents";

interface PickerRef {
    open: () => void;
    close: () => void;
    focus: () => void;
    blur: () => void;
    getValue: () => string;
}

export default function Mainpage() {

    const router = useRouter();
    const { user } = useAuth();
    const { setitems } = useItemsStore();
    const [pageSize, setPageSize] = useState(20);
    const [type, setType] = useState("Atividade");
    const [openDate, setOpenDate] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [activeFilters, setActiveFilters] = useState<Array<{ type: 'date' | 'activityType'; label: string; value: any; onRemove: () => void; }>>([]);
    const { data, refetch } = useGetActivity({ type: type, pagination: false, pageSize: pageSize, dateTimeFrom: date ? date.toISOString().split('T')[0] : null });

    // Sincroniza os filtros ativos
    useEffect(() => {
        const newActiveFilters = [];

        if (date) {
            newActiveFilters.push({
                type: 'date',
                label: `Data: ${date.toLocaleDateString('pt-BR')}`,
                value: date,
                onRemove: () => setDate(undefined)
            });
        }

        if (type !== "Atividade") {
            newActiveFilters.push({
                type: 'activityType',
                label: `Tipo: ${type === "Atividade" ? "Atividades" : "Ocorrências"}`,
                value: type,
                onRemove: () => setType("Atividade")
            });
        }

        setActiveFilters(newActiveFilters as { type: "date" | "activityType"; label: string; value: any; onRemove: () => void; }[]);
    }, [date, type]);

    const loadMoreItems = async () => {
        if (isLoadingMore) return;
        setIsLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPageSize(prev => prev + 20);
        setIsLoadingMore(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (refetch) {
                refetch();
            }
        }, [refetch, type])
    );

    const onDismissSingle = useCallback(() => {
        setOpenDate(false);
    }, [setOpenDate]);

    const onConfirmSingle = useCallback(
        (params: { date: CalendarDate }) => {
            setOpenDate(false);
            setDate(params.date || undefined);
        },
        [setOpenDate, setDate]
    );

    const pickerRef = useRef<PickerRef>(null);

    function open() {
        pickerRef.current?.focus();
    }

    // Função para limpar todos os filtros
    const clearFilters = () => {
        setDate(undefined);
        setType("Atividade");
    };

    const onSelected = (data: any, rota: string) => {
        setitems(data);
        router.push(rota as never);
    };

    // Componente para renderizar os filtros ativos
    const renderActiveFilters = () => {
        if (activeFilters.length === 0) {
            return null;
        }

        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.activeFiltersContainer}
                contentContainerStyle={styles.activeFiltersContent}
            >
                {activeFilters.map((filterItem) => (
                    <View key={`${filterItem.type}-${filterItem.value}`} style={styles.filterChip}>
                        <Text style={styles.filterChipText} numberOfLines={1}>
                            {filterItem.label}
                        </Text>
                        <TouchableOpacity
                            onPress={filterItem.onRemove}
                            style={styles.removeFilterButton}
                        >
                            <AntDesign name="close" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    onPress={clearFilters}
                    style={[styles.filterChip, styles.clearAllButton]}
                >
                    <Text style={styles.clearAllText}>Limpar Tudo</Text>
                    <MaterialIcons name="clear" size={14} color="#fff" />
                </TouchableOpacity>
            </ScrollView>
        );
    };

    if (!data) {
        return (<LoadingScreen />)
    }

    if (data.length === 0) {
        return (
            <StyledMainContainer>
                <View style={styles.emptyContainer}>
                    <Image
                        style={{ width: 130, height: 130, marginBottom: -20 }}
                        source={require("../../../assets/images/adaptive-icon.png")}
                    />
                    <Text style={styles.emptyTitle}>Nenhum dado encontrado</Text>
                    <Text style={styles.emptySubtitle}>
                        {user?.userType === "ADM_DIKMA"
                            ? "Não há atividades ou ocorrências cadastradas"
                            : "Você ainda não criou nenhuma ocorrência"
                        }
                    </Text>

                    {user?.userType !== "ADM_DIKMA" && (
                        <TouchableOpacity
                            onPress={() => router.push('criarOcorrencia' as never)}
                            style={styles.emptyButton}
                        >
                            <AntDesign name="plus" size={20} color="#fff" />
                            <Text style={styles.emptyButtonText}>Criar Primeira Ocorrência</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </StyledMainContainer>
        );
    }

    // função para renderizar os itens da lista
    const renderAtividadeItem = ({ item }: { item: any }) => {

        // extrai a data e hora de uma string no formato 'DD/MM/YYYY HH:mm'
        const dateTimeString = item.dateTime || '';
        const [date, time] = dateTimeString.split(' ');

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
                            {item?.activityFiles?.length > 0 ? (
                                item?.activityFiles[0]?.file?.url?.includes('.mp3') || item?.activityFiles[0]?.file?.url?.includes('.wav') ? (
                                    <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
                                ) : (
                                    <Image
                                        source={{ uri: item?.activityFiles[0]?.file?.url }}
                                        style={{ width: "100%", height: "100%", borderRadius: 10 }}
                                    />
                                )
                            ) : item?.justification?.justificationFiles?.length > 0 ? (
                                item?.justification.justificationFiles[0]?.file?.url?.includes('.mp3') || item?.justification.justificationFiles[0]?.file?.url?.includes('.wav') ? (
                                    <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
                                ) : (
                                    <Image
                                        source={{ uri: item?.justification.justificationFiles[0]?.file?.url }}
                                        style={{ width: "100%", height: "100%", borderRadius: 10 }}
                                    />
                                )
                            ) : (
                                <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
                            )}
                        </View>
                    </View>
                    <View style={styles.detailsSection}>
                        <View style={styles.dateSection}>
                            <Text style={styles.dateTimeText}>
                                {date} {time ? `/ ${time}` : ''}
                            </Text>
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

    // função para renderizar os itens da lista
    const renderOcurrenceItem = ({ item }: { item: any }) => {

        // extrai a data e hora de uma string no formato 'DD/MM/YYYY HH:mm'
        const dateTime = new Date(item.createdAt);
        const date = dateTime.toLocaleDateString();
        const time = dateTime.toLocaleTimeString();

        return (
            <TouchableOpacity onPress={() => onSelected(item, "detalharOcorrencia")} style={styles.mainOccurrenceItem}>
                <View style={styles.occurrenceItem}>
                    <View style={styles.photoContainer}>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#f0f0f0',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {item?.imageUrls?.length > 0 ? (
                                <Image
                                    source={{ uri: item?.imageUrls[0] }}
                                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                                />
                            ) : item.justification?.justificationFiles?.length > 0 ? (
                                <Image
                                    source={{ uri: item?.justification?.justificationFiles[0]?.file?.url }}
                                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                                />
                            ) : (
                                <MaterialCommunityIcons name="image-off-outline" size={40} color="#385866" />
                            )}
                        </View>
                    </View>

                    <View style={styles.detailsSection}>
                        <View style={styles.dateSection}>
                            <Text style={styles.dateTimeText}>{date} / {time}</Text>
                        </View>

                        <View style={styles.locationSection}>
                            <Text style={styles.locationText}>
                                Transcrição: {item.transcription}
                            </Text>
                        </View>

                        <View style={styles.locationSection}>
                            <MaterialCommunityIcons name="weight-kilogram" size={15} color="black" />
                            <Text style={styles.locationText}>
                                Peso: {item.weight} kg
                            </Text>
                        </View>

                        <View style={styles.locationSection}>
                            <FontAwesome name="user" size={15} color="#385866" />
                            <Text style={styles.locationText}>
                                Usuário ID: {item.userId}
                            </Text>
                        </View>

                        <StatusIndicator status={item.status} />
                    </View>
                </View>

                <View style={{ width: "100%", height: 40 }}>
                    <AprovacoStatus status={item.approvalStatus} date={item.approvalDate} />
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <StyledMainContainer>
            <View style={{ flex: 1 }}>
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
                                {type === "Atividade" ? "Atividades" : "Ocorrências"}
                            </Text>
                            <AntDesign name="caretdown" size={10} color="black" />
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Lista de filtros ativos */}
                {renderActiveFilters()}

                <FlatList
                    data={data || []}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => String(item?.id)}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={0.1}
                    contentContainerStyle={{
                        gap: 10,
                        paddingHorizontal: 10,
                        paddingBottom: 20
                    }}
                    renderItem={type === "Atividade" ? renderAtividadeItem : renderOcurrenceItem}
                />

                <Picker
                    style={{ display: "none" }}
                    ref={pickerRef as React.MutableRefObject<Picker<string> | null>}
                    selectedValue={type}
                    onValueChange={setType}
                >
                    <Picker.Item label="Atividades" value="Atividade" />
                    <Picker.Item label="Ocorrências" value="Ocorrencia" />
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

                {user?.userType !== "ADM_DIKMA" && (
                    <TouchableOpacity
                        onPress={() => router.push('criarOcorrencia' as never)}
                        style={styles.containerCreate}
                    >
                        <AntDesign name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
            <ProgressBar visible={isLoadingMore} indeterminate={true} progress={1} color={"#00a400"} />
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
    clearFilterButton: {
        backgroundColor: "#E74C3C",
        borderColor: "#C0392B",
    },
    clearFilterButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
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
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 15
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#385866',
        textAlign: 'center'
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#186B53',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14
    },
    // Novos estilos para os filtros ativos
    activeFiltersContainer: {
        maxHeight: 50,
        marginBottom: 10,
    },
    activeFiltersContent: {
        gap: 8,
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#186B53',
        paddingHorizontal: 12,
        height: 35,
        borderRadius: 1000,
        gap: 6,
    },
    filterChipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        maxWidth: 150,
    },
    removeFilterButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 2,
    },
    clearAllButton: {
        backgroundColor: '#E74C3C',
    },
    clearAllText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
});