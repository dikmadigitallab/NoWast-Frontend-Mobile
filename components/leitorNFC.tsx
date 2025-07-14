import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

export default function CadastroNFC() {

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        NfcManager.start()
            .then(() => console.log('NFC iniciado'))
            .catch(err => console.warn('Erro ao iniciar NFC:', err));

        return () => {
            NfcManager.cancelTechnologyRequest().catch(() => null);
        };
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#186B53" />
                    <Text style={styles.loadingText}>Cadastrando ID...</Text>
                </View>
            ) : (
                <View style={styles.nfc} >
                    <MaterialCommunityIcons name="cellphone-nfc" size={40} color="#186B53" />
                    <Text style={styles.nfcText}>
                        Aproxime a tag ou cartão para começar a atividade.
                    </Text>
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
