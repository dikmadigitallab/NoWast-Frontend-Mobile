import AprovacoStatus from "@/components/aprovacaoStatus";
import { Pessoas } from "@/types/IOcorrencias";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Modalize } from 'react-native-modalize';
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { useAuth } from "../../../auth/authProvider";
import CapturaImagens from "../../../components/capturaImagens";
import MapScreen from "../../../components/renderMapOcorrencias";
import { useOcorrenciasStore } from "../../../store/storeOcorrencias";
import { StatusContainer, StyledMainContainer } from "../../../styles/StyledComponents";
import { getStatusColor } from "../../../utils/statusColor";

const OPTIONS = [
    { label: 'Atestado', value: 'atestado' },
    { label: 'Opção 2', value: 'option2' },
    { label: 'Outro', value: 'outro' },
];

const images = [
    require("../../../assets/images/ocorrencias.png"),
    require("../../../assets/images/ocorrencias.png"),
    require("../../../assets/images/ocorrencias.png"),
    require("../../../assets/images/ocorrencias.png"),
    require("../../../assets/images/ocorrencias.png"),
    require("../../../assets/images/ocorrencias.png"),
];


export default function DetalharAtividade() {

    const { user } = useAuth();
    const router = useRouter();
    const [isChecked, setChecked] = useState(false);
    const { ocorrenciaSelecionada } = useOcorrenciasStore();
    const modalizeDescricaoRef = useRef<Modalize | null>(null);
    const [modalVisible, setModalizeVisible] = useState(false);
    const modalizeJustificativaRef = useRef<Modalize | null>(null);

    const [justificativa, setJustificativa] = useState<any>({
        justificativa: '',
        descricao: '',
        material: ''
    });

    const closeModal = () => {
        if (modalizeJustificativaRef.current && modalizeDescricaoRef.current) {
            modalizeDescricaoRef.current.close();
            modalizeJustificativaRef.current.close();
        }
    };

    const deletarAlteracoes = () => {
        closeModal();
        setModalizeVisible(false);
    };

    if (!ocorrenciaSelecionada) {
        return (
            <StyledMainContainer>
                <Text style={styles.title}>Detalhar Ocorrência</Text>
                <Text style={styles.text}>Nenhuma ocorrência selecionada.</Text>
            </StyledMainContainer>
        );
    }

    return (
        <StyledMainContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.wrapper}>
                    <View style={styles.container}>
                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <Entypo name="calendar" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.text}>
                                {ocorrenciaSelecionada.data} - {ocorrenciaSelecionada.hora}
                            </Text>
                        </View>
                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <FontAwesome6 name="user-tie" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.text}>
                                Encarregado: {ocorrenciaSelecionada?.encarregado}
                            </Text>
                        </View>
                        <View style={[styles.linha, { height: ocorrenciaSelecionada.justificativa ? 250 : 40, alignItems: "flex-start" }]}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <Entypo name="flag" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <View style={{ width: "100%", gap: 10 }}>
                                <StatusContainer backgroundColor={getStatusColor(ocorrenciaSelecionada?.status)}>
                                    <Text style={styles.statusTextWhite}>
                                        {ocorrenciaSelecionada?.status === "Concluído" ? `Concluído em ${ocorrenciaSelecionada?.dataConclusao} / ${ocorrenciaSelecionada?.horaConclusao}` : ocorrenciaSelecionada?.status}
                                    </Text>
                                </StatusContainer>
                                {
                                    ocorrenciaSelecionada.justificativa && (
                                        <View>
                                            <View style={{ flexDirection: "row", gap: 10, height: "100%" }}>
                                                <View style={{ width: "100%", flexDirection: "column", gap: 10 }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                        <Text style={styles.text}>Motivo: {ocorrenciaSelecionada.justificativa.motivo}</Text>
                                                    </ View>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                        <Text style={styles.text}>Descrição: {ocorrenciaSelecionada.justificativa.descricao}</Text>
                                                    </ View>
                                                    <View style={styles.imageContainer}>
                                                        <Image source={ocorrenciaSelecionada.justificativa.imagem as any} style={styles.image} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                        {
                            ocorrenciaSelecionada?.pessoas && (
                                <View style={[styles.linha, { height: "auto", alignItems: "flex-start", gap: 10 }]}>
                                    <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                                        <FontAwesome6 name="user-tie" size={15} color="#43575F" />
                                        <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                                    </View>
                                    <View style={{ flexDirection: "column", gap: 5 }}>
                                        {
                                            ocorrenciaSelecionada?.pessoas?.map((pessoa: Pessoas, index: number) => (
                                                <View key={index} style={{ alignItems: "flex-start", gap: 5, marginBottom: 10 }}>
                                                    <Text style={{ fontSize: 12, fontWeight: "semibold", color: "#43575F" }}>{pessoa.funcao}</Text>
                                                    <View style={[styles.rowWithGap, { width: "auto", justifyContent: "center", alignItems: "center", gap: 10 }]}>
                                                        <View style={[styles.rowWithGap]}>
                                                            <Checkbox value={isChecked} onValueChange={setChecked} color={isChecked ? '#34C759' : undefined} />
                                                            <View>
                                                                <Text style={{ fontSize: 13 }}>{ocorrenciaSelecionada.nome}</Text>
                                                                {pessoa.descricao && <Text style={{ fontSize: 10 }}>{pessoa.descricao}</Text>}
                                                            </View>
                                                        </View>
                                                        {
                                                            !pessoa.descricao && (
                                                                <TouchableOpacity
                                                                    style={{ flexDirection: "row", gap: 2, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#43575F", padding: 5, borderRadius: 10 }}
                                                                    onPress={() => modalizeDescricaoRef.current?.open()}>
                                                                    <AntDesign name="plus" size={15} color="#43575F" />
                                                                    <Text style={{ fontWeight: "bold", color: "#43575F", fontSize: 12 }}>Descrição</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        }

                                                    </View>
                                                </View>
                                            ))
                                        }
                                    </View>
                                </View>
                            )
                        }

                        <View style={[styles.linha, { height: 150, alignItems: "flex-start" }]}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                                <AntDesign name="camera" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <View style={{ flexDirection: "column", gap: 10 }}>
                                <Text style={styles.text}>Fotos Registradas: {ocorrenciaSelecionada.data_fotos_registradas} - {ocorrenciaSelecionada.hora_fotos_registradas}</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 50 }}>
                                    {images.map((image, index) => (
                                        <View key={index} style={{ width: 200, height: "100%", marginRight: 10 }}>
                                            <Image source={image} style={styles.image} />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={[styles.linha, { height: 320, alignItems: "flex-start", marginTop: 5 }]}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "space-between", gap: 10 }]}>
                                <FontAwesome6 name="location-dot" color="#43575F" size={15} />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <View style={styles.locationDetails}>
                                <View style={styles.locationTextContainer}>
                                    <View style={styles.coluna_localizacao}>
                                        <Text style={styles.textBold}>Localização:</Text>
                                        <Text style={[styles.text, { fontWeight: "700" }]}>Prédio: <Text style={{ fontWeight: 400 }}>{ocorrenciaSelecionada.localizacao.local}</Text></Text>
                                        <Text style={[styles.text, { fontWeight: "700" }]}>Setor: <Text style={{ fontWeight: 400 }}>{ocorrenciaSelecionada.localizacao.origem}</Text></Text>
                                        <Text style={[styles.text, { fontWeight: "700" }]}>Dimensão: <Text style={{ fontWeight: 400 }}>{ocorrenciaSelecionada.localizacao.origem_detalhado}</Text></Text>
                                    </View>
                                </View>
                                <View style={styles.mapContainer}>
                                    <MapScreen location={ocorrenciaSelecionada.localizacao} showMap={() => true} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <FontAwesome6 name="helmet-safety" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <View style={styles.rowWithGap}>
                                <Text style={styles.textBold}>EPI:</Text>
                                <Text style={styles.text}>Capacete - Luva - bota</Text>
                            </View>
                        </View>

                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <Entypo name="tools" size={18} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <View style={styles.rowWithGap}>
                                <Text style={styles.textBold}>Equipamento:</Text>
                                <Text style={styles.text}>Pá - Carrinho de mão</Text>
                            </View>
                        </View>

                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <FontAwesome5 name="box-open" size={12} color="#43575F" />
                            </View>
                            <View style={styles.rowWithGap}>
                                <Text style={styles.textBold}>Produtos:</Text>
                                <Text style={styles.text}>Nenhum</Text>
                            </View>
                        </View>
                    </View>

                    {/* {user?.userType.id === 3 && <LeitorNFC />} */}

                    {
                        user?.userType === "OPERATIONAL" && (
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={() => modalizeJustificativaRef.current?.open()} style={styles.justifyButton}>
                                    <Text style={{ color: "#404944", fontSize: 16 }}>JUSTIFICAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push("/checklist" as any)}
                                    style={styles.doneButton}>
                                    <Text style={styles.doneButtonText}>REALIZADA</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                    {
                        user?.userType === "ADM_DIKMA" && (ocorrenciaSelecionada.aprovacao !== "Aprovado" && ocorrenciaSelecionada.aprovacao !== "Reprovado") && (
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.justifyButton}>
                                    <Text style={{ color: "#404944", fontSize: 16 }}>REPROVAR</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.doneButton}>
                                    <Text style={styles.doneButtonText}>APROVAR</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    {
                        user?.userType === "ADM_DIKMA" && ocorrenciaSelecionada.aprovacao === "Aprovado" && (
                            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                                <AprovacoStatus status={ocorrenciaSelecionada?.aprovacao} date={ocorrenciaSelecionada?.dataAprovacao} />
                            </View>
                        )
                    }
                    {
                        user?.userType === "ADM_DIKMA" && ocorrenciaSelecionada.aprovacao === "Reprovado" && (
                            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                                <AprovacoStatus status={ocorrenciaSelecionada?.aprovacao} date={ocorrenciaSelecionada?.dataAprovacao} />
                            </View>
                        )
                    }
                    {/* {
                        ocorrenciaSelecionada.status === "Pendente" && user?.userType.id !== 3 && (
                            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                                <AprovacoStatus status={ocorrenciaSelecionada?.status} date={ocorrenciaSelecionada?.dataAprovacao} />
                            </View>
                        )
                    } */}
                    {/* 
                    {
                        ocorrenciaSelecionada.status !== "Pendente" && user?.userType.id !== 3 && ocorrenciaSelecionada.aprovacao === null && (
                            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                                <AprovacoStatus status={ocorrenciaSelecionada?.provacao} date={ocorrenciaSelecionada?.dataAprovacao} />
                            </View>
                        )
                    } */}

                </View>
            </ScrollView>

            <Modalize
                ref={modalizeJustificativaRef}
                modalStyle={styles.modal}
                adjustToContentHeight
                handleStyle={styles.handle}
                keyboardAvoidingBehavior="padding"
                scrollViewProps={{
                    keyboardShouldPersistTaps: 'handled',
                    contentContainerStyle: { flexGrow: 1 }
                }}
            >
                <View>
                    <View style={styles.modalHeader}>
                        <View style={{ width: 40 }} />
                        <Text style={styles.modalTitle}>Justificar</Text>
                        <TouchableOpacity onPress={() => setModalizeVisible(!modalVisible)} style={styles.closeButton}>
                            <AntDesign name="close" size={26} color="#43575F" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalSubtitle}>Selecione o motivo e envie sua justificativa</Text>
                    <View style={{ gap: 10 }}>
                        <Dropdown
                            mode="outlined"
                            label="Tipo de Justificativa"
                            options={[
                                { label: 'Interna', value: 'option2' },
                                { label: 'Externa', value: 'outro' },
                            ]}
                            value={justificativa.justificativa}
                            onSelect={(value) => setJustificativa({ ...justificativa, justificativa: value })}
                            CustomMenuHeader={() => <></>}
                            menuContentStyle={{ backgroundColor: '#fff' }}
                        />
                        <Dropdown
                            mode="outlined"
                            label="Material"
                            options={OPTIONS}
                            value={justificativa.material}
                            onSelect={(value) => setJustificativa({ ...justificativa, material: value })}
                            CustomMenuHeader={() => <></>}
                            menuContentStyle={{ backgroundColor: '#fff' }}
                        />
                        <TextInput
                            value={justificativa.descricao}
                            onChangeText={(value) => setJustificativa({ ...justificativa, descricao: value })}
                            mode="outlined" label="Descrição" outlineColor="#707974" activeOutlineColor="#707974" style={{ backgroundColor: '#fff', height: 120 }} multiline={true} numberOfLines={4} />
                    </View>
                </View>
                <View style={styles.fotosContainer}>
                    <CapturaImagens texto="Anexe a foto abaixo (obrigatório)" qtsImagens={1} />
                    <TouchableOpacity style={styles.sendButton}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>ENVIAR</Text>
                    </TouchableOpacity>
                </View>
            </Modalize>

            <Modalize
                ref={modalizeDescricaoRef}
                modalStyle={styles.modal}
                adjustToContentHeight
                handleStyle={styles.handle}
                keyboardAvoidingBehavior="padding"
                scrollViewProps={{
                    keyboardShouldPersistTaps: 'handled',
                    contentContainerStyle: { flexGrow: 1 }
                }}
            >
                <View>
                    <View style={styles.modalHeader}>
                        <View style={{ width: 40 }} />
                        <Text style={styles.modalTitle}>Descrição</Text>
                        <TouchableOpacity onPress={() => setModalizeVisible(!modalVisible)} style={styles.closeButton}>
                            <AntDesign name="close" size={26} color="#43575F" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalSubtitle}>Insira uma descrição do motivo pelo qual não participou da realização da atividade.</Text>
                    <View style={{ gap: 10 }}>
                        <TextInput mode="outlined" label="Pessoa" outlineColor="#707974" activeOutlineColor="#707974" />
                        <TextInput mode="outlined" label="Descrição" outlineColor="#707974" activeOutlineColor="#707974" style={{ height: 120 }} multiline={true} numberOfLines={4} />
                    </View>
                </View>
                <View style={styles.fotosContainer}>
                    <TouchableOpacity style={styles.sendButton}>
                        <Text style={{ color: "#fff", fontSize: 16 }}>ENVIAR</Text>
                    </TouchableOpacity>
                </View>
            </Modalize>

            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalizeVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.modalContent}>
                                <Text style={{ alignSelf: "flex-start", color: "#404944", fontSize: 17, fontWeight: "bold" }}>Descartar Alterações?</Text>
                                <Text style={{ alignSelf: "flex-start", color: "#404944", fontSize: 14, marginBottom: 20 }}>Todas as informações preenchidas serão perdidas.</Text>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity style={styles.button} onPress={() => setModalizeVisible(false)}>
                                        <Text style={styles.buttonText}>NÃO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={deletarAlteracoes}>
                                        <Text style={styles.buttonText}>SIM</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </StyledMainContainer>
    );
}

const styles = StyleSheet.create({
    title: {
        color: "#43575F",
        fontSize: 30,
        fontWeight: "bold",
    },
    wrapper: {
        flex: 1,
        flexDirection: "column",
    },
    container: {
        flexDirection: "column",
    },
    header: {
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        color: "#43575F",
    },
    textBold: {
        fontSize: 14,
        color: "#43575F",
        fontWeight: "bold"
    },
    statusTextWhite: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600",
    },
    linha: {
        gap: 5,
        height: 40,
        alignItems: "flex-start",
        flexDirection: "row",
    },
    coluna: {
        width: 35,
        padding: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    rowWithGap: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    iconesContainer:
    {
        height: "100%",
        width: 20,
        backgroundColor: "#EBEBEB",
        alignItems: "center",
        justifyContent: "space-between"
    },
    divisaoIcones: {
        width: 2,
        backgroundColor: "#ccc"
    },
    divisaoVertical: {
        width: 2,
        marginLeft: 8,
        height: "92%",
        backgroundColor: "#ccc"
    },
    imageContainer: {
        width: "85%",
        height: 150,
        marginRight: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    coluna_localizacao: {
        flexDirection: "column",
        gap: 5
    },
    locationContainer: {
        flexDirection: "row",
        gap: 10,
        height: 320,
    },
    locationDetails: {
        flexDirection: "column",
        gap: 10,
        width: "90%"
    },
    locationTextContainer: {
        alignItems: "flex-start",
        marginBottom: 10,
        marginLeft: 2
    },
    mapContainer: {
        width: "100%",
        height: 200,
        backgroundColor: "#ccc",
        borderRadius: 20,
        overflow: "hidden"
    },
    buttonsContainer: {
        gap: 10,
        padding: 10,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    justifyButton: {
        gap: 10,
        width: "48%",
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    doneButton: {
        gap: 10,
        width: "48%",
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "#186B53"
    },
    doneButtonText: {
        color: "#fff",
        fontSize: 16
    },

    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        width: "100%",
        elevation: 1
    },
    handle: {
        position: "absolute",
        top: 19,
        elevation: 1,
        width: "20%",
        backgroundColor: "#186B53",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#43575F"
    },
    modalSubtitle: {
        fontSize: 16,
        alignSelf: "center",
        marginBottom: 10,
        color: "#43575F"
    },
    closeButton: {
        zIndex: 999,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fotosContainer: {
        width: "100%",
        flexDirection: "column",
        marginVertical: 10
    },
    headerFoto: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    textFoto: {
        fontSize: 14,
        color: "#43575F",
        fontWeight: "600"
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 10,
    },
    thumbnailWrapper: {
        position: 'relative',
        width: "100%",
        height: 200,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#186B53',
        borderRadius: 100,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerAddFoto: {
        gap: 7,
        height: 95,
        width: "100%",
        borderWidth: 1,
        alignSelf: "center",
        borderStyle: 'dashed',
        borderRadius: 4,
        paddingVertical: 20,
        marginBottom: 20,
        flexDirection: "column",
        alignItems: "center",
        borderColor: "#0B6780",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    addPhotoText: {
        fontSize: 16,
        color: "#0B6780",
        fontWeight: "500"
    },
    sendButton: {
        gap: 10,
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "#186B53"
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: "85%",
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        gap: 20
    },
    button: {
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#186B53',
        fontWeight: '500',
        fontSize: 15
    },
});