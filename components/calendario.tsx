import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'br';

export default function Calendario() {

    const [selected, setSelected] = useState('');
    const [currentMonth, setCurrentMonth] = useState('');

    return (
        <View style={{ height: 310 }}>
            <Calendar
                style={{
                    height: "100%",
                    paddingTop: 5,
                }}
                current={currentMonth || undefined}
                onDayPress={day => { setSelected(day.dateString) }}
                onMonthChange={month => { setCurrentMonth(month.dateString); }}
                markedDates={{
                    [selected]: {
                        selected: true,
                        selectedColor: '#186B53',
                        disableTouchEvent: true,
                    }
                }}
                theme={{
                    calendarBackground: '#186B53',
                    textSectionTitleColor: '#ffffff',
                    dayTextColor: '#ffffff',
                    monthTextColor: '#ffffff',
                    selectedDayBackgroundColor: '#ffffff',
                    selectedDayTextColor: '#00C98F',
                    todayBackgroundColor: '#fff',
                    todayTextColor: '#00C98F',
                    arrowColor: '#ffffff',
                    textDisabledColor: '#b0c4b1',
                    dotColor: '#ffffff',
                    selectedDotColor: '#186B53',
                    textDayFontSize: 12,
                    textMonthFontSize: 14,
                    textDayHeaderFontSize: 12,
                }}
                enableSwipeMonths={true}
                hideExtraDays={true}
            />
        </View>
    )
}