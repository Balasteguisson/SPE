function prescripcion({enfPrin, edad, peso, sexo, emb, lact, tratAct, enfPrev, varMed, aler}) {
    
    let medicamentoRecomendado

    //base de hechos
    let enfermedadPrincipal = enfPrin;
    let embarazo = emb;
    let lactancia = lact;
    let tratamientosActuales = tratAct;
    let enfermedadesPrevias = enfPrev;
    let variablesMedicas = varMed;
    let alergias = aler;
    

    console.log(tratamientosActuales);

    //base de conocimientos



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