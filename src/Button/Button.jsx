import { useState } from "react";
import { Image, TouchableOpacity, Text, TextInput, View } from "react-native";

export default function Button(props){
    const [edit, setEdite] = useState('');
    console.log(props)
    return(
        <TouchableOpacity>
            <View>
                <Text disabled={true}>{props.title}:</Text>
                <TextInput onChange={edit => setEdite(edit) }>{props.descricao}</TextInput>
            </View>
            {/* <Image source={"noOne"} alt="aqui vem um icone"/> */}
        </TouchableOpacity>
    )
}