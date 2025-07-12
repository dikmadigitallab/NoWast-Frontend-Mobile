import { useAuth } from '@/auth/authProvider';
import { useAuthStore } from '@/store/storeApp';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


export default function SelecionarStack() {

    const { logout } = useAuth()
    const { setUserType } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSelecionarStack = (stack: 'quedazero' | 'coleta' | 'residuos') => {
        setUserType(stack);
        setTimeout(() => router.replace(`/(${stack})` as never), 500);

    };

    const Logout = () => {
        setLoading(true);
        setTimeout(() => {
            logout();
            setUserType(null);
        }, 500);
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.logo}
                            source={require("../../assets/logos/logo.png")}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.logoText}>Olá, Warllei!</Text>
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-sharp" size={24} color="#43575F" />
                            <Text style={styles.locationText}>Prédio central</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.lineNav}>
                    <Pressable onPress={() => router.push("/perfil")} style={styles.navItem}>
                        <FontAwesome name="user-circle-o" size={30} color="#404944" style={{ width: 30 }} />
                        <Text style={styles.text}>Meu Perfil</Text>
                    </Pressable>
                    <Pressable onPress={() => { handleSelecionarStack('residuos') }} style={styles.navItem}>
                        <FontAwesome name="trash" size={30} color="#404944" style={{ width: 30 }} />
                        <Text style={styles.text}>Gestão de Resíduios</Text>
                    </Pressable>
                    <Pressable onPress={() => { handleSelecionarStack('coleta') }} style={styles.navItem}>
                        <FontAwesome5 name="truck-moving" size={25} color="#404944" style={{ width: 30 }} />
                        <Text style={styles.text}>Coleta Seletiva</Text>
                    </Pressable>
                    <Pressable onPress={() => { handleSelecionarStack('quedazero') }} style={styles.navItem}>
                        <MaterialCommunityIcons name="excavator" size={30} color="#404944" style={{ width: 30 }} />
                        <Text style={styles.text}>Queda zero</Text>
                    </Pressable>
                </View>
                <Pressable style={styles.logoutcontainer} onPress={Logout}>

                    {loading ? <ActivityIndicator size="small" color="#00A614" /> :
                        <>
                            <MaterialCommunityIcons name="logout" size={25} color="black" />
                            <Text style={{ color: "#404944", fontSize: 16 }}>Sair</Text>
                        </>
                    }
                </Pressable>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        gap: 50,
        left: 0,
        zIndex: 3,
        padding: 30,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
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
        fontSize: 30,
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
    logoutcontainer: {
        gap: 5,
        height: 48,
        width: 100,
        bottom: 20,
        left: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 100,
        flexDirection: "row",
        position: "absolute",
        alignItems: "center",
        borderColor: "#BFC9C3",
        justifyContent: "center",
    }
});

