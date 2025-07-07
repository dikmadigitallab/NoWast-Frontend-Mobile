import CapturaImagens from "@/components/capturaImagens";
import AudioRecorderPlayer from "@/components/gravadorAudio";
import { customTheme } from "@/config/inputsTheme";
import { StyledMainContainer } from "@/styles/StyledComponents";
import { toast } from '@backpackapp-io/react-native-toast';
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PaperProvider, TextInput } from "react-native-paper";
import { DatePickerInput } from 'react-native-paper-dates';
import { Dropdown } from 'react-native-paper-dropdown';

const OPTIONS = [
    { label: 'Opção 1', value: 'option1' },
    { label: 'Opção 2', value: 'option2' },
    { label: 'Opção 3', value: 'option3' },
];

export default function CadastroOcorrencia() {

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            genero: '',
            colaborador: "",
            data: "",
            hora: "",
            material: "",
            status: "",
            peso: "",
            origem: "",
            origem_detalhada: "",
            destino_final: "",
            causa_queda: "",
            trans_ult_para_recolhimento: "",
            fotos: [""],
            audio: ""
        },
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <StyledMainContainer>
            <PaperProvider theme={customTheme}>
                <ScrollView>
                    <View style={{ flex: 1, justifyContent: "space-between" }}>
                        <View style={{ gap: 5 }}>
                            <Controller
                                control={control}
                                name="colaborador"
                                rules={{ required: 'Digite nome do colaborador' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <TextInput
                                            mode="outlined"
                                            label="Colaborador"
                                            value={value}
                                            onChangeText={onChange}
                                            outlineColor="#707974"
                                            activeOutlineColor="#707974"
                                            style={{ backgroundColor: '#fff', height: 56 }}
                                            error={!!error}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="causa_queda"
                                rules={{ required: 'Digite o causa da queda' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <TextInput
                                            mode="outlined"
                                            label="Causa da queda"
                                            value={value}
                                            onChangeText={onChange}
                                            outlineColor="#707974"
                                            activeOutlineColor="#707974"
                                            style={{ backgroundColor: '#fff', height: 56 }}
                                            error={!!error}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="data"
                                rules={{ required: 'Digite a data' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <DatePickerInput
                                            locale="pt-BR"
                                            mode="outlined"
                                            presentationStyle="pageSheet"
                                            label="Selecione uma data"
                                            saveLabel="Confirmar"
                                            value={value ? new Date(value) : undefined}
                                            onChange={onChange}
                                            style={{ backgroundColor: '#fff', height: 56 }}
                                            inputMode="start"
                                            outlineColor="#707974"
                                            activeOutlineColor="#707974"
                                            error={!!error}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="hora"
                                rules={{ required: 'Digite a hora' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <TextInput
                                            mode="outlined"
                                            label="Hora"
                                            value={value}
                                            onChangeText={onChange}
                                            outlineColor="#707974"
                                            activeOutlineColor="#707974"
                                            style={{ backgroundColor: '#fff', height: 56 }}
                                            error={!!error}
                                            keyboardType="numeric"
                                            placeholder="HH:MM"
                                            maxLength={5}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="status"
                                rules={{ required: 'Selecione o Status' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Status"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Status"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="trans_ult_para_recolhimento"
                                rules={{ required: 'Selecione o Trans. Ult. p/ Recolhimento' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Trans. Ult. p/ Recolhimento"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Trans. Ult. p/ Recolhimento"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="origem"
                                rules={{ required: 'Selecione o Origem' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Origem"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Origem"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="origem_detalhada"
                                rules={{ required: 'Selecione o origem detalhada' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Origem detalhada"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Origem detalhada"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="destino_final"
                                rules={{ required: 'Selecione o destino final' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Destino final"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Destino final"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="genero"
                                rules={{ required: 'Selecione o genero' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Genero"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Genero"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />

                            <Controller
                                control={control}
                                name="material"
                                rules={{ required: 'Selecione o Material' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <>
                                        <Dropdown
                                            mode="outlined"
                                            label="Material"
                                            options={OPTIONS}
                                            value={value}
                                            onSelect={onChange}
                                            CustomMenuHeader={() => <></>}
                                            menuContentStyle={{ backgroundColor: '#fff' }}
                                            CustomDropdownInput={({ onFocus, onBlur }: any) => (
                                                <TextInput
                                                    mode="outlined"
                                                    label="Material"
                                                    value={OPTIONS.find(opt => opt.value === value)?.label || ''}
                                                    onFocus={onFocus}
                                                    onBlur={onBlur}
                                                    outlineColor="#707974"
                                                    activeOutlineColor="#707974"
                                                    style={{ backgroundColor: '#fff', height: 56 }}
                                                    right={<TextInput.Icon icon="menu-down" />}
                                                    editable={false}
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                        {error && (<Text style={{ color: 'red', fontSize: 12, backgroundColor: 'transparent' }}>{error.message}</Text>)}
                                    </>
                                )}
                            />
                        </View>

                        <CapturaImagens texto="Adicionar fotos" qtsImagens={3} />

                        <View style={[styles.containerFile, { gap: 10 }]}>
                            <View style={styles.headerFoto}>
                                <FontAwesome name="microphone" size={24} color="#43575F" />
                                <Text style={styles.textFoto}>Descrição por áudio</Text>
                            </View>
                            <View>
                                <AudioRecorderPlayer />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.buttons}
                            onPress={() => toast.success('Cadastro realizado com sucesso', { duration: 3000 })}
                        >
                            <Text style={{ color: "#fff", fontSize: 16 }}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </PaperProvider>
        </StyledMainContainer>

    );
}

const styles = StyleSheet.create({
    buttons: {
        marginVertical: 20,
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
    containerFile: {
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
    fotoInfoText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 34,
    },
    containerAddFoto: {
        gap: 7,
        height: 95,
        width: "90%",
        borderWidth: 1,
        alignSelf: "center",
        borderStyle: 'dashed',
        borderRadius: 4,
        paddingVertical: 20,
        flexDirection: "column",
        alignItems: "center",
        borderColor: "#0B6780",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginVertical: 10,
    },
    thumbnailWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});