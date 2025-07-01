import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useState } from 'react';
import Button from "../Button/Button";
import { useContext } from 'react';
import { InformationsContext } from '../context/formInfo';
import Container from '../components/Container/container';

export default function Profile() {
  const {
    nome, setNome, data_nasc, tipoSang, setTipoSang, alergia, setAlergia,
    medicacao, setMedicacao, nomeCont, numContato, setContato
  } = useContext(InformationsContext);

  // Estados para controlar o modal
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldBeingEdited, setFieldBeingEdited] = useState('');
  const [newValue, setNewValue] = useState('');

  // Função para abrir o modal de edição
  const handleEditField = (fieldName, currentValue) => {
    setFieldBeingEdited(fieldName);
    setNewValue(currentValue || '');
    setModalVisible(true);
  };

  // Função para salvar as alterações
  const handleSaveField = () => {
    // Aqui você implementaria a lógica para salvar cada campo
    switch(fieldBeingEdited) {
      case 'Medicação':
        // Atualizar medicação no contexto
        setMedicacao(newValue)
        console.log('Salvando medicação:', newValue);
        break;
      case 'Nome':
        // Atualizar nome no contexto
        setNome(newValue)
        console.log('Salvando nome:', newValue);
        break;
      case 'Tipo Sanguíneo':
        // Atualizar tipo sanguíneo no contexto
        setTipoSang(newValue)
        console.log('Salvando tipo sanguíneo:', newValue);
        break;
      case 'Alergias':
        // Atualizar alergias no contexto
        setAlergia(newValue);
        console.log('Salvando alergias:', newValue);
        break;
      default:
        break;
    }
    
    // Fechar modal
    setModalVisible(false);
    setFieldBeingEdited('');
    setNewValue('');
    
    Alert.alert('Sucesso', `${fieldBeingEdited} atualizado com sucesso!`);
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setModalVisible(false);
    setFieldBeingEdited('');
    setNewValue('');
  };

  return (
    <Container>
      <View style={styles.container}>
        
        <View style={styles.itens}>
          <Button 
            title="Nome" 
            descricao={nome}
            onPress={() => handleEditField('Nome', nome)}
          />
          <Button 
            title="Idade" 
            descricao={2025-data_nasc}
            onPress={() => handleEditField('Idade', data_nasc)}
          />
        </View>

        <View style={styles.itens}>
          <Button 
            title="Tipo Sanguíneo" 
            descricao={tipoSang}
            onPress={() => handleEditField('Tipo Sanguíneo', tipoSang)}
          />  
          <Button 
            title="Alérgica a" 
            descricao={alergia}
            onPress={() => handleEditField('Alergias', alergia)}
          />
        </View>

        <View style={styles.itens}>
          <Button 
            title="Medicação" 
            descricao={medicacao}
            onPress={() => handleEditField('Medicação', medicacao)}
          />  
          <Button 
            title="Contato cadastrado" 
            descricao={nomeCont}
            tipo="contato"
            onContatoAlterado={(nome, telefone) => {
              setContato(nome, telefone);
            }}
          />
        </View> 

        <Button 
          title="Número do Contato" 
          descricao={numContato} 
          tipo="contato"
          onContatoAlterado={(nome, telefone) => {
            setContato(nome, telefone);
          }}
        />

        {/* Modal para edição de campos */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Editar {fieldBeingEdited}
              </Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder={`Digite o novo ${fieldBeingEdited.toLowerCase()}`}
                value={newValue}
                onChangeText={setNewValue}
                multiline={fieldBeingEdited === 'Medicação' || fieldBeingEdited === 'Alergias'}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]} 
                  onPress={handleSaveField}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      
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
  },
  containerModal: {
    flex: 1,
    padding: 20,
  },
  itensModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 40,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333',
  },
  saveButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});