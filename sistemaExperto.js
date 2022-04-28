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
    // y así se conoce el tratamiento que está usando el paciente, recetado por el médico
    
    // let princActivos = {
    //     1:
    // }

    let regla1 = {
        Diabetes: 1,
        RV: 2,
        ACOs: 3
    }

    let regla2 = {
        1: ["metformina", "glicazida", "glipizida", "glimepirida", "insulina"],
        2: ["simvastatina", "enalapril", "ramipril", "clortalidona", "tiazida", "amlodipino"],
        3: ["acenocumarol", "warfarina"]
    }

    let principiosActivos = regla2[regla1[enfermedadPrincipal]]; //estos son los posibles principios activos que puede usar el paciente para su enfermedad
    console.log(principiosActivos);

    //motor de inferencia











    return medicamentoRecomendado
}


////////////////////////////////////////////////////////
//////////////////BASE DE CONOCIMIENTO//////////////////
////////////////////////////////////////////////////////








module.exports = {
    "prescripcion": prescripcion
}