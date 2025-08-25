import CapturaImagens from '@/components/capturaImagens';
import { useCloseActivity } from '@/hooks/atividade/update';
import { useDataStore } from '@/store/dataStore';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import AudioRecorderPlayer from '../../../components/gravadorAudio';
import { StyledMainContainer } from '../../../styles/StyledComponents';

interface IFormData {
    id: number;
    status: string;
    observation: string;
    completedChecklistIds: number[];
    pendingChecklistIds: number[];
    audio: string;
    images: string[];
}

interface IChecklist {
    id: number,
    name: string
}

export default function Checklist() {

    const { data } = useDataStore();

    const defaultForm: IFormData = {
        id: data?.[0]?.id || 0,
        status: "COMPLETED",
        observation: "",
        completedChecklistIds: [],
        pendingChecklistIds: [],
        audio: "",
        images: []
    };

    const [form, setForm] = useState<IFormData | null>(defaultForm);

    const { close, error } = useCloseActivity();

    const handleCheckboxChange = (id: number) => {
        setForm((prevState: IFormData | null) => {
            if (!prevState) return null;

            const isChecked = prevState.completedChecklistIds.includes(id);
            return {
                ...prevState,
                completedChecklistIds: isChecked
                    ? prevState.completedChecklistIds.filter((itemId: number) => itemId !== id)
                    : [...prevState.completedChecklistIds, id]
            };
        });
    };

    //Função responsável por enviar os dados
    const handleSubmit = () => {
        const allIds = data?.[0]?.checklist?.map((item: IChecklist) => item.id) || [];

        const pendingChecklistIds = allIds.filter(
            (id: number) => !form?.completedChecklistIds.includes(id)
        );

        const finalForm = {
            ...form,
            pendingChecklistIds,
        };

        close(finalForm, "Atividade finalizada com sucesso");

        if (!error) {
            setForm(null)
        }
    };

    return (
        <View style={styles.mainContainer}>

            <StyledMainContainer>
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <AntDesign name="check" size={24} color="#186B53" />
                            <Text style={styles.headerText}>Checklist de Limpeza</Text>
                        </View>
                        <Text style={styles.subtitle}>Marque as tarefas concluídas</Text>
                    </View>

                    <View style={styles.checklistContainer}>
                        {data?.[0]?.checklist?.map((item: IChecklist) => {
                            const isChecked = form?.completedChecklistIds.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.checklistItem,
                                        isChecked && styles.checklistItemSelected
                                    ]}
                                    onPress={() => handleCheckboxChange(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.checkboxContainer}>
                                        <Checkbox
                                            status={isChecked ? 'checked' : 'unchecked'}
                                            color={isChecked ? '#fff' : '#186B53'}
                                        />
                                        <Text style={[
                                            styles.checklistText,
                                            isChecked && styles.checklistTextSelected
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </View>
                                    {isChecked && (
                                        <AntDesign name="checkcircle" size={20} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.mediaSection}>
                        <View style={styles.mediaContainer}>
                            <CapturaImagens
                                texto="Adicionar fotos"
                                qtsImagens={3}
                                setForm={(uris) => setForm((prev) => prev ? { ...prev, images: uris } : { ...defaultForm, images: uris })}
                            />
                            <AudioRecorderPlayer
                                setForm={(uri) => setForm((prev) => prev ? { ...prev, audio: uri } : { ...defaultForm, audio: uri })}
                            />
                        </View>
                    </View>

                    <View style={styles.observationsSection}>
                        <Text style={styles.sectionTitle}>Observações</Text>
                        <TextInput
                            value={form?.observation || ''}
                            onChangeText={(value) => setForm((prev) => prev ? { ...prev, observation: value } : { ...defaultForm, observation: value })}
                            mode="outlined"
                            placeholder="Digite suas observações aqui..."
                            outlineColor="#E8EDEC"
                            activeOutlineColor="#186B53"
                            style={styles.textInput}
                            multiline={true}
                            numberOfLines={4}
                            theme={{
                                colors: {
                                    primary: '#186B53',
                                    background: '#fff',
                                    placeholder: '#9CA3A2',
                                    text: '#404944'
                                }
                            }}
                        />
                    </View>

                </ScrollView>
            </StyledMainContainer>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
                    <Text style={styles.submitButtonText}>Finalizar Atividade</Text>
                    <AntDesign name="arrowright" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAF9',
    },
    scrollContent: {
        gap: 24,
        paddingBottom: 100,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    headerText: {
        color: '#186B53',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#707974',
        fontSize: 14,
    },
    checklistContainer: {
        gap: 6
    },
    checklistItem: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8EDEC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checklistItemSelected: {
        backgroundColor: '#186B53',
        borderColor: '#186B53',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checklistText: {
        color: '#404944',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    checklistTextSelected: {
        color: '#fff',
    },
    mediaSection: {
        gap: 16,
    },
    sectionTitle: {
        color: '#43575F',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mediaContainer: {
        gap: 16,
    },
    observationsSection: {
        gap: 16,
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        fontSize: 16,
        height: 120,
        textAlignVertical: 'top',
    },
    fixedButtonContainer: {
        bottom: 0,
        width: '100%',
        alignSelf: 'center',
        position: 'absolute',
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButton: {
        backgroundColor: '#186B53',
        borderRadius: 12,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});