import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function OcurrencePie({ data }: any) {

    if (data?.occurrencesByDay?.length <= 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyTitle}>Ocorrências</Text>
                <Text style={styles.emptyTitle}>Nenhum dado disponível</Text>
                <Text style={styles.emptySubtitle}>
                    Não existem dados disponíveis para esse período.
                </Text>
            </View>
        )
    }

    const getPieDataOcorrencias = (data: any) => {
        const totalSevere = data?.totalSevere ?? 0;
        const totalMild = data?.totalMild ?? 0;
        const totalNone = data?.totalNone ?? 0;

        const totalAll = totalSevere + totalMild + totalNone || 1;

        const pieDataOcorrencias = [
            {
                title: 'Grave',
                value: Number(((totalSevere / totalAll) * 100).toFixed(1)),
                color: '#DC3545'
            },
            {
                title: 'Leve',
                value: Number(((totalMild / totalAll) * 100).toFixed(1)),
                color: '#FFC107'
            },
            {
                title: 'Sem gravidade',
                value: Number(((totalNone / totalAll) * 100).toFixed(1)),
                color: '#28A745'
            }
        ];

        return { pieDataOcorrencias, totalAll };
    };

    const { pieDataOcorrencias, totalAll } = getPieDataOcorrencias(data);

    return (
        <View style={styles.chartColumn}>
            <Text style={styles.chartTitle}>Ocorrências</Text>

            <View style={[styles.pieWrapper, { width: '100%' }]}>
                <PieChart
                    data={pieDataOcorrencias}
                    donut
                    radius={80}
                    innerRadius={65}
                    innerCircleColor={"#F7F9FB"}
                    strokeColor={"#f7f9fb"}
                    showGradient
                    sectionAutoFocus
                    centerLabelComponent={() => (
                        <View style={styles.centerLabel}>
                            <Text style={styles.percentageText}>
                                {totalAll}
                            </Text>
                            <Text style={styles.centerLabelText}>Total</Text>
                        </View>
                    )}
                />
            </View>

            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
                {pieDataOcorrencias.map((item, index) => (
                    <View
                        key={index}
                        style={styles.legendRowContainer}
                    >
                        <View style={styles.legendRow}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.title}</Text>
                        </View>
                        <Text style={[styles.legendValue, { color: item.color }]}>
                            {item.value}%
                        </Text>
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
    chartColumn: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: 10,
        marginBottom: 20
    },
    chartTitle: {
        alignSelf: "center",
        fontSize: 22,
        color: "#43575F",
        fontWeight: "bold"
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
    legendRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%'
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        fontSize: 18,
        fontWeight: "bold"
    }
});
