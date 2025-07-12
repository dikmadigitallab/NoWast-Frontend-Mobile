import { useAuth } from '@/auth/authProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IconKey = 'dashboard' | 'mapa' | 'index' | 'cronograma';

export default function TabBar({ state, navigation }: any) {

    const { user } = useAuth();

    const icons = {
        index: (color: string) => (<MaterialCommunityIcons name="clipboard-text-outline" size={20} color={color} />),
        dashboard: (color: string) => (<Entypo name="bar-graph" size={20} color={color} />),
        mapa: (color: string) => (<Entypo name="map" size={20} color={color} />),
        cronograma: (color: string) => (<MaterialCommunityIcons name="chart-timeline" size={20} color={color} />),
    };

    return (
        <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {

                    const routeName = route.name as IconKey;

                    console.log(route.name)

                    if (user?.tipoColaborador?.tipoApp === 3 && routeName === 'dashboard') return null;
                    if (['_sitemap', '+not-found', 'detalharOcorrencia', 'criarOcorrencia', 'detalharAtividade', 'checklist', 'notificacoes'].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

                    const routeTitles: Record<IconKey, string> = {
                        dashboard: 'Dashboard',
                        mapa: 'Mapa',
                        cronograma: 'Cronograma',
                        index: 'Listagem',
                    };

                    const title = routeTitles[routeName] || 'Listagem';
                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabButton}
                        >
                            {icons[routeName](isFocused ? '#186B53' : "#81A8B8")}
                            <Text style={[styles.label, isFocused && styles.labelFocused]}>
                                {title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        backgroundColor: '#fff',
    },
    tabBar: {
        height: 60,
        width: '100%',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        borderTopColor: "#d9d9d9",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: '#81A8B8',
        textAlign: 'center',
        marginTop: 4,
    },
    labelFocused: {
        color: '#186B53',
        fontWeight: 'bold',
    },
});
