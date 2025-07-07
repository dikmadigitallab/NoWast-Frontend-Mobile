import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function BotaoCriarOcorrencia() {

    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('criarOcorrencia' as never)}
            style={styles.containerCreate}>
            <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerCreate: {
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 10,
        backgroundColor: '#186B53',
        alignItems: 'center',
        justifyContent: 'center'
    }
})