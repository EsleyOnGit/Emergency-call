import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native"

const Setting = () => {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => {
    setIsOn(previous => !previous);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Modo escuro</Text>
        <Button style={styles.btn} title="Toggle Modo" onPress={toggle} />
        <Text style={styles.text}>Ativar modo mensagem</Text>
        <Button style={styles.btn} title="Toggle Modo" onPress={toggle} />
        <Text style={styles.text}>Tamanho de Fonte</Text>
        <Button style={styles.btn} title="Toggle Modo" onPress={toggle} />
        <Text style={styles.text}>Habilitar narrador</Text>
        <Button style={styles.btn} title="Toggle Modo" onPress={toggle} />
        
    </View>
    
  )
}

export default Setting;
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  text: {
    fontSize: 18, marginBottom: 20,
  },
  btn:{
    flex: .5,
    color: "#fff",
    backgroundColor: "#222",
    borderRadius: 15
  }
});