import{ useState } from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

export default function Modal() {

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Abrir Modal" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)} // Android: botão voltar
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Dados alterados com sucesso!</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

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