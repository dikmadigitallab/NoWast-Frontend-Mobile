// components/LoadingScreen.js
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingScreen = ({ message = "Carregando...", color = "#186b53", backgroundColor = "#FFFFFF" }) => {

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ActivityIndicator size={80} color={color} style={styles.spinner} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    spinner: {
        marginBottom: 20,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default LoadingScreen;
