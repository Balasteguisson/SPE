function prescripcion({enfPrin, edad, peso, sexo, emb, lact, tratAct, enfPrev, varMed, aler, medAct}) {
    
    let medicamentoRecomendado

    //base de hechos
    let enfermedadPrincipal = enfPrin;
    let embarazo = emb;
    let lactancia = lact;
    let tratamientosActuales = tratAct;
    let enfermedadesPrevias = enfPrev;
    let variablesMedicas = varMed;
    let alergias = aler;
    

    //base de conocimientos
    // en primer lugar se emplea el campo enfermedad principal para saber sobre que tipo de tratamiento se va a tratar
    // luego se busca entre los tratamientos del paciente el que coincida con uno de los principios activos que pueden tratar esta enfermedad
    
    // let princActivos = {
    //     1:
    // }

    let reglaEsquema = {
        Diabetes: 1,
        RV: 2,
        ACOs: 3
    }
    //motor de inferencia











    return medicamentoRecomendado
}


////////////////////////////////////////////////////////
//////////////////BASE DE CONOCIMIENTO//////////////////
////////////////////////////////////////////////////////


//Reglas diabetes

//Toma de decision con METFORMINA







module.exports = {
    "prescripcion": prescripcion
}