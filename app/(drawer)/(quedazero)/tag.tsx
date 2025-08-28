import { useGet } from "@/hooks/crud/get/get";
import { StyledMainContainer } from "@/styles/StyledComponents";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

interface ContainerItem {
    id: string;
    ambiente: string;
    dimensao: string;
    predio: string;
    setor: string;
    servico: string;
    tipo: string;
    ambienteId: number;
}

export default function Tag() {

    const [isWriting, setIsWriting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [nfcError, setNfcError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
    const { data: ambientes, loading, error } = useGet({ url: 'environment' });
    const [selectedContainer, setSelectedContainer] = useState<ContainerItem | null>(null);

    // Inicializar NFC
    useEffect(() => {
        const checkNfc = async () => {
            try {
                // Verificação mais segura do suporte NFC
                let supported = false;
                try {
                    supported = await NfcManager.isSupported();
                    // Garantir que supported seja boolean
                    supported = supported === true;
                } catch (supportError) {
                    console.warn('Erro ao verificar suporte NFC:', supportError);
                    supported = false;
                }

                setNfcSupported(supported);

                if (supported) {
                    try {
                        await NfcManager.start();
                        console.log('NFC inicializado com sucesso');
                    } catch (startError) {
                        console.error('Erro ao iniciar NFC Manager:', startError);
                        setNfcSupported(false);
                        setNfcError('Erro ao inicializar NFC');
                    }
                }
            } catch (error) {
                console.error('Erro ao inicializar NFC:', error);
                setNfcSupported(false);
                setNfcError('Erro ao verificar NFC');
            }
        };

        checkNfc();

        return () => {
            NfcManager.cancelTechnologyRequest().catch(() => { });
        };
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleVincularTag = (container: ContainerItem) => {
        if (nfcSupported === false) {
            Alert.alert(
                'NFC não disponível',
                nfcError || 'Seu dispositivo não suporta NFC ou está desativado.'
            );
            return;
        }

        if (nfcSupported === null) {
            Alert.alert('Aguarde', 'Verificando suporte NFC...');
            return;
        }

        setSelectedContainer(container);
        setModalVisible(true);
        startNfcWriting(container);
    };

    const startNfcWriting = async (container: ContainerItem) => {
        setIsWriting(true);

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // Criar mensagem NDEF com o ID do ambiente
            const bytes = Ndef.encodeMessage([
                Ndef.textRecord(container.ambienteId.toString(), 'en', {
                    id: Array.from({ length: 8 }, () => Math.floor(Math.random() * 256)),
                }),
            ]);

            if (bytes) {
                await NfcManager.ndefHandler.writeNdefMessage(bytes);
                Alert.alert('Sucesso', `Tag vinculada ao ambiente ${container.ambiente} com sucesso!`);
            }
        } catch (error: any) {
            console.error('Erro ao escrever na tag:', error);

            if (error?.message?.includes('timeout')) {
                Alert.alert('Timeout', 'Aproxime a tag novamente e tente mais uma vez.');
            } else if (error?.message?.includes('cancelled')) {
                // Usuário cancelou, não mostrar alerta
            } else {
                Alert.alert('Erro', 'Não foi possível gravar na tag. Tente novamente.');
            }
        } finally {
            setIsWriting(false);
            setModalVisible(false);
            try {
                await NfcManager.cancelTechnologyRequest();
            } catch (cancelError) {
                console.warn('Erro ao cancelar tecnologia NFC:', cancelError);
            }
        }
    };

    const cancelNfcWriting = async () => {
        try {
            await NfcManager.cancelTechnologyRequest();
        } catch (error) {
            console.warn('Erro ao cancelar NFC:', error);
        } finally {
            setIsWriting(false);
            setModalVisible(false);
        }
    };

    const containerData: ContainerItem[] = ambientes?.map((ambiente: any) => ({
        id: `AMB-${ambiente.id}`,
        ambiente: ambiente.name,
        dimensao: `${ambiente.areaM2} m²`,
        predio: ambiente.predio.name,
        setor: ambiente.setor.name,
        servico: ambiente.description || "Sem descrição",
        tipo: "Ambiente",
        ambienteId: ambiente.id,
    })) || [];

    if (loading) {
        return (
            <StyledMainContainer>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#186b53" />
                    <Text style={styles.loadingText}>Carregando ambientes...</Text>
                </View>
            </StyledMainContainer>
        );
    }

    if (error) {
        return (
            <StyledMainContainer>
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={50} color="#d32f2f" />
                    <Text style={styles.errorText}>Erro ao carregar dados</Text>
                    <Text style={styles.errorSubText}>Tente novamente mais tarde</Text>
                </View>
            </StyledMainContainer>
        );
    }

    if (!ambientes || ambientes.length === 0) {
        return (
            <StyledMainContainer>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="office-building" size={50} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhum ambiente encontrado</Text>
                </View>
            </StyledMainContainer>
        );
    }

    return (
        <StyledMainContainer>
            <View style={styles.container}>
                {containerData.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.header}>
                            <View style={styles.headerContent}>
                                <MaterialCommunityIcons name="office-building" size={30} color="#43575f" />
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
                                    <Text style={styles.detailLabel}>Área:</Text>
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
                                    <Text style={styles.detailLabel}>Descrição:</Text>
                                    <Text style={styles.detailValue}>{item.servico}</Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, nfcSupported === false && styles.buttonDisabled]}
                                    onPress={() => handleVincularTag(item)}
                                    disabled={nfcSupported === false}
                                >
                                    <Text style={styles.buttonText}>
                                        {nfcSupported === null ? 'Verificando NFC...' :
                                            nfcSupported ? 'Vincular Tag' : 'NFC não disponível'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}

                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={cancelNfcWriting}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={cancelNfcWriting}
                    >
                        <View style={styles.modalContainer}>
                            <MaterialCommunityIcons
                                name={isWriting ? "nfc-search-variant" : "cellphone-nfc"}
                                size={50}
                                color={isWriting ? "#186b53" : "#43575f"}
                            />

                            {isWriting ? (
                                <>
                                    <ActivityIndicator size="large" color="#186b53" style={styles.modalSpinner} />
                                    <Text style={styles.modalTitle}>Gravando na tag...</Text>
                                    <Text style={styles.modalInstruction}>Mantenha a tag próxima ao dispositivo.</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.modalTitle}>Aproxime a tag NFC</Text>
                                    <Text style={styles.modalInstruction}>Mantenha a tag próxima ao dispositivo para vincular ao ambiente.</Text>
                                </>
                            )}

                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={cancelNfcWriting}
                                disabled={isWriting}
                            >
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
        padding: 16,
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
    buttonDisabled: {
        backgroundColor: "#ccc",
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
    modalSpinner: {
        marginVertical: 10,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#d32f2f',
        fontWeight: 'bold',
    },
    errorSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});