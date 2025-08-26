import CapturaImagens from "@/components/capturaImagens";
import AudioRecorderPlayer from "@/components/gravadorAudio";
import { useGet } from "@/hooks/crud/get/get";
import { useGetUsuario } from "@/hooks/usuarios/get";
import UserData from "@/types/user";
import { toast } from "@backpackapp-io/react-native-toast";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Dropdown } from 'react-native-paper-dropdown';
import { StyledMainContainer } from "../../../styles/StyledComponents";

interface IFormData {
    status: string;
    weight: string;
    userId: string;
    buildingId: string;
    materialId: string;
    occurrenceOriginId: string;
    detailedOccurrenceOriginId: string;
    finalDestinationOccurrenceId: string;
    fallCauseId: string;
    collectionTransportUsedId: string;
    approvalStatus: string;
    images: string[];
    audio: string;
    transcription: string;
}

interface IOptions {
    [key: string]: Array<{ label: string; value: string }>;
}

export default function CadastroOcorrencia() {

    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<IOptions>({});
    const [files, setForm] = useState<IFormData | null>(null);
    const { data: usuarios } = useGetUsuario({})
    const { data: predios } = useGet({ url: 'building' });
    const { data: material } = useGet({ url: 'material' });
    const { data: transporte } = useGet({ url: 'collectionTransportUsed' });

    useEffect(() => {
        const loadOptions = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockOptions = {
                    materialId: [
                        { label: 'Material 1', value: '1' },
                        { label: 'Material 2', value: '2' },
                        { label: 'Material 3', value: '3' }
                    ],
                    occurrenceOriginId: [
                        { label: 'Origem 1', value: '1' },
                        { label: 'Origem 2', value: '2' },
                        { label: 'Origem 3', value: '3' }
                    ],
                    detailedOccurrenceOriginId: [
                        { label: 'Origem Detalhada 1', value: '1' },
                        { label: 'Origem Detalhada 2', value: '2' },
                        { label: 'Origem Detalhada 3', value: '3' }
                    ],
                    finalDestinationOccurrenceId: [
                        { label: 'Destino Final 1', value: '1' },
                        { label: 'Destino Final 2', value: '2' },
                        { label: 'Destino Final 3', value: '3' }
                    ],
                    fallCauseId: [
                        { label: 'Causa 1', value: '1' },
                        { label: 'Causa 2', value: '2' },
                        { label: 'Causa 3', value: '3' }
                    ],
                    collectionTransportUsedId: [
                        { label: 'Transporte 1', value: '1' },
                        { label: 'Transporte 2', value: '2' },
                        { label: 'Transporte 3', value: '3' }
                    ],
                };

                setOptions(mockOptions);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
                toast.error('Erro ao carregar opções');
                setLoading(false);
            }
        };

        loadOptions();
    }, []);

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<IFormData>({
        defaultValues: {
            status: "",
            weight: "",
            userId: "",
            buildingId: "",
            materialId: "",
            occurrenceOriginId: "",
            detailedOccurrenceOriginId: "",
            finalDestinationOccurrenceId: "",
            fallCauseId: "",
            collectionTransportUsedId: "",
            approvalStatus: "",
            transcription: ""
        },
        mode: "onChange"
    });

    const onSubmit = (data: IFormData): void => {

    };

    const validateWeight = (value: string) => {
        if (value && value.trim() !== '') {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                return 'Peso deve ser um número válido';
            }
            if (numValue < 0) {
                return 'Peso não pode ser negativo';
            }
            if (numValue > 1000) {
                return 'Peso não pode ser maior que 1000kg';
            }
        }
        return true;
    };

    const validateImages = (value: string[]) => {
        if (!value || value.length === 0) {
            return 'É necessário adicionar pelo menos uma imagem';
        }
        return true;
    };

    if (loading) {
        return (
            <StyledMainContainer>
                <View style={styles.loadingContainer}>
                    <Text>Carregando opções...</Text>
                </View>
            </StyledMainContainer>
        );
    }

    return (
        <StyledMainContainer>
            <ScrollView>
                <View style={{ flex: 1, justifyContent: "space-between", paddingBottom: 10 }}>
                    <View style={{ gap: 5 }}>

                        <Controller
                            control={control}
                            name="status"
                            rules={{
                                required: 'Selecione o status da ocorrência',
                                validate: (value) => value !== "" || 'Status é obrigatório'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Status da Ocorrência*"
                                        options={[
                                            { label: 'Grave', value: 'SEVERE' },
                                            { label: 'Leve', value: 'MILD' },
                                            { label: 'Nenhuma', value: 'None' }
                                        ]}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="weight"
                            rules={{
                                validate: validateWeight
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label="Peso do Material (kg)"
                                        value={value}
                                        onChangeText={onChange}
                                        outlineColor="#707974"
                                        activeOutlineColor="#707974"
                                        style={{ backgroundColor: '#fff', height: 56 }}
                                        error={!!error}
                                        keyboardType="numeric"
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="userId"
                            rules={{
                                required: 'Selecione o usuário',
                                validate: (value) => value !== "" || 'Usuário é obrigatório'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Usuário Associado*"
                                        options={usuarios?.map((user: UserData) => ({ label: user.name, value: user.id?.toString() })) || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="buildingId"
                            rules={{
                                required: 'Selecione o prédio',
                                validate: (value) => value !== "" || 'Prédio é obrigatório'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Prédio Associado*"
                                        options={predios?.map((predio: any) => ({ label: predio.name, value: predio.id?.toString() })) || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="materialId"
                            rules={{
                                validate: (value) => !value || value === "" || value !== "0" || 'Material inválido'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Material Associado (Opcional)"
                                        options={material?.map((material: any) => ({ label: material.description, value: material.id?.toString() })) || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="occurrenceOriginId"
                            rules={{
                                validate: (value) => !value || value === "" || value !== "0" || 'Origem inválida'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Origem da Ocorrência (Opcional)"
                                        options={options.occurrenceOriginId || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="detailedOccurrenceOriginId"
                            rules={{
                                validate: (value) => !value || value === "" || value !== "0" || 'Origem detalhada inválida'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Origem Detalhada (Opcional)"
                                        options={options.detailedOccurrenceOriginId || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="finalDestinationOccurrenceId"
                            rules={{
                                required: 'Selecione o destino final',
                                validate: (value) => value !== "" || 'Destino final é obrigatório'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Destino Final da Ocorrência*"
                                        options={options.finalDestinationOccurrenceId || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="fallCauseId"
                            rules={{
                                validate: (value) => !value || value === "" || value !== "0" || 'Causa da queda inválida'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Causa da Queda (Opcional)"
                                        options={options.fallCauseId || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="collectionTransportUsedId"
                            rules={{
                                validate: (value) => !value || value === "" || value !== "0" || 'Transporte inválido'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Transporte para Recolhimento (Opcional)"
                                        options={transporte?.map((transport: any) => ({ label: transport.description, value: transport.id?.toString() })) || []}
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="approvalStatus"
                            rules={{
                                required: 'Selecione o status de aprovação',
                                validate: (value) => value !== "" || 'Status de aprovação é obrigatório'
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Dropdown
                                        mode="outlined"
                                        label="Status de Aprovação*"
                                        options={
                                            [{ label: 'Pendente', value: 'pending' },
                                            { label: 'Aprovado', value: 'approved' },
                                            { label: 'Rejeitado', value: 'rejected' }]
                                        }
                                        value={value}
                                        onSelect={onChange}
                                        CustomMenuHeader={() => <View></View>}
                                        menuContentStyle={{ backgroundColor: '#fff' }}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="transcription"
                            rules={{
                                maxLength: {
                                    value: 1000,
                                    message: 'Transcrição não pode ter mais de 1000 caracteres'
                                }
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <TextInput
                                        mode="outlined"
                                        label="Transcrição do Áudio (Opcional)"
                                        value={value}
                                        onChangeText={onChange}
                                        outlineColor="#707974"
                                        activeOutlineColor="#707974"
                                        style={{ backgroundColor: '#fff', minHeight: 100 }}
                                        multiline
                                        numberOfLines={4}
                                        error={!!error}
                                    />
                                    {error && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                    {value && (
                                        <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                                            {value.length}/1000 caracteres
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                    </View>


                    <CapturaImagens
                        texto="Adicionar fotos*"
                        qtsImagens={3}
                        setForm={(uris) => setValue("images", uris)}
                    />

                    <AudioRecorderPlayer setForm={(audioUri) => setForm((prevState) => ({ ...prevState, audio: audioUri } as IFormData))} />

                    <TouchableOpacity
                        style={[
                            styles.buttons,
                            Object.keys(errors).length > 0 && styles.buttonDisabled
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={Object.keys(errors).length > 0}
                    >
                        <Text style={{ color: "#fff", fontSize: 16 }}>
                            {Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Cadastrar Ocorrência'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </StyledMainContainer >
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
        backgroundColor: "#186B53",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
        borderColor: "#999",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorSummary: {
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    errorSummaryTitle: {
        color: '#c62828',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    errorSummaryItem: {
        color: '#c62828',
        fontSize: 12,
        marginLeft: 8,
    }
});