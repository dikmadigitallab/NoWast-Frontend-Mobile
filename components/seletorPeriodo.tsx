import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SeletorPeriodoProps {
    visible: boolean;
    onClose: () => void;
    selectedMonth?: number;
    selectedYear?: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    onClear: () => void;
    onConfirm: () => void;
}

export default function SeletorPeriodo({
    visible,
    onClose,
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    onClear,
    onConfirm
}: SeletorPeriodoProps) {

    // Estados internos do modal (não afetam o estado externo até confirmar)
    const [tempMonth, setTempMonth] = useState<number | undefined>(undefined);
    const [tempYear, setTempYear] = useState<number | undefined>(undefined);
    const [currentViewYear, setCurrentViewYear] = useState<number>(new Date().getFullYear());
    const [currentViewMonth, setCurrentViewMonth] = useState<number>(new Date().getMonth() + 1);

    // Quando o modal abrir, pré-seleciona mês/ano atual se não houver seleção
    useEffect(() => {
        if (visible) {
            const now = new Date();
            const currentMonth = now.getMonth() + 1; // 1-12
            const currentYear = now.getFullYear();

            // Se já existe uma seleção, usa ela, senão usa o atual
            const yearToSelect = selectedYear || currentYear;
            const monthToSelect = selectedMonth || currentMonth;
            
            setTempMonth(monthToSelect);
            setTempYear(yearToSelect);
            setCurrentViewYear(yearToSelect);
            setCurrentViewMonth(monthToSelect);
        }
    }, [visible, selectedMonth, selectedYear]);

    // Navegação de anos - já seleciona automaticamente (sem limites)
    const handlePreviousYear = () => {
        const newYear = currentViewYear - 1;
        setCurrentViewYear(newYear);
        setTempYear(newYear);
    };

    const handleNextYear = () => {
        const newYear = currentViewYear + 1;
        setCurrentViewYear(newYear);
        setTempYear(newYear);
    };

    // Navegação de meses - já seleciona automaticamente
    const handlePreviousMonth = () => {
        if (currentViewMonth > 1) {
            const newMonth = currentViewMonth - 1;
            setCurrentViewMonth(newMonth);
            setTempMonth(newMonth);
        }
    };

    const handleNextMonth = () => {
        if (currentViewMonth < 12) {
            const newMonth = currentViewMonth + 1;
            setCurrentViewMonth(newMonth);
            setTempMonth(newMonth);
        }
    };

    // Meses do ano
    const months = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' }
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.content}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTextContainer}>
                            <MaterialCommunityIcons name="calendar-range" size={26} color="#fff" />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.title}>Período</Text>
                                <Text style={styles.subtitle}>
                                    {tempMonth && tempYear
                                        ? `${months[tempMonth - 1].label}/${tempYear}`
                                        : 'Selecione mês e ano'
                                    }
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <AntDesign name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.body}>
                        {/* Navegador de Ano */}
                        <View style={styles.yearNavigator}>
                            <TouchableOpacity 
                                style={styles.yearNavButton}
                                onPress={handlePreviousYear}
                            >
                                <MaterialIcons 
                                    name="chevron-left" 
                                    size={32} 
                                    color="#186B53" 
                                />
                            </TouchableOpacity>
                            
                            <View style={styles.yearDisplay}>
                                <Text style={styles.yearDisplayText}>{currentViewYear}</Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.yearNavButton}
                                onPress={handleNextYear}
                            >
                                <MaterialIcons 
                                    name="chevron-right" 
                                    size={32} 
                                    color="#186B53" 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Navegador de Mês */}
                        <View style={styles.monthNavigator}>
                            <TouchableOpacity 
                                style={styles.monthNavButton}
                                onPress={handlePreviousMonth}
                                disabled={currentViewMonth <= 1}
                            >
                                <MaterialIcons 
                                    name="chevron-left" 
                                    size={32} 
                                    color={currentViewMonth <= 1 ? "#ccc" : "#186B53"} 
                                />
                            </TouchableOpacity>
                            
                            <View style={styles.monthDisplay}>
                                <Text style={styles.monthDisplayText}>
                                    {months[currentViewMonth - 1].label}
                                </Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.monthNavButton}
                                onPress={handleNextMonth}
                                disabled={currentViewMonth >= 12}
                            >
                                <MaterialIcons 
                                    name="chevron-right" 
                                    size={32} 
                                    color={currentViewMonth >= 12 ? "#ccc" : "#186B53"} 
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Indicador de navegação */}
                        <View style={styles.quickNavContainer}>
                            <Text style={styles.quickNavText}>
                                Navegue pelos anos e meses usando as setas
                            </Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => {
                                setTempMonth(undefined);
                                setTempYear(undefined);
                                onClear();
                            }}
                        >
                            <MaterialIcons name="clear-all" size={22} color="#E74C3C" />
                            <Text style={styles.clearButtonText}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                (!tempMonth || !tempYear) && styles.confirmButtonDisabled
                            ]}
                            onPress={() => {
                                if (tempMonth && tempYear) {
                                    onMonthChange(tempMonth);
                                    onYearChange(tempYear);
                                    onConfirm();
                                }
                            }}
                            disabled={!tempMonth || !tempYear}
                        >
                            <AntDesign name="check" size={20} color="#fff" />
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 500,
        height: '60%',
        maxHeight: 430,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 20,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 18,
        backgroundColor: '#186B53',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
    },
    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    // Navegador de Ano
    yearNavigator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    yearNavButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: '#f8f9fa',
    },
    yearDisplay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yearDisplayText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#186B53',
        letterSpacing: 1,
    },
    // Navegador de Mês
    monthNavigator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    monthNavButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#f8f9fa',
    },
    monthDisplay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#f8f9fa',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#e8e8e8',
        marginHorizontal: 16,
        position: 'relative',
    },
    monthDisplayText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#186B53',
        letterSpacing: 0.8,
    },
    // Navegação Rápida
    quickNavContainer: {
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    quickNavText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fafafa',
        gap: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    clearButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E74C3C',
    },
    clearButtonText: {
        color: '#E74C3C',
        fontSize: 14,
        fontWeight: '700',
    },
    confirmButton: {
        flex: 2,
        backgroundColor: '#186B53',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#186B53',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    confirmButtonDisabled: {
        backgroundColor: '#adb5bd',
        shadowOpacity: 0,
        elevation: 0,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});

