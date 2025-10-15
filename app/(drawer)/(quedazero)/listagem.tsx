import AprovacoStatus from "@/components/aprovacaoStatus";
import LoadingScreen from "@/components/carregamento";
import SeletorPeriodo from "@/components/seletorPeriodo";
import StatusIndicator from "@/components/StatusIndicator";
import { useGetActivity } from "@/hooks/atividade/get";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useAuth } from "../../../contexts/authProvider";
import { useItemsStore } from "../../../store/storeOcorrencias";
import { StyledMainContainer } from "../../../styles/StyledComponents";

export default function Mainpage() {

    const router = useRouter();
    const { user } = useAuth();

    const { setitems } = useItemsStore();
    const [pageSize, setPageSize] = useState(20);
    const [type, setType] = useState("Atividade");
    const [openTypeModal, setOpenTypeModal] = useState(false);
    const [openDateModal, setOpenDateModal] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [activeFilters, setActiveFilters] = useState<Array<{ type: 'date' | 'activityType'; label: string; value: any; onRemove: () => void; }>>([]);

    // Calcular startDate e endDate baseado no mês/ano selecionado
    const getDateRange = () => {
        if (selectedMonth === undefined || selectedYear === undefined) {
            return { startDate: null, endDate: null };
        }

        const startDate = new Date(selectedYear, selectedMonth - 1, 1);
        const endDate = new Date(selectedYear, selectedMonth, 0);

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const { startDate, endDate } = getDateRange();
    
    // Só passa startDate e endDate se ambos estiverem definidos
    const { data, refetch } = useGetActivity({ 
        type: type, 
        pagination: true, 
        pageSize: pageSize, 
        startDate: (startDate && endDate) ? startDate : null, 
        endDate: (startDate && endDate) ? endDate : null,
        // Para operadores, mostrar todas as atividades independente do status de aprovação
        approvalStatus: user?.userType === "OPERATIONAL" ? null : null
    });
    
    console.log(data?.length)

    // Sincroniza os filtros ativos
    useEffect(() => {
        const newActiveFilters = [];

        if (selectedMonth !== undefined && selectedYear !== undefined) {
            newActiveFilters.push({
                type: 'date',
                label: `Período: ${monthNames[selectedMonth - 1]}/${selectedYear}`,
                value: { month: selectedMonth, year: selectedYear },
                onRemove: handleClearPeriod
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
    }, [selectedMonth, selectedYear, type]);

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
        }, [refetch])
    );

    // Função para limpar todos os filtros
    const clearFilters = () => {
        setSelectedMonth(undefined);
        setSelectedYear(undefined);
        setType("Atividade");
    };

    // Handler para limpar período no componente
    const handleClearPeriod = () => {
        setSelectedMonth(undefined);
        setSelectedYear(undefined);
    };

    // Handler para confirmar período
    const handleConfirmPeriod = () => {
        setOpenDateModal(false);
    };

    // Meses para exibição nos filtros ativos
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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

    // Filtrar e ordenar os dados
    const filteredAndSortedData = [...data]
        .filter((item) => {
            // Para ADM_CLIENTE, excluir justificativa interna e reprovados
            if (user?.userType === "ADM_CLIENTE" && type === "Atividade") {
                // Excluir atividades com status de justificativa interna
                if (item.statusEnum === "INTERNAL_JUSTIFICATION") {
                    return false;
                }
                // Excluir atividades reprovadas
                if (item.approvalStatus === "REJECTED") {
                    return false;
                }
            }
            
            return true;
        })
        .sort((a, b) => {
            let dateA: Date;
            let dateB: Date;

            if (type === "Atividade") {
                // Para atividades, usar dateTimeOriginal se disponível, senão createdAt
                dateA = new Date((a as any).dateTimeOriginal || a.createdAt);
                dateB = new Date((b as any).dateTimeOriginal || b.createdAt);
            } else {
                // Para ocorrências, usar o campo createdAt
                dateA = new Date(a.createdAt);
                dateB = new Date(b.createdAt);
            }

            return dateB.getTime() - dateA.getTime(); // Ordem decrescente
        });

    const hasActiveFilters = activeFilters.length > 0;
    const isEmpty = filteredAndSortedData.length === 0;

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
                            onPress={() => setOpenDateModal(true)}
                        >
                            <MaterialCommunityIcons name="calendar" size={24} color="black" />
                            <Text>Período</Text>
                            <AntDesign name="down" size={10} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setOpenTypeModal(true)}
                            style={styles.filterButton}
                        >
                            <Text>
                                {type === "Atividade" ? "Atividades" : "Ocorrências"}
                            </Text>
                            <AntDesign name="down" size={10} color="black" />
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Lista de filtros ativos */}
                {renderActiveFilters()}

                {isEmpty ? (
                    <View style={styles.emptyContainer}>
                        <Image
                            style={{ width: 130, height: 130, marginBottom: -20 }}
                            source={require("../../../assets/images/adaptive-icon.png")}
                        />
                        <Text style={styles.emptyTitle}>Nenhum dado encontrado</Text>
                        <Text style={styles.emptySubtitle}>
                            {hasActiveFilters
                                ? "Nenhum resultado encontrado com os filtros selecionados"
                                : user?.userType === "ADM_DIKMA"
                                    ? "Não há atividades ou ocorrências cadastradas"
                                    : "Você ainda não criou nenhuma ocorrência"
                            }
                        </Text>

                        {hasActiveFilters ? (
                            <TouchableOpacity
                                onPress={clearFilters}
                                style={[styles.emptyButton, { backgroundColor: '#E74C3C' }]}
                            >
                                <MaterialIcons name="clear" size={20} color="#fff" />
                                <Text style={styles.emptyButtonText}>Limpar Filtros</Text>
                            </TouchableOpacity>
                        ) : user?.userType !== "ADM_DIKMA" ? (
                            <TouchableOpacity
                                onPress={() => router.push('criarOcorrencia' as never)}
                                style={styles.emptyButton}
                            >
                                <AntDesign name="plus" size={20} color="#fff" />
                                <Text style={styles.emptyButtonText}>Criar Primeira Ocorrência</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : (
                <FlatList
                    data={filteredAndSortedData || []}
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
                )}

                {/* Modal de Seleção de Tipo */}
                <Modal
                    visible={openTypeModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setOpenTypeModal(false)}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setOpenTypeModal(false)}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Selecione o Tipo</Text>
                                <TouchableOpacity onPress={() => setOpenTypeModal(false)}>
                                    <AntDesign name="close" size={24} color="#385866" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={[styles.modalOption, type === "Atividade" && styles.modalOptionSelected]}
                                onPress={() => {
                                    setType("Atividade");
                                    setOpenTypeModal(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, type === "Atividade" && styles.modalOptionTextSelected]}>
                                    Atividades
                                </Text>
                                {type === "Atividade" && <AntDesign name="check" size={20} color="#186B53" />}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalOption, type === "Ocorrencia" && styles.modalOptionSelected]}
                                onPress={() => {
                                    setType("Ocorrencia");
                                    setOpenTypeModal(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, type === "Ocorrencia" && styles.modalOptionTextSelected]}>
                                    Ocorrências
                                </Text>
                                {type === "Ocorrencia" && <AntDesign name="check" size={20} color="#186B53" />}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Componente Seletor de Período */}
                <SeletorPeriodo
                    visible={openDateModal}
                    onClose={() => setOpenDateModal(false)}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                    onClear={handleClearPeriod}
                    onConfirm={handleConfirmPeriod}
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
    // Estilos dos Modais
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#385866',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#f5f5f5',
    },
    modalOptionSelected: {
        backgroundColor: '#e8f5f1',
        borderWidth: 1,
        borderColor: '#186B53',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
    modalOptionTextSelected: {
        color: '#186B53',
        fontWeight: '600',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#385866',
        marginTop: 15,
        marginBottom: 10,
    },
    scrollSection: {
        maxHeight: 150,
        marginBottom: 10,
    },
    confirmButton: {
        backgroundColor: '#186B53',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});