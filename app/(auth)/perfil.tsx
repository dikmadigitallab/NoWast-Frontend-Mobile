import { StyledMainContainer } from "@/styles/StyledComponents";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

export default function Perfil() {

    const router = useRouter();

    return (
        <StyledMainContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ width: 70 }}>
                    <Feather name="chevron-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Perfil</Text>
                <View style={{ width: 70 }} />
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.profileImageContainer}>
                    <View style={styles.profileImage}>
                        <MaterialCommunityIcons name="camera-plus-outline" size={30} color="#0B6780" />
                        <Text style={{ color: "#0B6780" }}>Adicionar foto</Text>
                        {/* If you have an image: 
                        <Image source={{ uri: 'your-image-uri' }} style={styles.profileImage} />
                        */}
                    </View>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        mode="outlined"
                        label="Nova Senha"
                        secureTextEntry
                        outlineColor="#707974"
                        activeOutlineColor="#707974"
                        style={{ backgroundColor: '#fff', height: 56, marginBottom: 15 }}
                    />
                    <TextInput
                        mode="outlined"
                        label="Confirmar Senha"
                        secureTextEntry
                        outlineColor="#707974"
                        activeOutlineColor="#707974"
                        style={{ backgroundColor: '#fff', height: 56 }}
                    />
                </View>

                <TouchableOpacity style={styles.Button} onPress={() => console.log('Pressed')}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>Atualizar Perfil</Text>
                </TouchableOpacity>
            </View>
        </StyledMainContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headerText: {
        width: 70,
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: "#000"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    profileImageContainer: {
        marginVertical: 40,
    },
    profileImage: {
        gap: 5,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e5edf2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImageText: {
        fontSize: 40,
        color: '#666',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 30,
    },
    Button: {
        width: '100%',
        bottom: 30,
        borderRadius: 12,
        paddingVertical: 20,
        position: 'absolute',
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "#186B53"
    },
    ButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});