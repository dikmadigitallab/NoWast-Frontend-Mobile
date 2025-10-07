import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'br';

type CalendarioProps = {
    onMonthChange?: (dateString: string) => void;
    onDaySelect?: (dateString: string) => void;
};

export default function Calendario({ onMonthChange, onDaySelect }: CalendarioProps) {

    const today = new Date().toISOString().split('T')[0];
    const [selected, setSelected] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(today);

    return (
        <View style={{ height: 310 }}>
            <Calendar
                style={{
                    height: "100%",
                    paddingTop: 5,
                }}
                current={currentMonth || undefined}
                onDayPress={day => {
                    setSelected(day.dateString);
                    if (onDaySelect) onDaySelect(day.dateString);
                }}
                onMonthChange={month => {
                    setCurrentMonth(month.dateString);
                    if (onMonthChange) onMonthChange(month.dateString);
                }}
                dayComponent={({ date, state }) => {
                    const dateString = date?.dateString as string;
                    const isSelected = dateString === selected;
                    const isDisabled = state === 'disabled';
                    return (
                        <TouchableOpacity
                            disabled={isDisabled}
                            onPress={() => {
                                setSelected(dateString);
                                if (onDaySelect) onDaySelect(dateString);
                            }}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                                marginVertical: 3,
                            }}
                        >
                            <Text style={{
                                color: isSelected ? '#00C98F' : '#ffffff',
                                fontSize: 12,
                                opacity: isDisabled ? 0.3 : 1,
                            }}>
                                {date?.day}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                theme={{
                    calendarBackground: '#186B53',
                    textSectionTitleColor: '#ffffff',
                    dayTextColor: '#ffffff',
                    monthTextColor: '#ffffff',
                    // selected and today styles handled by custom dayComponent
                    arrowColor: '#ffffff',
                    textDisabledColor: '#b0c4b1',
                    dotColor: '#ffffff',
                    selectedDotColor: '#186B53',
                    textDayFontSize: 12,
                    textMonthFontSize: 14,
                    textDayHeaderFontSize: 12,
                }}
                enableSwipeMonths={false}
                hideExtraDays={false}
            />
        </View>
    )
}