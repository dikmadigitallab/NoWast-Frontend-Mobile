import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function LeituraNFC() {
    const [isLoading, setIsLoading] = useState(false);
    const [tagId, setTagId] = useState<null | number>(null);
    const router = useRouter();

    useEffect(() => {
        NfcManager.start()
            .then(() => console.log('NFC iniciado'))
            .catch(err => console.warn('Erro ao iniciar NFC:', err));

        return () => {
            NfcManager.cancelTechnologyRequest().catch(() => null);
        };
    }, []);

    useEffect(() => {
        const readTag = async () => {
            setIsLoading(true);
            try {
                await NfcManager.requestTechnology(NfcTech.Ndef);
                const tag = await NfcManager.getTag();
                router.push(`/detalharAtividade/${tag?.id}` as never);

                if (tag && tag.id) {
                    setTagId(parseInt(tag.id, 16) as number);
                }

            } catch (err) {
                console.warn('Erro na leitura NFC:', err);
            } finally {
                NfcManager.cancelTechnologyRequest();
                setIsLoading(false);
            }
        };

        readTag();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#186B53" />
                    <Text style={styles.loadingText}>Lendo tag NFC...</Text>
                </View>
            ) : (
                <View style={styles.nfc}>
                    <MaterialCommunityIcons name="cellphone-nfc" size={40} color="#186B53" />
                    {tagId ? (
                        <Text style={styles.nfcText}>
                            ID da tag: {tagId}
                        </Text>
                    ) : (
                        <Text style={styles.nfcText}>
                            Aproxime a tag ou cartão para iniciar a atividade.
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    nfc: {
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 20,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 100,
        elevation: 2,
        marginBottom: 10,
    },
    nfcText: {
        fontSize: 20,
        textAlign: 'center',
        width: '70%',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#186B53',
    },
});