import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Button from "../Button/Button";
import { useContext } from 'react';
import { InformationsContext } from '../context/formInfo';

export default function Profile() {
  const {
  nome, data_nasc, tipoSang, alergia,
  medicacao, nomeCont, numContato
} = useContext(InformationsContext);

  return (
    <View style={styles.container}>
      <Button title="Nome" descricao={nome} />
    
      <Button title="idade" descricao={2025-data_nasc} />

      <Button title="Tipo Sanguineo" descricao={tipoSang}/>  

      <Button title="Alergica a" descricao={alergia}/>

      <Button title="medicação" descricao={medicacao}/>  

      <Button title="Contato cadastrado" descricao={nomeCont}/>
      <Button title="Contato cadastrado" descricao={numContato}/>
      <TouchableOpacity title="Abrir Modal" onPress={() => EditInformation(true)} ><Text>abrir modal</Text></TouchableOpacity>

      


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // fundo semi-transparente
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
});