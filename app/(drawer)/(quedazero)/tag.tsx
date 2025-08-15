import { StyledMainContainer } from "@/styles/StyledComponents";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ContainerItem {
    id: string;
    ambiente: string;
    dimensao: string;
    predio: string;
    setor: string;
    servico: string;
    tipo: string;
}

export default function Tag() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedContainer, setSelectedContainer] = useState<ContainerItem | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleVincularTag = (container: ContainerItem) => {
        setSelectedContainer(container);
        setModalVisible(true);
    };

    const containerData: ContainerItem[] = [
        {
            id: "CTN-001",
            ambiente: "Externo",
            dimensao: "20x8x8 ft",
            predio: "Prédio A",
            setor: "Logística",
            servico: "Armazenamento",
            tipo: "Seco",
        },
        {
            id: "CTN-002",
            ambiente: "Interno",
            dimensao: "40x8x9.5 ft",
            predio: "Prédio B",
            setor: "Produção",
            servico: "Matéria-prima",
            tipo: "Refrigerado",
        },
        {
            id: "CTN-003",
            ambiente: "Externo",
            dimensao: "20x8x8 ft",
            predio: "Prédio C",
            setor: "Expedição",
            servico: "Embalagem",
            tipo: "Seco",
        },
    ];

    return (
        <StyledMainContainer>
            <View style={styles.container}>
                {containerData.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.header} >
                            <View style={styles.headerContent}>
                                <MaterialCommunityIcons name="cellphone-nfc" size={30} color="#43575f" />
                                <View style={styles.headerText}>
                                    <Text style={styles.idText}>ID: {item.id}</Text>
                                    <Text style={styles.ambienteText}>Ambiente: {item.ambiente}</Text>
                                </View>
                            </View>
                            <MaterialIcons name={expandedId === item.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#555" />
                        </TouchableOpacity>

                        {expandedId === item.id && (
                            <View style={styles.details}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Dimensão:</Text>
                                    <Text style={styles.detailValue}>{item.dimensao}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Prédio:</Text>
                                    <Text style={styles.detailValue}>{item.predio}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Setor:</Text>
                                    <Text style={styles.detailValue}>{item.setor}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Serviço:</Text>
                                    <Text style={styles.detailValue}>{item.servico}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Tipo:</Text>
                                    <Text style={styles.detailValue}>{item.tipo}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleVincularTag(item)}
                                >
                                    <Text style={styles.buttonText}>Vincular Tag</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <MaterialCommunityIcons name="cellphone-nfc" size={50} color="#186b53" />
                            <Text style={styles.modalTitle}>Aproxime a tag ou cartão para vincular a atividade</Text>
                            <Text style={styles.modalInstruction}>Mantenha a tag em contato até que seja concluído.</Text>

                            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCloseButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </StyledMainContainer>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        elevation: 2,
        borderRadius: 8,
        shadowRadius: 4,
        marginBottom: 12,
        shadowOpacity: 0.1,
        shadowColor: "#000",
        backgroundColor: "#fff",
        shadowOffset: { width: 0, height: 2 },
    },
    headerContent: {
        gap: 5,
        width: "80%",
        alignItems: "center",
        flexDirection: "row",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerText: {
        flex: 1,
    },
    idText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    ambienteText: {
        fontSize: 14,
        color: "#666",
    },
    details: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "bold",
    },
    detailValue: {
        fontSize: 14,
        color: "#333",
    },
    button: {
        backgroundColor: "#186b53",
        padding: 20,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modalContainer: {
        gap: 5,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width * 0.8,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#43575f',
        textAlign: 'center',
    },
    modalInstruction: {
        fontSize: 14,
        marginBottom: 24,
        color: '#43575f',
        textAlign: 'center',
    },
    modalCloseButton: {
        padding: 20,
        width: '100%',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        borderColor: "#d7ddd9",
        backgroundColor: '#fff',
    },
    modalCloseButtonText: {
        color: '#43575f',
        fontWeight: 'bold',
    },
});