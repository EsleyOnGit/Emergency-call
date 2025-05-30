import { useContext, useEffect } from "react";
import { View, Text, TextInput } from "react-native"
import { InformationsContext } from "../context/formInfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastrar(){
    const {nome, data_nasc, tipoSang, alergia,
  medicacao, nomeCont, numContato,
  setNome, setData_nasc, setTipoSang, setAlergia,
  setMedicacao, setNomeCont, setNumContato
} = useContext(InformationsContext);

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
  }
};

// Recuperar dados
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("dados");
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Erro ao recuperar as informações:', error);
    return null;
  }
};

useEffect(()=>{
    saveData();
    getData();
},[nome, data_nasc,alergia, numContato])

   return(
   <View> 
        <View>
            <Text>Nome Completo</Text>
            <TextInput placeholder="Digite seu nome..." onChangeText={(text) => setNome(text)}
                value={nome} 
                />
        </View>

        <View>
            <Text>data de nascimento</Text>
            <TextInput placeholder="DD/MM/AAAA" onChangeText={(text) => setData_nasc(text)} 
                value={data_nasc}
                />
        </View>

        <View>
            <Text>Qual o seu tipo sanguineo</Text>
            <TextInput placeholder="EX: B+" onChangeText={(text) => setTipoSang(text)}
                value={tipoSang}    
                />
        </View>

        <View>
            <Text>você tem alguma alergia?</Text>
            <TextInput placeholder="Alergic(o)a " onChangeText={(text) => setAlergia(text)}
                value={alergia}    
            />
        </View>

        <View>
            <Text>Toma algum tipo de medicação periódica?</Text>
            <TextInput placeholder="medicação" onChangeText={(text) => setMedicacao(text)} 
                value={medicacao}    
                />
        </View>
        
        <View>
            <Text>Nome do Contato</Text>
            <TextInput placeholder="Digite seu nome..." onChangeText={(text) => setNomeCont(text)}
                value={nomeCont} 
                />
        </View>
        
        <View>
            <Text>Numero para contato:</Text>
            <TextInput placeholder="(DDD) 9 91234567" onChangeText={(text) => setNumContato(text)}
                value={numContato} 
                />
        </View>
    </View>
)}