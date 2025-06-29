import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from "../Button/Button";
import { useContext } from 'react';
import { InformationsContext } from '../context/formInfo';
import Container from '../components/Container/container';

export default function Profile() {
  const {
  nome, data_nasc, tipoSang, alergia,
  medicacao, nomeCont, numContato,setContato
} = useContext(InformationsContext);

  return (
    <Container>
      <View style={styles.container}>
        
        <View style={styles.itens}>
          <Button title="Nome" descricao={nome} />
          <Button title="idade" descricao={2025-data_nasc} />
        </View>

        <View style={styles.itens}>
          <Button title="Tipo Sanguineo" descricao={tipoSang}/>  
          <Button title="Alergica a" descricao={alergia}/>
        </View>

        <View style={styles.itens}>
          <Button title="medicação" descricao={medicacao}/>  
          <Button title="Contato cadastrado" descricao={nomeCont}/>
        </View> 

        <Button title="Contato cadastrado" descricao={numContato}/>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
  },
  itens:{
    alignItems: "flex-start"
  }
});