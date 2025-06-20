import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native"
import { InformationsContext } from "../context/formInfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from "../components/Container/container";
import { Colors } from "../context/personalizacoes";

export default function Cadastrar(){
    const {nome, data_nasc, tipoSang, alergia,
  medicacao, nomeCont, numContato,
  setNome, setData_nasc, setTipoSang, setAlergia,
  setMedicacao, setNomeCont, setNumContato
} = useContext(InformationsContext);

const [loading, setLoading] = useState(false);

// Salvar dados
const saveData = async () => {
    value = {
        nome, data_nasc, tipoSang, alergia,
        medicacao, nomeCont, numContato
    }
  try {
    await AsyncStorage.setItem("dados", JSON.stringify(value));
    console.log('Dados salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    Alert.alert("Erro", "Não foi possível salvar os dados.");
  }
};

// Recuperar dados
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("dados");
    console.log(value)
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao recuperar as informações:', error);
    Alert.alert("Erro", "Não foi possível carregar os dados.");
    return null;
  }
};
/* Tirar daqui
const salvarHistoricoEmergencia = async (location) => {
        try {
            const historico = await AsyncStorage.getItem('historicoEmergencias');
            let emergencias = historico ? JSON.parse(historico) : [];
            
            const novaEmergencia = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                timestamp: new Date().toISOString(),
                contato: contato,
                accuracy: location.coords.accuracy
            };
            
            emergencias.unshift(novaEmergencia); // Adiciona no início
            emergencias = emergencias.slice(0, 20); // Mantém apenas 20 últimas
            
            await AsyncStorage.setItem('historicoEmergencias', JSON.stringify(emergencias));
            console.log('Emergência salva no histórico');
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    };
*/

// Carrega dados ao iniciar
useEffect(() => {
        const loadData = async () => {
    setLoading(true);
    const savedData = await getData();
    if (!savedData) {
        Alert.alert("Aviso", "Você não tem dados cadastrados.");
    } else {
        setNome(savedData.nome);
        setData_nasc(savedData.data_nasc);
        setTipoSang(savedData.tipoSang);
        setAlergia(savedData.alergia);
        setMedicacao(savedData.medicacao);
        setNomeCont(savedData.nomeCont);
        setNumContato(savedData.numContato);
    }
    setLoading(false);
};

        loadData();
    }, []);

    // Salva dados quando algum campo relevante muda
    useEffect(() => {
        if (nome && numContato) { // Só salva se nome e numContato estiverem preenchidos
            saveData();
        }
    }, [nome, data_nasc, alergia, numContato]);

   return(
   <Container> 
        <View style={styles.viewBtn}>
            <Text>Nome Completo</Text>
            <TextInput placeholder="Digite seu nome..." onChangeText={(text) => setNome(text)}
                value={nome} 
                />
        </View>

        <View style={styles.viewBtn}>
            <Text>data de nascimento</Text>
            <TextInput placeholder="DD/MM/AAAA" onChangeText={(text) => setData_nasc(text)} 
                value={data_nasc}
                />
        </View>

        <View style={styles.viewBtn}>
            <Text>Qual o seu tipo sanguineo</Text>
            <TextInput placeholder="EX: B+" onChangeText={(text) => setTipoSang(text)}
                value={tipoSang}    
                />
        </View>

        <View style={styles.viewBtn}>
            <Text>você tem alguma alergia?</Text>
            <TextInput placeholder="Alergic(o)a " onChangeText={(text) => setAlergia(text)}
                value={alergia}    
            />
        </View>

        <View style={styles.viewBtn}>
            <Text>Toma algum tipo de medicação periódica?</Text>
            <TextInput placeholder="medicação" onChangeText={(text) => setMedicacao(text)} 
                value={medicacao}    
                />
        </View>
        
        <View style={styles.viewBtn}>
            <Text>Nome do Contato</Text>
            <TextInput placeholder="Digite seu nome..." onChangeText={(text) => setNomeCont(text)}
                value={nomeCont} 
                />
        </View>
        
        <View style={styles.viewBtn}>
            <Text>Numero para contato:</Text>
            <TextInput placeholder="(DDD) 9 91234567" onChangeText={(text) => setNumContato(text)}
                value={numContato} 
                />
        </View>
    </Container>
)}

const styles = StyleSheet.create({
    viewBtn: {
            
            alignItems: "center",
            padding: 10,
            backgroundColor: Colors.menu3,
            borderRadius: 15,
            margin: 5
        },
        inputs:{
            height: 50,
            width: 50
        }
})