import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Button from "../Button/Button";

export default function Profile() {

  return (
    <View style={styles.container}>
      <Button title="Nome" descricao="Fulana da Conceição" />
    
      <Button title="idade" descricao="24" />

      <Button title="Tipo Sanguineo" descricao="A-"/>  

      <Button title="Alergica a" descricao="dipirona"/>

      <Button title="medicação" descricao="almendazol"/>  

      <Button title="Contato cadastrado" descricao="Jozé"/>
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