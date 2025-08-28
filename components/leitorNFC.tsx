import { useChecklistStore } from '@/store/dataStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

interface LeituraNFCProps {
    items: any;
    environmentId: any;
}

export default function LeituraNFC({ items, environmentId }: LeituraNFCProps) {
    const router = useRouter();
    const { setData } = useChecklistStore();
    const [isLoading, setIsLoading] = useState(false);
    const [tagId, setTagId] = useState<null | number>(null);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);
    const isReading = useRef(false);

    // Inicializar NFC
    useEffect(() => {
        NfcManager.start()
            .then(() => console.log('NFC iniciado'))
            .catch(err => console.warn('Erro ao iniciar NFC:', err));

        return () => {
            isMounted.current = false;
            NfcManager.cancelTechnologyRequest().catch(() => null);
        };
    }, []);

    // Controlar leitura baseado no foco da tela
    useFocusEffect(
        useCallback(() => {
            isMounted.current = true;
            startNfcReading();

            return () => {
                isMounted.current = false;
                stopNfcReading();
            };
        }, [environmentId, items])
    );

    // Controlar leitura baseado no estado do app
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
            startNfcReading();
        } else {
            stopNfcReading();
        }
    };

    const startNfcReading = () => {
        if (!isReading.current && isMounted.current) {
            isReading.current = true;
            readTag();
        }
    };

    const stopNfcReading = () => {
        isReading.current = false;
        NfcManager.cancelTechnologyRequest().catch(() => null);
    };

    const readTag = useCallback(async () => {
        if (!isMounted.current || !isReading.current) return;

        setIsLoading(true);
        setError(null);

        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();

            if (tag && tag.id) {
                const parsedTagId = parseInt(tag.id, 16);
                setTagId(parsedTagId);

                // Verifica se o ID da tag é igual ao environmentId
                if (parsedTagId === parseInt(environmentId, 10)) {
                    // Se for igual, seta os items e redireciona
                    setData(items);
                    stopNfcReading();
                    router.push('/checklist');
                } else {
                    setError(`Tag NFC (${parsedTagId}) não corresponde ao ambiente esperado (${environmentId})`);
                    // Continua lendo mesmo com erro de correspondência
                    setTimeout(() => {
                        if (isMounted.current && isReading.current) {
                            readTag();
                        }
                    }, 1000);
                }
            } else {
                setError('Tag NFC não identificada');
                // Continua tentando ler
                setTimeout(() => {
                    if (isMounted.current && isReading.current) {
                        readTag();
                    }
                }, 1000);
            }

        } catch (err) {
            console.warn('Erro na leitura NFC:', err);
            setError('Erro ao ler a tag NFC. Aproxime novamente.');

            // Continua tentando ler após erro
            setTimeout(() => {
                if (isMounted.current && isReading.current) {
                    readTag();
                }
            }, 1000);
        } finally {
            NfcManager.cancelTechnologyRequest().catch(() => null);
            setIsLoading(false);
        }
    }, [environmentId, items, router, setData]);

    const handleManualRetry = () => {
        setError(null);
        setTagId(null);
        if (!isReading.current) {
            isReading.current = true;
            readTag();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.nfc}>
                <MaterialCommunityIcons
                    name="cellphone-nfc"
                    size={60}
                    color={error ? "#FF3B30" : "#186B53"}
                />

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#186B53" />
                        <Text style={styles.loadingText}>Lendo tag NFC...</Text>
                        <Text style={styles.infoText}>Aproxime a tag do dispositivo</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <Text style={styles.infoText}>A leitura continuará automaticamente</Text>
                        <TouchableOpacity onPress={handleManualRetry} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Forçar nova leitura</Text>
                        </TouchableOpacity>
                    </View>
                ) : tagId ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.nfcText}>
                            ID da tag: {tagId}
                        </Text>
                        <Text style={styles.successText}>Tag identificada com sucesso!</Text>
                    </View>
                ) : (
                    <Text style={styles.nfcText}>
                        Aproxime a tag ou cartão para iniciar a atividade.
                    </Text>
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