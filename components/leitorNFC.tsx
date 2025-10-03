import { useChecklistStore } from '@/store/dataStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

interface LeituraNFCProps {
    items: any;
    environmentId: any;
}

export default function LeituraNFC({ items, environmentId }: LeituraNFCProps) {

    const router = useRouter();
    const { setData } = useChecklistStore();
    const [isLoading, setIsLoading] = useState(false);
    const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
    const [readResult, setReadResult] = useState<'success' | 'error' | 'id_mismatch' | null>(null);
    const appState = useRef(AppState.currentState);

    // Verificar se o NFC está disponível
    useEffect(() => {
        const checkNfcSupport = async () => {
            try {
                const supported = await NfcManager.isSupported();
                setNfcSupported(supported);

                if (supported) {
                    await NfcManager.start();
                }
            } catch (error) {
                console.error('Erro ao verificar suporte NFC:', error);
                setNfcSupported(false);
            }
        };

        checkNfcSupport();

        return () => {
            NfcManager.cancelTechnologyRequest().catch(() => { });
        };
    }, []);

    // Gerenciar estado do app para pausar/retomar leitura NFC
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App voltou ao foreground, pode reiniciar leitura
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Ler tag NFC
    const readNdef = async () => {
        setIsLoading(true);
        setReadResult(null);

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);

            // Ler a mensagem NDEF gravada na tag
            const tag = await NfcManager.getTag();

            if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
                // Extrair o conteúdo gravado (ambienteId)
                const ndefRecord = tag.ndefMessage[0];

                // Converter bytes para string de forma mais robusta
                let recordedId: string;
                try {
                    // Verificar se o payload é um array de números
                    if (Array.isArray(ndefRecord.payload)) {
                        recordedId = Ndef.text.decodePayload(new Uint8Array(ndefRecord.payload));
                    } else {
                        // Fallback: tentar converter para Uint8Array usando Array.from
                        recordedId = Ndef.text.decodePayload(new Uint8Array(Array.from(ndefRecord.payload as any)));
                    }
                } catch (decodeError) {
                    console.error('Erro ao decodificar payload NFC:', decodeError);
                    setReadResult('error');
                    Alert.alert('Erro', 'Não foi possível decodificar os dados da tag NFC.');
                    return;
                }

                // Normalizar tipos para comparação
                const normalizedRecordedId = String(recordedId).trim();
                const normalizedEnvironmentId = String(environmentId).trim();

                // Logs detalhados para debug
                console.log('=== DEBUG NFC ===');
                console.log('Tipo do environmentId:', typeof environmentId);
                console.log('Tipo do recordedId:', typeof recordedId);
                console.log('Valor original environmentId:', environmentId);
                console.log('Valor original recordedId:', recordedId);
                console.log('Valor normalizado environmentId:', normalizedEnvironmentId);
                console.log('Valor normalizado recordedId:', normalizedRecordedId);
                console.log('Payload original:', ndefRecord.payload);
                console.log('==================');

                // Verificar se o ID corresponde
                if (normalizedRecordedId === normalizedEnvironmentId) {
                    console.log('✅ Validação NFC bem-sucedida!');
                    setReadResult('success');
                    setData(items);

                    setTimeout(() => {
                        router.push("/checklist");
                    }, 1500);
                } else {
                    console.log('❌ Validação NFC falhou - IDs não correspondem');
                    setReadResult('id_mismatch');
                    Alert.alert(
                        'ID não corresponde',
                        `Tag vinculada ao ambiente ${normalizedRecordedId}, mas atividade é do ambiente ${normalizedEnvironmentId}.`,
                        [{ text: 'OK', onPress: () => NfcManager.cancelTechnologyRequest() }]
                    );
                }
            } else {
                console.log('❌ Tag NFC não contém dados válidos');
                setReadResult('error');
                Alert.alert('Erro', 'Tag não contém dados ou está vazia.');
            }
        } catch (ex) {
            console.error('Erro na leitura NFC:', ex);
            setReadResult('error');
            
            // Tratamento de erros mais específico
            if (ex instanceof Error) {
                if (ex.message.includes('timeout')) {
                    Alert.alert('Timeout', 'Aproxime a tag novamente e tente mais uma vez.');
                } else if (ex.message.includes('cancelled')) {
                    // Usuário cancelou, não mostrar alerta
                    console.log('Leitura NFC cancelada pelo usuário');
                } else {
                    Alert.alert('Erro', `Falha ao ler a tag NFC: ${ex.message}`);
                }
            } else {
                Alert.alert('Erro', 'Falha ao ler a tag NFC.');
            }
        } finally {
            setIsLoading(false);
            NfcManager.cancelTechnologyRequest().catch(() => { });
        }
    };

    // Reiniciar leitura quando a tela receber foco
    useFocusEffect(
        useCallback(() => {
            if (nfcSupported) {
                readNdef();
            }

            return () => {
                NfcManager.cancelTechnologyRequest().catch(() => { });
            };
        }, [nfcSupported, environmentId])
    );

    // Tentar novamente
    const handleRetry = () => {
        readNdef();
    };

    if (nfcSupported === false) {
        return (
            <View style={styles.container}>
                <View style={styles.nfc}>
                    <MaterialCommunityIcons
                        name="cellphone-off"
                        size={60}
                        color="#FF3B30"
                    />
                    <Text style={styles.errorText}>
                        NFC não suportado neste dispositivo
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.nfc}>
                <MaterialCommunityIcons
                    name={readResult === 'success' ? 'check-circle' : 'cellphone-nfc'}
                    size={60}
                    color={readResult === 'success' ? '#186B53' : '#333'}
                />

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#186B53" />
                        <Text style={styles.loadingText}>Lendo tag NFC...</Text>
                        <Text style={styles.infoText}>Aproxime a tag do dispositivo</Text>
                    </View>
                ) : readResult === 'success' ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.successText}>Leitura realizada com sucesso!</Text>
                        <Text style={styles.infoText}>ID verificado e dados carregados</Text>
                    </View>
                ) : readResult === 'id_mismatch' ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>ID da tag não corresponde</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : readResult === 'error' ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Erro na leitura</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.nfcText}>
                            Aproxime a tag NFC do dispositivo para leitura
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    nfc: {
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 300,
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: 30,
        shadowColor: '#00000017',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    nfcText: {
        fontSize: 18,
        textAlign: 'center',
        width: '90%',
        color: '#333',
        lineHeight: 24,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    loadingText: {
        fontSize: 20,
        color: '#186B53',
        fontWeight: '600',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        gap: 15,
        width: '100%',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 22,
    },
    successContainer: {
        alignItems: 'center',
        gap: 10,
    },
    successText: {
        fontSize: 16,
        color: '#186B53',
        fontWeight: '500',
    },
    retryButton: {
        backgroundColor: '#186B53',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 150,
        marginTop: 10,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});