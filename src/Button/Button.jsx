import { Image, TouchableOpacity, Text, View, StyleSheet, SafeAreaView, Alert, Modal, FlatList, TextInput} from "react-native";
import { useState, useContext } from "react";
import editImage from "../../assets/edit.png";
import { Colors, Fonts } from "../context/personalizacoes";
import { useNavigation } from "@react-navigation/native";
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsContext } from '../context/settingsContext';

export default function Button(props){
    const nav = useNavigation();
    const { darkMode, tamFont } = useContext(SettingsContext);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState('');

    // Função para buscar todos os contatos
    const buscarTodosContatos = async () => {
        try {
            setLoading(true);
            console.log("Buscando todos os contatos...");
            
            const { status } = await Contacts.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar seus contatos.');
                return;
            }

            const { data } = await Contacts.getContactsAsync({
                fields: [
                    Contacts.Fields.Name,
                    Contacts.Fields.PhoneNumbers,
                ],
                sort: Contacts.SortTypes.FirstName,
            });

            console.log(`Encontrados ${data.length} contatos`);

            // Filtra apenas contatos que têm número de telefone
            const contatosComTelefone = data
                .filter(contato => contato.phoneNumbers && contato.phoneNumbers.length > 0)
                .map(contato => ({
                    id: contato.id,
                    nome: contato.name || 'Sem nome',
                    telefone: contato.phoneNumbers[0].number,
                    telefoneFormatado: contato.phoneNumbers[0].number,
                    telefoneLimpo: contato.phoneNumbers[0].number.replace(/\D/g, ''),
                }))
                .sort((a, b) => a.nome.localeCompare(b.nome));

            console.log(`${contatosComTelefone.length} contatos com telefone encontrados`);
            setContatos(contatosComTelefone);
            setModalVisible(true);

        } catch (error) {
            console.error("Erro ao buscar contatos:", error);
            Alert.alert(
                'Erro', 
                'Erro ao buscar contatos. Verifique as permissões.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Tentar Novamente', onPress: () => buscarTodosContatos() }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    // Função para selecionar um contato
    const selecionarContato = async (contato) => {
        try {
            console.log("Contato selecionado:", contato);
            
            // Salva o contato no AsyncStorage
            await AsyncStorage.setItem('contatoEmergencia', contato.telefoneLimpo);
            await AsyncStorage.setItem('nomeContatoEmergencia', contato.nome);
            
            // Fecha o modal
            setModalVisible(false);
            setBusca('');
            
            // Mostra confirmação
            Alert.alert(
                'Contato Atualizado!', 
                `${contato.nome} foi definido como seu contato de emergência.`,
                [{ text: 'OK' }]
            );
            
            // Atualiza a descrição do componente se necessário
            if (props.onContatoAlterado) {
                props.onContatoAlterado(contato.nome, contato.telefoneLimpo);
            }
            
        } catch (error) {
            console.error("Erro ao salvar contato:", error);
            Alert.alert('Erro', 'Erro ao salvar o contato selecionado.');
        }
    };

    // Função para filtrar contatos pela busca
    const contatosFiltrados = contatos.filter(contato =>
        contato.nome.toLowerCase().includes(busca.toLowerCase()) ||
        contato.telefone.includes(busca)
    );

    // Função principal para alterar contato
    const alterarContato = async () => {
        if (loading) return;
        
        Alert.alert(
            'Alterar Contato de Emergência',
            'Escolha uma opção:',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Buscar nos Contatos', onPress: buscarTodosContatos },
                { text: 'Digitar Manualmente', onPress: () => digitarContato() }
            ]
        );
    };

    // Função para digitar contato manualmente
    const digitarContato = () => {
        Alert.prompt(
            'Contato de Emergência',
            'Digite o nome do contato:',
            (nome) => {
                if (nome && nome.trim()) {
                    Alert.prompt(
                        'Contato de Emergência',
                        'Digite o número do telefone (apenas números):',
                        (telefone) => {
                            if (telefone && telefone.trim()) {
                                const telefoneLimpo = telefone.replace(/\D/g, '');
                                if (telefoneLimpo.length >= 10) {
                                    selecionarContato({
                                        nome: nome.trim(),
                                        telefoneLimpo: telefoneLimpo,
                                        telefone: telefone
                                    });
                                } else {
                                    Alert.alert('Erro', 'Número de telefone deve ter pelo menos 10 dígitos.');
                                }
                            }
                        },
                        'plain-text',
                        '',
                        'numeric'
                    );
                }
            },
            'plain-text'
        );
    };

    // NOVA FUNÇÃO: Lidar com clique do botão baseado no tipo
    const handleButtonPress = () => {
        // Se props.onPress foi passado, usa ele (comportamento customizado)
        if (props.onPress) {
            props.onPress();
        }
        // Se props.tipo for 'contato', executa a lógica de contato
        else if (props.tipo === 'contato') {
            alterarContato();
        }
        // Caso contrário, pode mostrar um alerta ou navegar para edição
        else {
            Alert.alert(
                'Editar ' + props.title,
                'Funcionalidade de edição para ' + props.title + ' será implementada em breve.',
                [{ text: 'OK' }]
            );
        }
    };

    // Renderiza item da lista de contatos
    const renderContato = ({ item }) => (
        <TouchableOpacity
            style={[styles.contatoItem, darkMode && styles.contatoItemDark]}
            onPress={() => selecionarContato(item)}
        >
            <View style={styles.contatoInfo}>
                <Text style={[
                    styles.contatoNome, 
                    darkMode && styles.contatoNomeDark,
                    { fontSize: tamFont || 16 }
                ]}>
                    {item.nome}
                </Text>
                <Text style={[
                    styles.contatoTelefone, 
                    darkMode && styles.contatoTelefoneDark,
                    { fontSize: (tamFont || 16) - 2 }
                ]}>
                    {item.telefoneFormatado}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return(
        <>
            <SafeAreaView style={[styles.viewBtn, darkMode && styles.viewBtnDark]}>
                <View style={styles.containerText}>
                    <Text style={[
                        styles.textTitle, 
                        darkMode && styles.textTitleDark,
                        { fontSize: tamFont || 16 }
                    ]}>
                        {props.title}:
                    </Text>
                    <Text style={[
                        styles.textSubtitle, 
                        darkMode && styles.textSubtitleDark,
                        { fontSize: (tamFont || 16) - 2 }
                    ]}>
                        {props.descricao}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={[styles.button, darkMode && styles.buttonDark]} 
                    onPress={handleButtonPress} // MUDANÇA AQUI
                    disabled={loading}
                >
                    <Image 
                        style={[styles.img, loading && styles.imgDisabled]} 
                        source={editImage} 
                        alt="icone de editar"
                    />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Modal de Seleção de Contatos */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setBusca('');
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, darkMode && styles.modalContentDark]}>
                        <View style={styles.modalHeader}>
                            <Text style={[
                                styles.modalTitle, 
                                darkMode && styles.modalTitleDark,
                                { fontSize: (tamFont || 16) + 2 }
                            ]}>
                                Selecionar Contato
                            </Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    setBusca('');
                                }}
                            >
                                <Text style={[styles.closeButtonText, { fontSize: tamFont || 16 }]}>
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={[
                                styles.searchInput, 
                                darkMode && styles.searchInputDark,
                                { fontSize: tamFont || 16 }
                            ]}
                            placeholder="Buscar contato..."
                            placeholderTextColor={darkMode ? "#aaa" : "#666"}
                            value={busca}
                            onChangeText={setBusca}
                        />

                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <Text style={[
                                    styles.loadingText, 
                                    darkMode && styles.loadingTextDark,
                                    { fontSize: tamFont || 16 }
                                ]}>
                                    Carregando contatos...
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={contatosFiltrados}
                                renderItem={renderContato}
                                keyExtractor={(item) => item.id || item.telefoneLimpo}
                                style={styles.contatosList}
                                showsVerticalScrollIndicator={true}
                                ListEmptyComponent={
                                    <Text style={[
                                        styles.emptyText, 
                                        darkMode && styles.emptyTextDark,
                                        { fontSize: tamFont || 16 }
                                    ]}>
                                        {busca ? 'Nenhum contato encontrado' : 'Nenhum contato disponível'}
                                    </Text>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    viewBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: Colors.menu3,
        borderRadius: 15,
        margin: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    viewBtnDark: {
        backgroundColor: '#333',
    },
    containerText: {
        flex: 1, 
        flexDirection: "column",
        alignItems: "flex-start", 
        gap: 5,
        marginLeft: 15,
    },
    textTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000"
    },
    textTitleDark: {
        color: Colors.light,
    },
    textSubtitle: {
        fontSize: 14,
        color: "#666"
    },
    textSubtitleDark: {
        color: "#ccc",
    },
    button: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.green,
        borderRadius: 25,
    },
    buttonDark: {
        backgroundColor: Colors.green,
    },
    img: {
        width: 24,
        height: 24,
        resizeMode: "contain",
        tintColor: '#fff',
    },
    imgDisabled: {
        opacity: 0.5,
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
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
    },
    modalContentDark: {
        backgroundColor: '#2a2a2a',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    modalTitleDark: {
        color: Colors.light,
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 20,
        color: '#666',
        fontWeight: 'bold',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    searchInputDark: {
        borderColor: '#555',
        backgroundColor: '#333',
        color: Colors.light,
    },
    contatosList: {
        maxHeight: 400,
    },
    contatoItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contatoItemDark: {
        borderBottomColor: '#444',
    },
    contatoInfo: {
        flex: 1,
    },
    contatoNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    contatoNomeDark: {
        color: Colors.light,
    },
    contatoTelefone: {
        fontSize: 14,
        color: '#666',
    },
    contatoTelefoneDark: {
        color: '#ccc',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    loadingTextDark: {
        color: '#ccc',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        padding: 20,
    },
    emptyTextDark: {
        color: '#ccc',
    },
});