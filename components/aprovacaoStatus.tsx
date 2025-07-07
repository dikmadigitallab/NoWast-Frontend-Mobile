import { getStatusColor } from "@/utils/statusColor";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AprovacoStatusProps {
    status?: string;
    date?: string;
}

export default function AprovacoStatus({ status, date }: AprovacoStatusProps) {

    const isApproved = status === "Aprovado";
    const isDisapproved = status === "Reprovado";
    const isPending = status === "Pendente";

    return (
        <View
            style={[
                styles.containerCheck,
                { backgroundColor: getStatusColor(status) },
            ]}
        >
            {isApproved ? (
                <>
                    <AntDesign name="checkcircle" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Aprovado dia {date ? date : ""}
                    </Text>
                </>
            ) : isDisapproved ? (
                <>
                    <MaterialIcons name="close" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Reprovada dia {date ? date : ""}
                    </Text>
                </>
            ) : isPending ? (
                <>
                    <MaterialIcons name="hourglass-bottom" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Pendente e sem justificativa
                    </Text>
                </>
            ) : (
                <>
                    <MaterialIcons name="remove-done" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Aprovação Pendente
                    </Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    containerCheck: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        flexDirection: "row",
        gap: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },
});

