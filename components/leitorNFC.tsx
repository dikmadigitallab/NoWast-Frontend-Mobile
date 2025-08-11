import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function LeituraNFC() {
    const [isLoading, setIsLoading] = useState(false);
    const [tagId, setTagId] = useState<null | number>(null);

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
            console.log('Lendo tag NFC...');
            setIsLoading(true);
            try {
                await NfcManager.requestTechnology(NfcTech.Ndef);
                console.log('Tag lida com sucesso');
                const tag = await NfcManager.getTag();
                console.log('Tag encontrada:', tag);

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
                            Aproxime a tag NFC para leitura.
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
        height: 182,
        borderRadius: 12,
        backgroundColor: '#f6f6f6',
        padding: 20,
        borderWidth: 1,
        borderColor: '#d9d9d9',
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