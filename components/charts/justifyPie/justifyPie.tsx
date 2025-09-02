import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function JustifyPie({ data }: any) {

    if (data?.justificationsByReasonType?.length <= 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyTitle}>Justificativas</Text>
                <Text style={styles.emptyTitle}>Nenhum dado disponível</Text>
                <Text style={styles.emptySubtitle}>
                    Não existem dados disponíveis para esse período.
                </Text>
            </View>
        )
    }

    const COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#20c997'];

    const pieDataJustificativas = data?.justificationsByReasonType?.map((item: any, index: any) => ({
        value: item.totalJustifications ?? 0,
        title: item.reasonType ?? 'Sem motivo',
        color: COLORS[index % COLORS.length],
    })) ?? [];


    return (
        <View style={styles.chartColumn}>
            <View style={[styles.pieWrapper, { width: '100%' }]}>
                <Text style={styles.pieTitle}>Motivos das justificativas</Text>

                <PieChart
                    data={pieDataJustificativas}
                    showText
                    textColor="black"
                    radius={150}
                    textSize={20}
                    focusOnPress
                    showValuesAsLabels
                    showTextBackground
                    textBackgroundRadius={26}
                />
            </View>

            <View style={[styles.pieLegend, { width: '100%', flexDirection: 'column', gap: 15 }]}>
                {pieDataJustificativas.map((item: any, index: any) => (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '90%',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Text style={styles.legendText}>{item.title}</Text>
                        </View>
                        <Text style={[styles.legendValue, { fontSize: 18, color: item.color }]}>
                            {item.value}
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
    filterButtonsContainer: {
        gap: 10,
        height: "100%",
    },
    filterButton: {
        height: 40,
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        flexDirection: "row",
        borderColor: "#d9d9d9",
        backgroundColor: "#eff5f0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    title: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "500",
        marginLeft: 20
    },
    sectionHeaderWrapper: {
        width: "100%",
        flexDirection: "row",
        borderBottomColor: "#186b5427",
        borderBottomWidth: 1,
        justifyContent: "space-between"
    },
    sectionHeader: {
        width: "50%",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "500",
        color: "#000"
    },
    activeBar: {
        height: 5,
        width: "60%",
        backgroundColor: "#28A745",
        marginTop: 5,
        borderRadius: 2
    },
    contentCard: {
        padding: 10,
        gap: 20,
        width: Dimensions.get('window').width - 20
    },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F7F9FB",
    },

    contentWrapper: {
        width: "100%",
        gap: 10
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        alignSelf: "center",
        width: "95%",
        overflow: "hidden"
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#43575F",
        marginBottom: 20
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
    chartColumn: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: 10,
        marginBottom: 20
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
    },
    mainLocContainer: {
        borderWidth: 1,
        borderColor: "#E8F5E9",
        padding: 15,
        borderRadius: 10,
    },
    containerLoc: {
        marginLeft: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    containerButtons: {
        zIndex: 999,
        width: "100%",
        flexDirection: "row",
        position: "absolute",
        paddingHorizontal: 10,
        justifyContent: "space-between",
        bottom: 10,
    },
    buttons: {
        gap: 5,
        width: "49%",
        borderWidth: 1,
        borderRadius: 12,
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "#186B53"
    },
    fabContainer: {
        position: "absolute",
        bottom: 30,
        right: 20,
        alignItems: "center",
    },
    mainButton: {
        width: 70,
        height: 70,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#186B53",
        elevation: 6,
    },
    fabButton: {
        position: "absolute",
        bottom: 0,
        right: 8,
    },
    innerButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 10,
        elevation: 5,
    },
    innerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
});
