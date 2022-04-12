function prescripcion({enfPrin, edad, peso, sexo, emb, lact, tratAct, enfPrev, varMed}) {
    
    let medicamentoRecomendado

    //base de hechos
    let enfermedadPrincipal = enfPrin;
    let embarazo = emb;
    let lactancia = lact;
    let tratamientosActuales = tratAct;
    let enfermedadesPrevias = enfPrev;
    let variablesMedicas = varMed;

    //imprime en consola todas las variables
    console.log("enfermedadPrincipal: " + enfermedadPrincipal);
    console.log("edad: " + edad);
    console.log("sexo: " + sexo);
    console.log("embarazo: " + embarazo);
    console.log("lactancia: " + lactancia);
    console.log("tratamientosActuales: " + tratamientosActuales);
    console.log("enfermedadesPrevias: " + enfermedadesPrevias);
    console.log("variablesMedicas: " + variablesMedicas);
    console.log("peso: " + peso);










    return medicamentoRecomendado
}


//Reglas diabetes






module.exports = {
    "prescripcion": prescripcion
}