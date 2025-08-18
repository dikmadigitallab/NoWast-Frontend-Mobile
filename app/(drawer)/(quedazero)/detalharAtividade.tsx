import AprovacoStatus from "@/components/aprovacaoStatus";
import LeituraNFC from "@/components/leitorNFC";
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Modalize } from 'react-native-modalize';
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import CapturaImagens from "../../../components/capturaImagens";
import { useAuth } from "../../../contexts/authProvider";
import { useOcorrenciasStore } from "../../../store/storeOcorrencias";
import { StatusContainer, StyledMainContainer } from "../../../styles/StyledComponents";
import { getStatusColor } from "../../../utils/statusColor";

const OPTIONS = [
    { label: 'Atestado', value: 'atestado' },
    { label: 'Opção 2', value: 'option2' },
    { label: 'Outro', value: 'outro' },
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

    console.log(ocorrenciaSelecionada)

    return (
        <StyledMainContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 15 }}>Descrição da atividade, aqui vai ficar a descrição que foi digitada da atividade.</Text>
                </View>
                <View style={[styles.wrapper, { paddingBottom: Dimensions.get('window').height - 750 }]}>
                    <View style={styles.container}>
                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <Entypo name="calendar" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.text}>{ocorrenciaSelecionada?.dateTime}</Text>
                        </View>

                        <View style={[styles.linha, { height: 150, alignItems: "flex-start" }]}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 10 }]}>
                                <AntDesign name="camera" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <View style={{ flexDirection: "column", gap: 10 }}>
                                {ocorrenciaSelecionada?.activityFiles?.length === 0 ? (
                                    <View style={{ width: 200, height: "100%", marginRight: 10, justifyContent: "center", alignItems: "center" }}>
                                        <MaterialCommunityIcons name="image-off-outline" size={120} color="#385866" />
                                    </View>
                                ) : (
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingRight: 50 }}
                                    >
                                        {ocorrenciaSelecionada?.activityFiles?.map((url: string, index: number) => (
                                            <View key={index} style={{ width: 200, height: "100%", marginRight: 10 }}>
                                                <Image
                                                    source={{ uri: url }}
                                                    style={styles.image}
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}

                            </View>
                        </View>

                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <FontAwesome6 name="user-tie" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.textBold}>Encarregado:</Text>
                            <Text style={styles.text}>{ocorrenciaSelecionada?.manager}</Text>
                        </View>

                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <FontAwesome6 name="user-check" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.textBold}>Supervisor:</Text>
                            <Text style={styles.text}>{ocorrenciaSelecionada?.supervisor}</Text>
                        </View>

                        <View style={[styles.linha, { alignItems: "flex-start" }]}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <Entypo name="flag" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <StatusContainer backgroundColor={getStatusColor(ocorrenciaSelecionada?.approvalStatus)}>
                                <Text style={styles.statusTextWhite}>{ocorrenciaSelecionada?.approvalStatus}</Text>
                            </StatusContainer>
                        </View>

                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <FontAwesome5 name="building" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.textBold}>Ambiente:</Text>
                            <Text style={styles.text}>{ocorrenciaSelecionada?.environment}</Text>
                        </View>

                        <View style={styles.linha}>
                            <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                <Entypo name="resize-full-screen" size={15} color="#43575F" />
                                <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                            </View>
                            <Text style={styles.textBold}>Dimensão:</Text>
                            <Text style={styles.text}>{ocorrenciaSelecionada?.dimension}</Text>
                        </View>

                        {ocorrenciaSelecionada?.ppe && (
                            <View style={styles.linha}>
                                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                    <FontAwesome6 name="helmet-safety" size={15} color="#43575F" />
                                    <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                                </View>
                                <Text style={styles.textBold}>EPI:</Text>
                                <Text style={styles.text}>{ocorrenciaSelecionada?.ppe ?? "Nenhum"}</Text>
                            </View>
                        )}

                        {ocorrenciaSelecionada?.tools.length > 0 && (
                            <View style={styles.linha}>
                                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                    <Entypo name="tools" size={15} color="#43575F" />
                                    <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                                </View>
                                <Text style={styles.textBold}>Ferramentas:</Text>
                                <View style={{ flexDirection: "row" }}>
                                    {ocorrenciaSelecionada?.tools.map((tool) => (
                                        <Text key={tool.id} style={styles.text}> - {tool.name}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {ocorrenciaSelecionada?.products.length > 0 && (
                            <View style={styles.linha}>
                                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                    <FontAwesome5 name="box-open" size={12} color="#43575F" />
                                    <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} />
                                </View>
                                <Text style={styles.textBold}>Produtos:</Text>
                                <View style={{ flexDirection: "row" }}>
                                    {ocorrenciaSelecionada?.products.map((prod) => (
                                        <Text key={prod.id} style={styles.text}> - {prod.name}</Text>
                                    ))}
                                </View>
                            </View>
                        )
                        }

                        {ocorrenciaSelecionada?.transports.length > 0 && (
                            <View style={styles.linha}>
                                <View style={[styles.coluna, { height: "100%", justifyContent: "flex-start", gap: 5 }]}>
                                    <FontAwesome6 name="truck" size={15} color="#43575F" />
                                    {/* <View style={{ flex: 1, width: 1, backgroundColor: "#ccc" }} /> */}
                                </View>
                                <Text style={styles.textBold}>Transportes:</Text>
                                <View style={{ flexDirection: "row" }}>
                                    {ocorrenciaSelecionada?.transports.map((t) => (
                                        <Text key={t.id} style={styles.text}> - {t.name}</Text>
                                    ))}
                                </View>
                            </View>
                        )
                        }
                    </View>

                    {user?.userType === "OPERATIONAL" && ocorrenciaSelecionada.approvalStatus === null && <LeituraNFC />}

                    {
                        user?.userType === "OPERATIONAL" && ocorrenciaSelecionada.approvalStatus === null && (
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
                        (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE") && ocorrenciaSelecionada.approvalStatus === null && (
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
                        (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE" || user?.userType === "OPERATIONAL") && ocorrenciaSelecionada.approvalStatus === "Aprovado" && (
                            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                                <AprovacoStatus status={ocorrenciaSelecionada?.approvalStatus} date={ocorrenciaSelecionada?.approvalStatus} />
                            </View>
                        )
                    }

                    {
                        (user?.userType === "ADM_DIKMA" || user?.userType === "ADM_CLIENTE" || user?.userType === "OPERATIONAL") && ocorrenciaSelecionada.approvalStatus === "Reprovado" && (
                            <View style={{ width: "100%", height: 90, borderRadius: 5, overflow: "hidden", marginBottom: 10 }}>
                                <AprovacoStatus status={ocorrenciaSelecionada?.approvalStatus} date={ocorrenciaSelecionada?.approvalStatus} />
                            </View>
                        )
                    }
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
                            CustomMenuHeader={() => <View></View>}
                            menuContentStyle={{ backgroundColor: '#fff' }}
                        />
                        <Dropdown
                            mode="outlined"
                            label="Material"
                            options={OPTIONS}
                            value={justificativa.material}
                            onSelect={(value) => setJustificativa({ ...justificativa, material: value })}
                            CustomMenuHeader={() => <View></View>}
                            menuContentStyle={{ backgroundColor: '#fff' }}
                        />
                        <TextInput
                            value={justificativa.descricao}
                            onChangeText={(value) => setJustificativa({ ...justificativa, descricao: value })}
                            mode="outlined" label="Descrição" outlineColor="#707974" activeOutlineColor="#707974" style={{ backgroundColor: '#fff', height: 120 }} multiline={true} numberOfLines={4} />
                    </View>
                </View>
                <View style={styles.fotosContainer}>
                    <CapturaImagens texto="Anexe a foto abaixo (obrigatório)" qtsImagens={3} />
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
                    <Text style={styles.modalSubtitle}>Insira uma descrição do motivo pelo qual não participou da realização da ocorrenciaSelecionada?.</Text>
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
        gap: 20,
        flexDirection: "column",
    },
    container: {
        flexDirection: "column",
        gap: 2,
        paddingBottom: 20,
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
        alignItems: "center",
    },
    rowWithGap: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    imageContainer: {
        width: 150,
        height: 100,
        marginRight: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    coluna_localizacao: {
        flexDirection: "column"
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
        marginBottom: 20,
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
        marginBottom: 20
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
        borderWidth: 1,
        borderColor: '#43575F',
        borderRadius: 50
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
        fontSize: 20
    },
});