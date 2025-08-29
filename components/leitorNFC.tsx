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

                // Converter bytes para string (o ambienteId que foi gravado)
                const recordedId = Ndef.text.decodePayload(Uint8Array.from(ndefRecord.payload as any as number[]));

                console.log('ID gravado na tag:', recordedId);
                console.log('Environment ID esperado:', environmentId);

                // Verificar se o ID corresponde
                if (recordedId === environmentId.toString()) {
                    setReadResult('success');
                    setData(items);

                    setTimeout(() => {
                        router.push("/checklist");
                    }, 1500);
                } else {
                    setReadResult('id_mismatch');
                    Alert.alert(
                        'ID não corresponde',
                        `Atividade não está vinculada a este ambiente.`,
                        [{ text: 'OK', onPress: () => NfcManager.cancelTechnologyRequest() }]
                    );
                }
            } else {
                setReadResult('error');
                Alert.alert('Erro', 'Tag não contém dados ou está vazia.');
            }
        } catch (ex) {
            console.warn('Erro na leitura NFC:', ex);
            setReadResult('error');
            Alert.alert('Erro', 'Falha ao ler a tag NFC.');
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
        backgroundColor: '#f5f5f5',
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
        borderWidth: 2,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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