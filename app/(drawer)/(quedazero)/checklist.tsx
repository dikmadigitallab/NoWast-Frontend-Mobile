import CapturaImagens from '@/components/capturaImagens';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import AudioRecorderPlayer from '../../../components/gravadorAudio';
import { StyledMainContainer } from '../../../styles/StyledComponents';

export default function Checklist() {

    const [checked, setChecked] = useState({
        limparPiso: false,
        limparParede: false,
        limparCorreia: false,
    });

    return (
        <StyledMainContainer>
            <View style={[styles.container, { paddingBottom: Dimensions.get('window').height - 1300 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <AntDesign name="check" size={20} color="#43575F" />
                    <Text style={{ color: "#43575F", fontSize: 14, fontWeight: 'bold' }}>Checklist</Text>
                </View>
                <TouchableOpacity style={{
                    backgroundColor: checked.limparPiso ? '#186B53' : '#fff',
                    padding: 15, borderRadius: 4, borderWidth: 1, borderColor: '#DCE2E2', flexDirection: 'row', alignItems: 'center'
                }}
                    onPress={() => {
                        setChecked({ ...checked, limparPiso: !checked.limparPiso });
                    }}
                >
                    <Checkbox
                        status={checked.limparPiso ? 'checked' : 'unchecked'}
                        color={checked.limparPiso ? '#fff' : '#fff'}
                    />
                    <Text style={{ color: checked.limparPiso ? '#fff' : "#404944", fontSize: 16 }}>Limpar o piso</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: checked.limparParede ? '#186B53' : '#fff', padding: 15, borderRadius: 4, borderWidth: 1, borderColor: '#DCE2E2', flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => { setChecked({ ...checked, limparParede: !checked.limparParede }); }}
                >
                    <Checkbox
                        status={checked.limparParede ? 'checked' : 'unchecked'}
                        color={checked.limparParede ? '#fff' : '#fff'}

                    />
                    <Text style={{ color: checked.limparParede ? '#fff' : "#404944", fontSize: 16 }}>Limpar a parede</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor: checked.limparCorreia ? '#186B53' : '#fff',
                    padding: 15, borderRadius: 4, borderWidth: 1, borderColor: '#DCE2E2', flexDirection: 'row', alignItems: 'center'
                }}
                    onPress={() => {
                        setChecked({ ...checked, limparCorreia: !checked.limparCorreia });
                    }}
                >
                    <Checkbox
                        status={checked.limparCorreia ? 'checked' : 'unchecked'}
                        color={checked.limparCorreia ? '#fff' : '#fff'}
                    />
                    <Text style={{ color: checked.limparCorreia ? '#fff' : "#404944", fontSize: 16 }}>Limpar atrás da correia</Text>
                </TouchableOpacity>

                <CapturaImagens texto="Adicionar fotos" qtsImagens={3} />
                <AudioRecorderPlayer />

                <TouchableOpacity style={styles.Button}>
                    <Text style={{ color: "#fff", fontSize: 16 }}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </StyledMainContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        width: '100%',
        flex: 1,
    },
    Button: {
        width: '100%',
        borderRadius: 12,
        paddingVertical: 20,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#186B53",
        justifyContent: "center",
        backgroundColor: "#186B53"
    }
});