import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function Donut({ data }: any) {

    if (!data || data?.activitiesByDay?.length <= 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyTitle}>Aprovações</Text>
                <Text style={styles.emptyTitle}>Nenhum dado disponível</Text>
                <Text style={styles.emptySubtitle}>
                    Não existem dados disponíveis para esse período.
                </Text>
            </View>
        );
    }

    const dataDonuts = [
        {
            title: "Atividades",
            data: [
                { name: 'Concluídas', total: data?.completedActivities ?? 0, color: '#00CB65' },
                { name: 'Em Aberto', total: data?.openActivities ?? 0, color: '#2090FF' },
                { name: 'Pendentes', total: data?.pendingActivities ?? 0, color: '#FF9920' },
                { name: 'Justificativas Internas', total: data?.internalJustificationActivities ?? 0, color: '#d35400' },
                { name: 'Justificativas Externas', total: data?.justifiedActivities ?? 0, color: '#27ae60' },
            ]
        },
        {
            title: "Execuções",
            data: [
                { name: 'No Prazo', total: data?.sameDayClosureActivities ?? 0, color: '#00CB65' },
                { name: 'Fora do Prazo', total: data?.differentDayClosureActivities ?? 0, color: '#2090FF' },
            ]
        },
        {
            title: "Aprovações",
            data: [
                { name: 'Aprovadas', total: data?.approvedActivities ?? 0, color: '#00CB65' },
                { name: 'Pendentes de Aprovação', total: data?.pendingApprovalActivities ?? 0, color: '#2090FF' },
                { name: 'Reprovadas', total: data?.rejectedActivities ?? 0, color: '#FF9920' },
            ]
        }
    ];

    const aprovacoesData = dataDonuts.find(item => item.title === "Aprovações")?.data ?? [];


    return (
        <View style={styles.chartRow}>
            <View style={styles.pieWrapper}>
                <Text style={styles.pieTitle}>Aprovações</Text>
                <PieChart
                    data={aprovacoesData.map(item => ({
                        value: item.total,
                        color: item.color,
                    }))}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={65}
                    innerCircleColor={"#fff"}
                    strokeColor={"#f7f9fb"}
                    strokeWidth={19}
                    centerLabelComponent={() => (
                        <View style={styles.centerLabel}>
                            <Text style={styles.percentageText}>
                                {aprovacoesData.reduce((sum, item) => sum + item.total, 0)}
                            </Text>
                            <Text style={styles.centerLabelText}>Total</Text>
                        </View>
                    )}
                />
            </View>

            <View style={[styles.pieLegend, { paddingLeft: 0, alignItems: "flex-start" }]}>
                {aprovacoesData.map((item, index) => (
                    <View key={index}>
                        <View style={styles.legendRow}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.name}</Text>
                        </View>
                        <Text style={styles.legendValue}>{item.total}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        width: "100%",
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyIcon: {
        fontSize: 40,
        marginBottom: 10
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#43575F",
        marginBottom: 5,
        textAlign: "center"
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#6c757d",
        textAlign: "center"
    },
    pieTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#43575F",
        marginBottom: 10
    },
    chartRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    pieWrapper: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center"
    },
    centerLabel: {
        justifyContent: "center",
        alignItems: "center"
    },
    percentageText: {
        fontSize: 22,
        color: "#000",
        fontWeight: "bold"
    },
    centerLabelText: {
        fontSize: 14,
        color: "#000"
    },
    pieLegend: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center"
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 100
    },
    legendText: {
        fontSize: 16,
        color: "#43575F"
    },
    legendValue: {
        fontSize: 20,
        color: "#43575F",
        marginLeft: 20
    }
});
