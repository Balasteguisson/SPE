//Cliente del enfermero
document.getElementById('user').value = ''; //Se inician los campos en vacio
document.getElementById('password').value = '' 


//Parametros de estado del cliente
let pantallaActual = 'login';


//FUNCIONES MAS REUSABLES
//funcion para evitar anidar FETCH y hacer codigo spaguetti
const peticionREST = async (url,parametros) => {
    // console.log('peticion enviada')
    const respuesta = await fetch(url,parametros);
    if (respuesta.ok){
        const data = await respuesta.json();
        // console.log('respuesta recibida y emitida')
        return data;
    }
    // console.log('lanzando error');
    return respuesta.status;
}

//permite obtener la fecha simplemente llamando a la funcion fecha()
const fecha = () => {
    let fecha = new Date();
    let fechaFormato = fecha.toISOString().substring(0,10);
    return fechaFormato;
}

function cambiarPantalla(destino){
    document.getElementById(pantallaActual).classList.remove('visible');
    document.getElementById(destino).classList.add('visible');
    pantallaActual = destino;
}



//Funciones de pantalla
function logout(){
    cambiarPantalla('login');
    //se vacian todos los campos rellenados al hacer log
    document.getElementById('bienvenida').innerHTML='';
    document.getElementById('bienvenidaEleccion').innerHTML='';
    document.getElementById('bienvenidaAdmin').innerHTML='';
    document.getElementById('user').value='';
    document.getElementById('password').value='';
}
async function log() {
    let datosLog = {
        login: document.getElementById('user').value,
        password: document.getElementById('password').value
    }
    let url = '/api/enfermero/login';
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datosLog),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const dataLog = await peticionREST(url, peticion)
    let urlGet = `/api/enfermero/${dataLog.id}`;
    let peticionGet = { method: 'GET' };
    const datosUser = await peticionREST(urlGet, peticionGet); //DATOS DEL ENFERMERO
    
    //A partir de aqui puede tomar 3 caminos, si el rol es enfermero, carga la pantalla
    // de enfermero, si es admin, la pantalla de admin, si es ambos, le lleva a la de
    // enfermero, pero habilita un boton para acceder a la admin.

    //Si es enfermero
    if(dataLog.permisos == 'enfermero'){
        //Actualizar pantalla de enfermero
        let mensajeBienvenida = document.createTextNode( `Bienvenido enfermero ${datosUser.Nombre}`);
        document.getElementById('bienvenida').appendChild(mensajeBienvenida)
        cambiarPantalla('menuEnfermero');
        let citas = await getCitas(datosUser.DNI); //aqui tengo las citas del enfermero
        let resultados = await getResultados(datosUser.DNI); //aqui tengo los resultados de sus test actuales
        console.log(citas);
        console.log(resultados);
    }else if(dataLog.permisos == 'administrador'){
        let mensajeBienvenida = document.createTextNode(`Bienvenido administrador ${datosUser.Nombre}`);
        document.getElementById('bienvenidaAdmin').appendChild(mensajeBienvenida);
        cambiarPantalla('menuAdmin');
    }else if(dataLog.permisos == 'ambos'){
        //Actualizar pantalla de enfermero
        let mensajeBienvenida = document.createTextNode( `Bienvenido ${datosUser.Nombre}`);
        document.getElementById('bienvenidaEleccion').appendChild(mensajeBienvenida);
        cambiarPantalla('menuEleccion');
    }
}

//Ahora necesito mostrar las citas, los datos de los test

//funcion para obtener citas
function getCitas(dni) {
    let url = `/api/enfermero/${dni}/citas`;
    let peticionGet = { method: 'GET' };
    let citas = peticionREST(url,peticionGet);
    return citas;
}

//funcion para obtener los resultados de los test
function getResultados(dni) {
    let url = `/api/enfermero/${dni}/resultados`;
    let peticionGet = { method: 'GET'};
    let resultados = peticionREST(url, peticionGet);
    return resultados;
}


//FUNCIONES ADMIN
async function guardarPregunta() {
    // falta crear algo que indique la fecha
    let datosPregunta = {
        tipo: document.getElementById('tipoPregunta').value,
        pregunta: document.getElementById('enunciado').value,
        fechaCreacion: fecha(),
        respuesta1: document.getElementById('respuesta1').value,
        respuesta2: document.getElementById('respuesta2').value,
        respuesta3: document.getElementById('respuesta3').value,
        respuesta4: document.getElementById('respuesta4').value,
        respuestaCorrecta: document.getElementById('respuestaCorrecta').value
    }
    //console.log(JSON.stringify(datosPregunta));
    let url = '/api/enfermero/:id/addPregunta';
    let petPost = {
        method: 'POST',
        body: JSON.stringify(datosPregunta),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const respuesta = await peticionREST(url,petPost);
    if(respuesta == 400){
        alert('Datos mal introducidos, revisalos'); //por favor estoy hay que hacerlo menos invasivo !!!
    }else if(respuesta == 502){
        alert('La base de datos arroja un error');
    }else{
        alert('Pregunta creada con éxito');
        
    }
}

//RELLENAR BANCO PREGUNTAS

async function fillBanco(){ //RELLENAR BANCO DE PREGUNTAS
    cambiarPantalla("menuBancoPreguntas");
    let url = "/api/admin/:id/getPreguntas";
    let peticionGet = { method: 'GET' };
    let preguntas = await peticionREST(url, peticionGet);
    let tabla = document.getElementById('cuerpoListadoPreguntas');
    tabla.innerHTML = '';
    let avisos = document.getElementById('avisosBanco');
    avisos.innerHTML = ''
    if(preguntas.length == 0){
        avisos.innerHTML = 'No hay preguntas';
        return;
    }
    for (let a = 0; a < preguntas.length; a++) {
        tabla.innerHTML += `<tr><td>${preguntas[a].IDPregunta}</td><td>${preguntas[a].Tipo}</td><td>${preguntas[a].Pregunta}</td><td><button onclick = "pantallaEditarPregunta(${preguntas[a].IDPregunta})">Editar</button></td><td><button onclick = "borrarPregunta(${preguntas[a].IDPregunta})">Eliminar</button></td></tr>`;
    }
}

async function pantallaEditarPregunta(IDPregunta){
    cambiarPantalla('menuEditarPregunta')
    let url = `/api/admin/:id/getPregunta/${IDPregunta}`;
    let peticionGet = { method: 'GET' };
    let pregunta = await peticionREST(url, peticionGet);
    let ID = pregunta[0].IDPregunta;
    let tipo = pregunta[0].Tipo;
    let enunciado = pregunta[0].Pregunta;
    let resp1 = pregunta[0].Respuesta1;
    let resp2 = pregunta[0].Respuesta2;
    let resp3 = pregunta[0].Respuesta3;
    let resp4 = pregunta[0].Respuesta4;
    let respC = pregunta[0].RespuestaCorrecta;

    document.getElementById('tipoPreguntaE').value=`${tipo}`;
    document.getElementById('enunciadoE').value = enunciado;
    document.getElementById('respuesta1E').value = resp1;
    document.getElementById('respuesta2E').value = resp2;
    document.getElementById('respuesta3E').value = resp3;
    document.getElementById('respuesta4E').value = resp4;
    document.getElementById('respuestaCorrectaE').value = `${respC}`;

    let botonEditar = document.getElementById('botonEditar');
    botonEditar.setAttribute('onclick',`editarPregunta(${ID})`);
}

async function editarPregunta(IDPregunta){ //EDITAR PREGUNTA
    console.log(IDPregunta);
    let datosPreguntaE = {
        IDPregunta: IDPregunta,
        tipo: document.getElementById('tipoPreguntaE').value,
        pregunta: document.getElementById('enunciadoE').value,
        fechaCreacion: fecha(),
        respuesta1: document.getElementById('respuesta1E').value,
        respuesta2: document.getElementById('respuesta2E').value,
        respuesta3: document.getElementById('respuesta3E').value,
        respuesta4: document.getElementById('respuesta4E').value,
        respuestaCorrecta: document.getElementById('respuestaCorrectaE').value
    }
    console.log(datosPreguntaE);
    let url = `/api/admin/:id/editPregunta/${IDPregunta}`;
    let petPut = { method: 'PUT', 
        body: JSON.stringify(datosPreguntaE),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url, petPut);
    alert(respuesta);
}

async function borrarPregunta(IDPregunta){ //BORRAR PREGUNTA
    console.log(IDPregunta);
    let url = `/api/admin/:id/deletePregunta/${IDPregunta}`;
    let petDelete = { 
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
        }
    };
    let respuesta = await peticionREST(url, petDelete)
    fillBanco();
}

//FUNCIONES PARA CREAR TEST
function verMenuTest(){
    document.getElementById('tipoTest').value='prueba';
    document.getElementById('cuerpoSurtidorPreguntas').innerHTML = '';
    document.getElementById('cuerpoDepositoPreguntas').innerHTML = '';
    cambiarPantalla('menuCrearTest');
}
//Escoger modalidad de preguntas y rellenar surtidor preguntas
async function fillSurtidor(){
    let modalidad = document.getElementById('tipoTest').value;
    let surtidor = document.getElementById('cuerpoSurtidorPreguntas');
    let deposito = document.getElementById('cuerpoDepositoPreguntas');
    surtidor.innerHTML = '';
    deposito.innerHTML = '';
    let url = `/api/admin/:id/getPreguntas/${modalidad}`;
    let petGet = { 
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
        }
    }
    let preguntas = await peticionREST(url,petGet);
    console.log(preguntas);
    for (let a = 0; a < preguntas.length; a++) {
        surtidor.innerHTML += `<tr onclick="moverPregunta(${preguntas[a].IDPregunta})" id= 'SROW${preguntas[a].IDPregunta}'><td>${preguntas[a].IDPregunta}</td><td>${preguntas[a].Pregunta}</td></tr>`;
    }
}

//permite meter las preguntas al test o sacarlas
function moverPregunta(IDtr){
    let surtidor = document.getElementById('cuerpoSurtidorPreguntas');
    let deposito = document.getElementById('cuerpoDepositoPreguntas');
    let fila = document.getElementById(`SROW${IDtr}`);
    if(fila.parentElement.id == 'cuerpoSurtidorPreguntas'){
        surtidor.removeChild(fila);
        deposito.innerHTML+=`<tr onclick ="moverPregunta(${IDtr})" id='SROW${IDtr}'>${fila.innerHTML}</tr>`
    }else if(fila.parentElement.id == 'cuerpoDepositoPreguntas'){
        deposito.removeChild(fila);
        surtidor.innerHTML+=`<tr onclick ="moverPregunta(${IDtr})" id='SROW${IDtr}'>${fila.innerHTML}</tr>`
    }
}

//funcion para crear test con las preguntas del deposito
async function crearTest(){
    console.log('Creando test')
    let deposito = document.getElementById('cuerpoDepositoPreguntas');
    let modalidad = document.getElementById('tipoTest').value;
    let filas = deposito.childNodes;
    let idsPreguntas = [];
    fechaCreacion = fecha();
    for (let a = 0; a < filas.length; a++) {
        let fila = filas[a].id;
        idsPreguntas.push(parseInt(fila.slice(4)));
    }
    
    let urlPost = '/api/admin/:id/crearTest'
    let urlGet = '/api/admin/:id/getIdTest'

    let petGet = {
        method : 'GET'
    }

    let IDTest = await peticionREST(urlGet,petGet);
    let datosTest = {
        idTest : IDTest,
        tipo : modalidad,
        fechaCreacion : fechaCreacion,
    }
    let petPost = {
        method: 'POST',
        body: JSON.stringify(datosTest),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let idTestCreado = await peticionREST(urlPost, petPost);
    console.log(idTestCreado);

    let urlPost2 = "/api/admin/:id/addPreguntas"
    let relaciones = {
        IDTest: idTestCreado,
        preguntas : idsPreguntas
    }
    let petPost2 = {
        method: 'POST',
        body : JSON.stringify(relaciones),
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let crearRelaciones = await peticionREST(urlPost2, petPost2);
    console.log(crearRelaciones);
}



//RELLENAR MONITOR RENDIMIENTO
//Insertar ciclos en el select
async function insertCiclos(){

}
//Obtener ciclo seleccionado
const getCicloSeleccionado = () => {
    let selector = document.getElementById('cicloTest');
    let ciclo = selector.value; 
}
function debugg(paso) {
    console.log(`Paso realizado ${paso}`);
}

