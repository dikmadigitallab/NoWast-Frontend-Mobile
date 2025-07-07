import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart, PieChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

export default function Dashboard() {

    const barData = [
        { value: 42, label: "Seg", topLabelComponent: () => <Text style={styles.barLabel}>42</Text> },
        { value: 18, label: "Ter", topLabelComponent: () => <Text style={styles.barLabel}>18</Text> },
        { value: 33, label: "Qua", topLabelComponent: () => <Text style={styles.barLabel}>33</Text> },
        { value: 47, label: "Qui", topLabelComponent: () => <Text style={styles.barLabel}>47</Text> },
        { value: 28, label: "Sex", topLabelComponent: () => <Text style={styles.barLabel}>28</Text> },
        { value: 52, label: "Sab", topLabelComponent: () => <Text style={styles.barLabel}>52</Text> },
        { value: 38, label: "Dom", topLabelComponent: () => <Text style={styles.barLabel}>38</Text> },
    ];

    const pieData = [
        { value: 50, color: "#1ABC9C", gradientCenterColor: "#16A085" },
        { value: 30, color: "#E67E22", gradientCenterColor: "#CA6F1E" },
        { value: 20, color: "#9B59B6", gradientCenterColor: "#884EA0" },
    ];

    const pieData3 = [
        { value: 75, prazo: "Dentro do prazo", percent: 24, color: '#2ECC71' },
        { value: 25, prazo: "Fora do prazo", percent: 33, color: '#E67E22' }
    ];


    return (
        <View style={styles.container}>
            <View style={styles.headerBackground} />

            <View style={styles.contentWrapper}>
                <Text style={styles.title}>Atividades</Text>
                <View style={styles.card}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 330 }}>
                        <View style={styles.contentCard}>

                            <View style={styles.chartRow}>
                                <View style={styles.pieWrapper}>
                                    <PieChart
                                        data={pieData}
                                        donut
                                        showGradient
                                        sectionAutoFocus
                                        radius={90}
                                        innerRadius={60}
                                        innerCircleColor={"#fff"}
                                        strokeColor={"#fff"}
                                        strokeWidth={6}
                                        centerLabelComponent={() => (
                                            <View style={styles.centerLabel}>
                                                <Text style={styles.percentageText}>47%</Text>
                                                <Text style={styles.centerLabelText}>Excellent</Text>
                                            </View>
                                        )}
                                    />
                                </View>

                                <View style={styles.pieLegend}>
                                    {pieData.map((item, index) => (
                                        <View key={index}>
                                            <View style={styles.legendRow}>
                                                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                                <Text style={styles.legendText}>Concluídas</Text>
                                            </View>
                                            <Text style={styles.legendValue}>{item.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.barWrapper}>
                                <Text style={{ alignSelf: "flex-start", fontSize: 22, color: "#43575F", fontWeight: "bold" }}>Ocorrências Registradas</Text>
                                <BarChart
                                    width={width}
                                    data={barData}
                                    frontColor="#43575F"
                                    hideYAxisText
                                    barWidth={20}
                                    barBorderRadius={8}
                                    barBorderWidth={0}
                                    yAxisThickness={0}
                                    xAxisThickness={0}
                                    hideRules={true}
                                    spacing={width / 18}
                                />
                            </View>

                            <View style={styles.chartColumn}>
                                <Text style={{ alignSelf: "flex-start", fontSize: 22, color: "#43575F", fontWeight: "bold" }}>Execuções</Text>
                                <View style={[styles.pieWrapper, { width: '100%' }]}>
                                    <PieChart
                                        data={pieData3}
                                        donut
                                        showGradient
                                        sectionAutoFocus
                                        radius={80}
                                        innerRadius={70}
                                        innerCircleColor={"#fff"}
                                        strokeColor={"#fff"}
                                        centerLabelComponent={() => (
                                            <View style={styles.centerLabel}>
                                                <Text style={styles.percentageText}>145</Text>
                                            </View>
                                        )}
                                    />
                                </View>

                                <View style={[styles.pieLegend, { width: '100%', flexDirection: 'row', gap: 50 }]}>
                                    {pieData3.map((item, index) => (
                                        <View key={index} style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <View style={styles.legendRow}>
                                                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                                <Text style={[styles.legendText, { fontSize: 14, letterSpacing: -0.5 }]}>{item.prazo}</Text>
                                            </View>
                                            <Text style={[styles.legendValue, { fontSize: 20, color: item.color }]}>{item.value} | {item.percent}%</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F7F9FB",
    },
    headerBackground: {
        width: "100%",
        height: 200,
        backgroundColor: "#186B53",
    },
    contentWrapper: {
        marginTop: -160,
        width: "100%",
        gap: 10,
    },
    title: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "500",
        marginLeft: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        alignSelf: "center",
        width: "95%",
    },
    contentCard: {
        padding: 20,
        gap: 40,
    },
    chartColumn: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        gap: 10
    },
    chartRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    pieWrapper: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    centerLabel: {
        justifyContent: "center",
        alignItems: "center",
    },
    percentageText: {
        fontSize: 22,
        color: "#000",
        fontWeight: "bold",
    },
    centerLabelText: {
        fontSize: 14,
        color: "#000",
    },
    pieLegend: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
    },
    legendText: {
        fontSize: 16,
        color: "#43575F",
    },
    legendValue: {
        fontSize: 20,
        color: "#43575F",
        marginLeft: 20,
    },
    barWrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    barLabel: {
        color: "#43575F",
        fontSize: 18,
    },
});
