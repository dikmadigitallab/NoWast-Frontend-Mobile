import { useGet } from "@/hooks/crud/get/get";
import { StyledMainContainer } from "@/styles/StyledComponents";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorModalTitle, setErrorModalTitle] = useState('');
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const [retryAttempt, setRetryAttempt] = useState(0);

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

    const showErrorModal = (title: string, message: string) => {
        setErrorModalTitle(title);
        setErrorModalMessage(message);
        setErrorModalVisible(true);
    };

    const handleVincularTag = (container: ContainerItem) => {
        if (nfcSupported === false) {
            showErrorModal(
                'NFC não disponível',
                nfcError || 'Seu dispositivo não suporta NFC ou está desativado.'
            );
            return;
        }

        if (nfcSupported === null) {
            showErrorModal('Aguarde', 'Verificando suporte NFC...');
            return;
        }

        setSelectedContainer(container);
        setModalVisible(true);
        startNfcWriting(container);
    };

    const startNfcWriting = async (container: ContainerItem) => {
        setIsWriting(true);
        setRetryAttempt(0);

        try {
            // Normalizar o ambienteId para garantir consistência
            const normalizedAmbienteId = String(container.ambienteId).trim();
            
            // Log para debug
            console.log('=== GRAVAÇÃO NFC ===');
            console.log('Ambiente ID original:', container.ambienteId);
            console.log('Ambiente ID normalizado:', normalizedAmbienteId);
            console.log('Ambiente nome:', container.ambiente);
            console.log('===================');

            // Solicitar tecnologia NDEF com timeout maior
            await NfcManager.requestTechnology(NfcTech.Ndef, {
                alertMessage: 'Mantenha a tag próxima ao dispositivo',
            });

            // Aguardar um pequeno delay para estabilizar a conexão
            await new Promise(resolve => setTimeout(resolve, 300));

            // Obter informações da tag
            const tag = await NfcManager.getTag();
            console.log('Tag detectada:', tag);

            // Verificar se a tag suporta NDEF
            if (!tag) {
                throw new Error('Nenhuma tag foi detectada');
            }

            // Criar mensagem NDEF com o ID do ambiente
            const bytes = Ndef.encodeMessage([
                Ndef.textRecord(normalizedAmbienteId, 'pt-BR'),
            ]);

            if (!bytes) {
                throw new Error('Falha ao criar mensagem NDEF');
            }

            console.log('Mensagem NDEF criada, iniciando gravação...');

            // Verificar se a tag precisa ser formatada
            const techTypes = tag?.techTypes || [];
            const isNdefFormatable = techTypes.includes('android.nfc.tech.NdefFormatable');
            
                if (isNdefFormatable) {
                console.log('⚠️ Tag não formatada, formatando como NDEF...');
                
                try {
                    // Cancelar requisição atual e solicitar NdefFormatable
                    await NfcManager.cancelTechnologyRequest();
                    await NfcManager.requestTechnology(NfcTech.NdefFormatable);
                    
                    // Formatar e gravar em uma operação
                    await (NfcManager as any).ndefFormatableHandlerAndroid.formatNdefAndMakeReadOnly(bytes);
                    
                    console.log('✅ Tag formatada e gravada com sucesso!');
                    showErrorModal('Sucesso', `Tag formatada e vinculada ao ambiente ${container.ambiente} (ID: ${normalizedAmbienteId}) com sucesso!`);
                    return;
                } catch (formatError: any) {
                    console.error('Erro ao formatar tag:', formatError);
                    
                    // Se falhar com makeReadOnly, tentar sem ele
                    try {
                        await NfcManager.cancelTechnologyRequest();
                        await NfcManager.requestTechnology(NfcTech.NdefFormatable);
                        await (NfcManager as any).ndefFormatableHandlerAndroid.formatNdef(bytes);
                        
                        console.log('✅ Tag formatada e gravada com sucesso (método alternativo)!');
                        showErrorModal('Sucesso', `Tag formatada e vinculada ao ambiente ${container.ambiente} (ID: ${normalizedAmbienteId}) com sucesso!`);
                        return;
                    } catch (altFormatError: any) {
                        console.error('Erro no método alternativo de formatação:', altFormatError);
                        throw new Error('Não foi possível formatar a tag NFC');
                    }
                }
            }

            // Tentar gravar usando o método padrão (tag já formatada)
            // Implementar retry logic para java.io.IOException
            let writeSuccess = false;
            let lastWriteError: any = null;
            const maxRetries = 3;

            for (let attempt = 1; attempt <= maxRetries && !writeSuccess; attempt++) {
                try {
                    console.log(`Tentativa de gravação ${attempt}/${maxRetries}...`);
                    setRetryAttempt(attempt);
                    
                    // Aguardar um pequeno delay entre tentativas
                    if (attempt > 1) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                    
                    await NfcManager.ndefHandler.writeNdefMessage(bytes);
                    console.log('✅ Tag NFC gravada com sucesso!');
                    showErrorModal('Sucesso', `Tag vinculada ao ambiente ${container.ambiente} (ID: ${normalizedAmbienteId}) com sucesso!`);
                    writeSuccess = true;
                } catch (writeError: any) {
                    lastWriteError = writeError;
                    console.error(`Erro na tentativa ${attempt}:`, writeError);
                    
                    // Verificar se foi cancelado pelo usuário
                    if (writeError?.message?.includes('cancelled') || writeError?.message?.includes('canceled')) {
                        console.log('Gravação NFC cancelada pelo usuário');
                        throw writeError; // Lançar imediatamente para não tentar novamente
                    }
                    
                    // Se for IOException e ainda há tentativas, continuar
                    if (writeError?.message?.includes('IOException') && attempt < maxRetries) {
                        console.log('IOException detectado (má conexão), tentando novamente...');
                        continue;
                    }
                    
                    // Se o método padrão falhar após todas as tentativas, tentar método alternativo
                    if (attempt === maxRetries) {
                        if (writeError?.message?.includes('unsupported')) {
                            console.log('Tentando método alternativo de gravação...');
                            
                            // Método alternativo usando NfcA
                            try {
                                await NfcManager.cancelTechnologyRequest();
                                await NfcManager.requestTechnology([NfcTech.NfcA, NfcTech.Ndef]);
                                await new Promise(resolve => setTimeout(resolve, 300));
                                await NfcManager.ndefHandler.writeNdefMessage(bytes);
                                console.log('✅ Tag NFC gravada com sucesso (método alternativo)!');
                                showErrorModal('Sucesso', `Tag vinculada ao ambiente ${container.ambiente} (ID: ${normalizedAmbienteId}) com sucesso!`);
                                writeSuccess = true;
                            } catch (altError: any) {
                                console.error('Erro no método alternativo:', altError);
                                throw new Error(`Tag não suporta gravação NDEF. Tipo de tag: ${tag?.techTypes?.join(', ') || 'desconhecido'}`);
                            }
                        } else {
                            // Se não é erro de unsupported, lançar o erro
                            throw writeError;
                        }
                    }
                }
            }

            // Se não conseguiu gravar após todas as tentativas
            if (!writeSuccess && lastWriteError) {
                throw lastWriteError;
            }
        } catch (error: any) {
            console.error('Erro ao escrever na tag:', error);

            // Tratamento de erros mais específico
            if (error?.message?.includes('timeout')) {
                showErrorModal('Timeout', 'Aproxime a tag novamente e tente mais uma vez.');
            } else if (error?.message?.includes('cancelled')) {
                // Usuário cancelou, não mostrar modal
                console.log('Gravação NFC cancelada pelo usuário');
            } else if (error?.message?.includes('IOException')) {
                showErrorModal(
                    'Erro de comunicação',
                    'Falha na comunicação com a tag NFC. Mantenha a tag estável próxima ao dispositivo e tente novamente.'
                );
            } else if (error?.message?.includes('unsupported') || error?.message?.includes('não suporta')) {
                showErrorModal(
                    'Tag incompatível', 
                    'Esta tag NFC não suporta gravação NDEF. Use uma tag compatível (NFC Forum Type 2, 4 ou 5).'
                );
            } else if (error?.message?.includes('read-only') || error?.message?.includes('protegida')) {
                showErrorModal('Erro', 'Esta tag está protegida contra escrita.');
            } else if (error?.message?.includes('Nenhuma tag')) {
                showErrorModal('Erro', 'Nenhuma tag foi detectada. Aproxime a tag do dispositivo.');
            } else {
                showErrorModal('Erro', `Não foi possível gravar na tag: ${error?.message || 'Erro desconhecido'}`);
            }
        } finally {
            setIsWriting(false);
            setModalVisible(false);
            setRetryAttempt(0);
            try {
                await NfcManager.cancelTechnologyRequest();
            } catch (cancelError) {
                console.warn('Erro ao cancelar tecnologia NFC:', cancelError);
            }
        }
    };

    const cancelNfcWriting = async () => {
        console.log('Usuário clicou em cancelar');
        try {
            await NfcManager.cancelTechnologyRequest();
        } catch (error) {
            console.warn('Erro ao cancelar NFC:', error);
        } finally {
            setIsWriting(false);
            setModalVisible(false);
            setRetryAttempt(0);
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
    })).sort((a: ContainerItem, b: ContainerItem) => {
        // Ordenar por ID numérico (extraindo o número do ID)
        const idA = parseInt(a.id.replace('AMB-', ''));
        const idB = parseInt(b.id.replace('AMB-', ''));
        return idA - idB;
    }) || [];

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
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            </ScrollView>

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
                                <Text style={styles.modalTitle}>
                                    {retryAttempt > 1 ? `Tentando novamente (${retryAttempt}/3)...` : 'Gravando na tag...'}
                                </Text>
                                <Text style={styles.modalInstruction}>Mantenha a tag próxima e ESTÁVEL ao dispositivo até concluir.</Text>
                                {retryAttempt > 1 && (
                                    <Text style={styles.modalRetryInfo}>Detectado má conexão, reposicione a tag</Text>
                                )}
                                <Text style={styles.modalWarning}>⚠️ Não mova a tag durante a gravação</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.modalTitle}>Aproxime a tag NFC</Text>
                                <Text style={styles.modalInstruction}>Mantenha a tag próxima e estável ao dispositivo para vincular ao ambiente.</Text>
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

            <Modal animationType="fade" transparent={true} visible={errorModalVisible} onRequestClose={() => setErrorModalVisible(false)}>
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setErrorModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <MaterialCommunityIcons
                            name={errorModalTitle === 'Sucesso' ? "check-circle" : "alert-circle"}
                            size={50}
                            color={errorModalTitle === 'Sucesso' ? "#186b53" : "#FF3B30"}
                        />
                        <Text style={[styles.modalTitle, errorModalTitle === 'Sucesso' ? styles.successTitle : styles.errorTitle]}>
                            {errorModalTitle}
                        </Text>
                        <Text style={styles.modalInstruction}>{errorModalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.modalCloseButton, errorModalTitle === 'Sucesso' && styles.successButton]}
                            onPress={() => setErrorModalVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </StyledMainContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 20,
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
        marginBottom: 12,
        color: '#43575f',
        textAlign: 'center',
    },
    modalWarning: {
        fontSize: 12,
        marginBottom: 24,
        color: '#FF9500',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalRetryInfo: {
        fontSize: 13,
        marginBottom: 8,
        color: '#186b53',
        textAlign: 'center',
        fontStyle: 'italic',
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
    successTitle: {
        color: '#186b53',
    },
    errorTitle: {
        color: '#FF3B30',
    },
    successButton: {
        borderColor: '#186b53',
    },
});