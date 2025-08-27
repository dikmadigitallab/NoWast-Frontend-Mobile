import CapturaImagens from "@/components/capturaImagens";
import AudioRecorderPlayer from "@/components/gravadorAudio";
import { useCreate } from "@/hooks/crud/create/create";
import { useGet } from "@/hooks/crud/get/get";
import { useGetUsuario } from "@/hooks/usuarios/get";
import { IFormOccurrence } from "@/types/IOcorrencias";
import UserData from "@/types/user";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Dropdown } from 'react-native-paper-dropdown';
import { StyledMainContainer } from "../../../styles/StyledComponents";

export default function CadastroOcorrencia() {

    const { create } = useCreate()
    const { data: usuarios } = useGetUsuario({})
    const { data: predios } = useGet({ url: 'building' });
    const { data: material } = useGet({ url: 'material' });
    const { data: causa_queda } = useGet({ url: 'fallCause' });
    const { data: destino } = useGet({ url: 'occurrenceOrigin' });
    const { data: transporte } = useGet({ url: 'collectionTransportUsed' });
    const { data: destino_final } = useGet({ url: 'finalDestinationOccurrence' });
    const { data: destino_detalhada } = useGet({ url: 'detailedOccurrenceOrigin' });

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<IFormOccurrence>({
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
            approvalDate: "",
            transcription: ""
        },
        mode: "onChange"
    });

    const onSubmit = (data: IFormOccurrence): void => {
        create(data, 'ocorrencia criada com sucesso!');
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
                                        options={destino?.map((destino: any) => ({ label: destino.description, value: destino.id?.toString() })) || []}
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
                                        options={destino_detalhada?.map((finalDes: any) => ({ label: finalDes.description, value: finalDes.id?.toString() })) || []}
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
                                        options={destino_final?.map((finalDes: any) => ({ label: finalDes.description, value: finalDes.id?.toString() })) || []}
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
                                        options={causa_queda?.map((queda: any) => ({ label: queda.description, value: queda.id?.toString() })) || []}
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
                                            [{ label: 'Pendente', value: 'PENDING' },
                                            { label: 'Aprovado', value: 'APPROVED' },
                                            { label: 'Rejeitado', value: 'REJECTED' }]
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

                    <CapturaImagens texto="Adicionar fotos*" qtsImagens={3} setForm={(uris) => setValue("images", uris)} />
                    <AudioRecorderPlayer setForm={(audioUri) => setValue("audio", audioUri)} />

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