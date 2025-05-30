import { useState, createContext } from "react";

const InformationsContext = createContext({});

const InformationProvider = (props) =>{
    const [nome, setNome] = useState('');
    const [numContato, setNumContato] = useState('');
    const [nomeCont, setNomeCont] = useState('');
    const [data_nasc, setData_nasc] = useState('');
    const [tipoSang, setTipoSang] = useState('');
    const [alergia, setAlergia] = useState('');
    const [medicacao, setMedicacao] = useState('');

    return(
        <InformationsContext.Provider value={{
            nome, setNome,
            numContato, setNumContato,
            nomeCont, setNomeCont,
            data_nasc, setData_nasc,
            tipoSang, setTipoSang,
            alergia, setAlergia,
            medicacao, setMedicacao
        }}>
            {props.children}
    </InformationsContext.Provider>
    )
}

export { InformationsContext };
export default InformationProvider;