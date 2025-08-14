import { useAuth } from '@/contexts/authProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconKey = 'main' | 'mapa' | 'index' | 'cronograma';

export default function TabBar({ state, navigation }: any) {

    const { user } = useAuth();

    const icons = {
        index: (color: string) => (<Entypo name="bar-graph" size={20} color={color} />),
        main: (color: string) => (<MaterialCommunityIcons name="clipboard-text-outline" size={20} color={color} />),
        mapa: (color: string) => (<MaterialCommunityIcons name="map-marker-radius" size={20} color={color} />),
        cronograma: (color: string) => (<MaterialCommunityIcons name="chart-timeline" size={20} color={color} />),
    };


    return (
        <View style={[styles.tabBarContainer, { display: user?.userType === "GESTAO" || user?.userType === "DIKMA_DIRECTOR" ? 'none' : 'flex' }]}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {

                    const routeName = route.name as IconKey;

                    if (['_sitemap', '+not-found', 'detalharOcorrencia', 'tag', 'criarOcorrencia', 'detalharAtividade', 'checklist', 'notificacoes'].includes(route.name)) return null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

                    const routeTitles: Record<IconKey, string> = {
                        main: 'Listagem',
                        mapa: 'Mapa',
                        cronograma: 'Cronograma',
                        index: 'Dashboard',
                    };

                    const title = routeTitles[routeName] || 'Dashboard';
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
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        position: 'absolute',
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
