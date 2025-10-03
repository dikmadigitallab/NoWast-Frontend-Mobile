import { useAuth } from '@/contexts/authProvider';
import { useModuleStore } from '@/store/moduleStore';
import { userTypes } from '@/types/user';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SelecionarStack() {

    const { logout } = useAuth()
    const { setModuleType } = useModuleStore();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    
    const insets = useSafeAreaInsets();
    const screenHeight = Dimensions.get('window').height - insets.top - insets.bottom;

    const handleSelecionarStack = (stack: 'quedazero' | 'coleta' | 'residuos') => {
        setModuleType(stack);
        setTimeout(() => {
            router.push(`/(${stack})` as never)
        }, 500);
    };

    const handleLogout = async () => {
        setLoading(true);
        setTimeout(() => {
            setModuleType(null);
            logout();
        }, 500);
    }

    return (
        <View style={[styles.container, { height: screenHeight }]}>
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.logo}
                            source={require("../../assets/logos/logo.png")}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.logoText}>Olá, {user?.name}!</Text>
                        <View style={styles.locationContainer}>
                            <FontAwesome5 name="user-tie" size={24} color="#43575F" />
                            <Text style={styles.locationText}>
                                {userTypes[user?.userType ?? ""]}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.lineNav}>
                    <TouchableOpacity onPress={() => router.push("/perfil")} style={styles.navItem}>
                        <FontAwesome name="user-circle-o" size={30} color="#404944" style={{ width: 30 }} />
                        <Text style={styles.text}>Meu Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { handleSelecionarStack('quedazero') }} style={styles.navItem}>
                        <MaterialCommunityIcons name="excavator" size={30} color="#404944" style={{ width: 30 }} />
                        <Text style={styles.text}>Queda zero</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.navItem, styles.disabledItem]}>
                        <FontAwesome name="trash" size={30} color="#404944" style={{ width: 30, opacity: 0.5 }} />
                        <Text style={[styles.text, styles.disabledText]}>Gestão de Resíduios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.navItem, styles.disabledItem]}>
                        <FontAwesome5 name="truck-moving" size={25} color="#404944" style={{ width: 30, opacity: 0.5 }} />
                        <Text style={[styles.text, styles.disabledText]}>Coleta Seletiva</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.logoutWrapper}>
                <TouchableOpacity style={styles.logoutcontainer} onPress={handleLogout}>
                    {loading ? <ActivityIndicator size="small" color="#00A614" /> :
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                            <MaterialCommunityIcons name="logout" size={25} color="black" />
                            <Text style={{ color: "#404944", fontSize: 16 }}>Sair</Text>
                        </View>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 30,
        justifyContent: "space-between",
    },
    contentContainer: {
        justifyContent: "flex-start",
        gap: 50,
    },
    logoContainer: {
        flexDirection: "column"
    },
    logoWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 100,
    },
    textContainer: {
        flexDirection: "column",
        gap: 10
    },
    logoText: {
        fontSize: 25,
        fontWeight: "900",
        color: "#202020"
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    locationText: {
        fontSize: 20,
        fontWeight: "500",
        color: "#202020"
    },
    closeButton: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    lineNav: {
        marginLeft: 20,
        flexDirection: "column",
        gap: 20
    },
    navItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        gap: 15
    },
    text: {
        fontSize: 20,
        color: "#404944"
    },
    disabledItem: {
        opacity: 0.5,
    },
    disabledText: {
        color: "#999999",
    },
    logoutWrapper: {
        alignItems: "flex-start",
        paddingTop: 20,
        paddingBottom: 20,
    },
    logoutcontainer: {
        gap: 5,
        height: 48,
        width: 100,
        padding: 10,
        borderWidth: 1,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#BFC9C3",
        justifyContent: "center",
    }
});

