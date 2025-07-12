import TabBar from '@/components/tabBars/tabBarQuedaZero';
import { TopBar } from '@/components/topBars/topBarQuedaZero';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {

    const router = useRouter();
    const pathname = usePathname();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Toasts />
            <Tabs
                tabBar={props => <TabBar {...props} />}
                screenOptions={{
                    headerTitle: () => <TopBar router={router} pathname={pathname} />,
                    headerShown: true,
                    animation: 'shift',
                    headerStyle: {
                        elevation: 0,
                        shadowColor: 'transparent'
                    },
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="dashboard" />
                <Tabs.Screen name="detalharOcorrencia" />
                <Tabs.Screen name="detalharAtividade" />
                <Tabs.Screen name="checklist" />
                <Tabs.Screen name="mapa" />
                <Tabs.Screen name="criarOcorrencia" />
                <Tabs.Screen name="notificacoes" />
                <Tabs.Screen options={{ headerShown: false }} name="cronograma" />
            </Tabs>
        </GestureHandlerRootView>
    );
}
