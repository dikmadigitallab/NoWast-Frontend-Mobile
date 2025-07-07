import { StyledMainContainer } from "@/styles/StyledComponents";
import { Feather } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const notifications = [
    {
        id: "1",
        title: "Nova mensagem",
        description: "Você recebeu uma nova mensagem do usuário João",
        date: "10/12/2025 09:55 AM",
        icon: "message-square",
        color: "#4CAF50"
    },
    {
        id: "2",
        title: "Atualização disponível",
        description: "Uma nova versão do aplicativo está disponível para download",
        date: "10/12/2025 08:30 AM",
        icon: "download",
        color: "#2196F3"
    },
    {
        id: "3",
        title: "Pagamento aprovado",
        description: "Seu pagamento no valor de R$ 150,00 foi aprovado",
        date: "09/12/2025 03:15 PM",
        icon: "dollar-sign",
        color: "#8BC34A"
    },
    {
        id: "4",
        title: "Aviso importante",
        description: "Seu plano expira em 3 dias, renove agora para continuar usando",
        date: "08/12/2025 11:20 AM",
        icon: "alert-triangle",
        color: "#FFC107"
    },
    {
        id: "5",
        title: "Novo seguidor",
        description: "Maria começou a seguir seu perfil",
        date: "05/12/2025 04:45 PM",
        icon: "user-plus",
        color: "#E91E63"
    },
];

export default function Notificacoes() {

    const renderNotificationItem = ({ item }: any) => (
        <TouchableOpacity style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
                <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: "#DE496E" }} />
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
            <Text style={styles.notificationDescription}>{item.description}</Text>
        </TouchableOpacity>
    );

    return (
        <StyledMainContainer>
            <View style={styles.container}>
                {notifications.length > 0 ? (
                    <FlatList
                        data={notifications}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Feather name="bell" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>Nenhuma notificação</Text>
                    </View>
                )}
            </View>
        </StyledMainContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "600",
    },
    container: {
        flex: 1,
    },
    notificationItem: {
        backgroundColor: "#f6f6f6",
        borderRadius: 8,
        padding: 16
    },
    notificationHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    notificationIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
    },
    notificationDate: {
        fontSize: 12,
        color: "#888",
        marginLeft: 8,
    },
    notificationDescription: {
        fontSize: 14,
        color: "#555",
        paddingLeft: 5, // Align with icon
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
        marginTop: 16,
    },
});