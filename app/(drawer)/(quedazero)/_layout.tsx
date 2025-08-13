import TabBar from '@/components/tabBars/tabBarQuedaZero';
import { TopBar } from '@/components/topBars/topBarQuedaZero';
import { customTheme } from '@/config/inputsTheme';
import { RelativePathString, Tabs, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { PaperProvider } from 'react-native-paper';

export default function TabLayout() {

    const router = useRouter();
    const pathname = usePathname();
    const history = useRef<string[]>([]);

    useEffect(() => {
        if (history.current[history.current.length - 1] !== pathname) {
            history.current.push(pathname);
        }
    }, [pathname]);

    const customBack = () => {
        if (history.current.length > 1) {
            history.current.pop();
            router.navigate(history.current[history.current.length - 1] as RelativePathString);
        } else {
            router.navigate('/');
        }
    };

    return (
        <PaperProvider theme={customTheme}>
            <Tabs
                tabBar={props => <TabBar {...props} />}
                screenOptions={{
                    headerTitle: () => <TopBar customBack={customBack} router={router} pathname={pathname} />,
                    headerShown: true,
                    animation: 'shift',
                    headerStyle: {
                        elevation: 0,
                        shadowColor: 'transparent',
                        backgroundColor: 'transparent',
                        height: 60,
                        borderBottomWidth: 0,
                    },
                    headerTitleContainerStyle: {
                        padding: 0,
                        margin: 0,
                        left: 0,
                        right: 0,
                    },
                    headerStatusBarHeight: 0,
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="main" />
                <Tabs.Screen name="detalharOcorrencia" />
                <Tabs.Screen name="detalharAtividade" />
                <Tabs.Screen name="checklist" />
                <Tabs.Screen name="mapa" />
                <Tabs.Screen name="criarOcorrencia" />
                <Tabs.Screen name="notificacoes" />
                <Tabs.Screen options={{ headerShown: false }} name="cronograma" />
            </Tabs>
        </PaperProvider>
    );
}
