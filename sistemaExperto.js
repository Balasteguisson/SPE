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

    //imprime en consola todas las variables
    console.log(variablesMedicas);










    return medicamentoRecomendado
}


//Reglas diabetes






module.exports = {
    "prescripcion": prescripcion
}