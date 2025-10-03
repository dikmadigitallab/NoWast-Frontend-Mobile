import TabBar from '@/components/tabBars/tabBarQuedaZero';
import { TopBar } from '@/components/topBars/topBarQuedaZero';
import { customTheme } from '@/config/inputsTheme';
import { useFocusEffect } from '@react-navigation/native';
import { RelativePathString, Tabs, usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function TabLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const history = useRef<string[]>([]);

    //Efeito para rastrear o histórico de navegaçãoAdiciona a rota atual ao histórico sempre que pathname mudar
    useEffect(() => {
        if (history.current[history.current.length - 1] !== pathname) {
            history.current.push(pathname);
        }
    }, [pathname]);


    //Função personalizada para lidar com o botão voltar, navega para a rota anterior no histórico ou para a raiz se não houver histórico
    const customBack = useCallback(() => {
        if (history.current.length > 1) {
            history.current.pop();
            const previousRoute = history.current[history.current.length - 1];
            router.navigate(previousRoute as RelativePathString);
            return true;
        } else {
            router.navigate('/');
            return true;
        }
    }, [router]);


    //Hook para lidar com o botão físico de voltar do dispositivo ,só é ativado quando a tela está em foco
    useFocusEffect(
        useCallback(() => {

            // Adiciona listener para o botão físico de voltar
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                customBack
            );

            // Cleanup: remove o listener quando o componente perde o foco
            return () => backHandler.remove();
        }, [customBack])
    );

    return (
        <PaperProvider theme={customTheme}>
            <Tabs
                tabBar={props => <TabBar {...props} />}
                screenOptions={{
                    freezeOnBlur: true,
                    popToTopOnBlur: true,
                    headerTitle: () => <TopBar customBack={customBack} router={router} pathname={pathname} />,
                    headerShown: true,
                    animation: 'shift',
                    headerStyle: {
                        elevation: 0,
                        shadowColor: 'transparent',
                        backgroundColor: 'transparent',
                        height: Platform.OS === 'web' ? 60 : 80,
                        borderBottomWidth: 0,
                    },
                    headerTitleContainerStyle: {
                        padding: 0,
                        margin: 0,
                        left: 0,
                        right: 0,
                    },
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="listagem" />
                <Tabs.Screen name="detalharOcorrencia" />
                <Tabs.Screen name="detalharAtividade" />
                <Tabs.Screen options={{ headerShown: false }} name="checklist" />
                <Tabs.Screen name="mapa" />
                <Tabs.Screen name="criarOcorrencia" />
                <Tabs.Screen name="notificacoes" />
                <Tabs.Screen options={{ headerShown: false }} name="cronograma" />
            </Tabs>
        </PaperProvider>
    );
}