import { getStatusColor } from "@/utils/statusColor";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AprovacoStatusProps {
    status?: string;
    date?: string;
}

export default function AprovacoStatus({ status, date }: AprovacoStatusProps) {

    const isApproved = status === "APPROVED";
    const isDisapproved = status === "REJECTED";
    const isPENDINGNoJustification = status === "PENDING";
    const formattedDate = date ? moment(date).format("DD/MM/YYYY HH:mm") : "";

    return (
        <View
            style={[
                styles.containerCheck,
                { backgroundColor: getStatusColor(status) },
            ]}
        >
            {isApproved ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <AntDesign name="checkcircle" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Aprovado em {formattedDate}
                    </Text>
                </View>
            ) : isDisapproved ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <MaterialIcons name="close" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Reprovada em {formattedDate}
                    </Text>
                </View>
            ) : isPENDINGNoJustification ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <MaterialIcons name="hourglass-bottom" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Pendente
                    </Text>
                </View>
            ) : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <MaterialIcons name="remove-done" size={20} color="#fff" />
                    <Text style={[styles.statusText, { color: "#fff", fontSize: 14 }]}>
                        Aprovação Pendente
                    </Text>
                </View>
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