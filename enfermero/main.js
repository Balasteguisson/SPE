
//Cliente del enfermero
document.getElementById('user').value = ''; //Se inician los campos en vacio
document.getElementById('password').value = ''

//Parametros de estado del cliente
let pantallaActual = 'login';
let crendenciales;

//clases para mover informacion
class Medicamento {
    constructor({ nombre, prAct1, formFarm, dosis, fotoCaja, fotoForma, viaAdmin , nRegistro, fichaTecnica}) {
        this.nombre = nombre
        this.prAct1 = prAct1
        this.formFarm = formFarm
        this.dosis = dosis
        this.fotoCaja = fotoCaja
        this.fotoForma = fotoForma
        this.viaAdmin = viaAdmin
        this.nRegistro = nRegistro
        this.fichaTecnica = fichaTecnica
    }
    incomplete() {
        //si algun campo necesario esta vacio devuelve true
        return !(this.nombre && this.prAct1 && this.formFarm && this.dosis && this.fotoCaja && this.fotoForma && this.viaAdmin)
    }

    //crear getters para la clase
    get nombre() {
        return this._nombre
    }
    get prAct1() {
        return this._prAct1
    }
    get formFarm() {
        return this._formFarm
    }
    get dosis() {
        return this._dosis
    }
    get fotoCaja() {
        return this._fotoCaja
    }
    get fotoForma() {
        return this._fotoForma
    }
    get viaAdmin() {
        return this._viaAdmin
    }
    get nRegistro() {
        return this._nRegistro
    }
    get fichaTecnica() {
        return this._fichaTecnica
    }
    //crear setter para la clase
    set nombre(nombre) {
        this._nombre = nombre
    }
    set prAct1(prAct1) {
        this._prAct1 = prAct1
    }
    set formFarm(formFarm) {
        this._formFarm = formFarm
    }
    set dosis(dosis) {
        this._dosis = dosis
    }
    set fotoCaja(fotoCaja) {
        this._fotoCaja = fotoCaja
    }
    set fotoForma(fotoForma) {
        this._fotoForma = fotoForma
    }
    set viaAdmin(viaAdmin) {
        this._viaAdmin = viaAdmin
    }
    set nRegistro(nRegistro) {
        this._nRegistro = nRegistro
    }
    set fichaTecnica(fichaTecnica) {
        this._fichaTecnica = fichaTecnica
    }

}


//FUNCIONES MAS REUSABLES
//funcion para evitar anidar FETCH y hacer codigo spaguetti
const peticionREST = async (url,parametros) => {
    const respuesta = await fetch(url,parametros);
    if (respuesta.ok){
        const data = await respuesta.json();
        return data;
    }
    return respuesta.status;
}

//permite obtener la fecha simplemente llamando a la funcion fecha()
function fecha(){
    let today = new Date();
    // let fechaFormato = fecha.toLocaleDateString().substring(0, 10);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function cambiarPantalla(destino){
    let secciones = document.getElementsByClassName('seccion');
    for (let i = 0; i < secciones.length; i++) { 
        if (secciones[i].id == destino) { 
            secciones[i].classList.add('visible');
            secciones[i].classList.remove('oculto');
        } else {
            secciones[i].classList.add('oculto');
            secciones[i].classList.remove('visible');
        }
    }
    // document.getElementById(pantallaActual).classList.remove('visible');
    // document.getElementById(destino).classList.add('visible');
    pantallaActual = destino;
}





//Funciones de pantalla
function logout(){
    cambiarPantalla('login');
    //se vacian todos los campos rellenados al hacer log
    document.getElementById('bienvenida').innerHTML='';
    document.getElementById('bienvenidaAdmin').innerHTML='';
    document.getElementById('user').value='';
    document.getElementById('password').value='';
}
async function log() {
    let datosLog = {
        login: document.getElementById('user').value,
        password: document.getElementById('password').value
    }
    let url = '/api/login';
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datosLog),
        headers: {
            'Content-Type': 'application/json'
        }
    };    
    try {
        const dataLog = await peticionREST(url, peticion)
        crendenciales = dataLog.token;
        let urlGet = `/api/enfermero/${dataLog.id}?token=${crendenciales}`;
        let peticionGet = { method: 'GET' };
        const datosUser = await peticionREST(urlGet, peticionGet); //DATOS DEL ENFERMERO

        
        //Si es enfermero
        if (dataLog.permisos == 'enfermero') {
            //Actualizar pantalla de enfermero
            let mensajeBienvenida = document.createTextNode(`Bienvenido enfermero ${datosUser.Nombre}`);
            document.getElementById('bienvenida').appendChild(mensajeBienvenida)
            verMenuEnfermeroHTML(datosUser.DNI)
        } else if (dataLog.permisos == 'administrador') {
            verMenuAdmin()
            document.getElementById('bienvenidaAdmin').innerHTML = `Bienvenido administrador ${datosUser.Nombre}`;
        }
    } catch (error) {
        console.log(error);
        document.getElementById("labelPassword").innerHTML = "Usuario o Contraseña incorrectos";
        document.getElementById("labelPassword").style.color = "red";
        setTimeout(() => {
            document.getElementById("labelPassword").innerHTML = "Contraseña: ";
            document.getElementById("labelPassword").style.color = "black";
        }, 3000)

        
    }
    
}
function verMenuAdmin() {
    cambiarPantalla('menuAdmin');
    document.getElementById('bienvenidaAdmin').innerHTML = "";
}



//FUNCIONES ADMIN
function pantallaCrearPregunta(){
    document.getElementById('tipoPregunta').value = "placeholderModalidad";
    document.getElementById('respuestaCorrecta').value = "placeholderRespuesta";
    document.getElementById('enunciado').value = "";
    document.getElementById('respuesta1').value = "";
    document.getElementById('respuesta2').value = "";
    document.getElementById('respuesta3').value = "";
    document.getElementById('respuesta4').value = "";
    cambiarPantalla('menuCrearPregunta');
}

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
    let url = `/api/enfermero/:id/addPregunta?token=${crendenciales}`;
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
    let url = `/api/admin/:id/getPreguntas?token=${crendenciales}`;
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
    let url = `/api/admin/:id/getPregunta/${IDPregunta}?token=${crendenciales}`;
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
    let url = `/api/admin/:id/deletePregunta/${IDPregunta}?token=${crendenciales}`;
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
function verMenuCrearTest(){
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
    let url = `/api/admin/:id/getPreguntas/${modalidad}?token=${crendenciales}`;
    let petGet = { 
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
        }
    }
    let preguntas = await peticionREST(url,petGet);
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
    let deposito = document.getElementById('cuerpoDepositoPreguntas');
    let modalidad = document.getElementById('tipoTest').value;
    let periodo = document.getElementById('periodoTestCreado').value;
    let annoCiclo = new Date();
    annoCiclo = (annoCiclo.getFullYear()).toString()
    periodo += `-${annoCiclo}`
    let filas = deposito.childNodes;
    let idsPreguntas = [];
    fechaCreacion = fecha();
    for (let a = 0; a < filas.length; a++) {
        let fila = filas[a].id;
        idsPreguntas.push(parseInt(fila.slice(4)));
    }
    
    let urlPost = `/api/admin/:id/crearTest?token=${crendenciales}`
    let urlGet = `/api/admin/:id/getIdTest?token=${crendenciales}`

    let petGet = {
        method : 'GET'
    }

    let IDTest = await peticionREST(urlGet,petGet);
    let datosTest = {
        idTest : IDTest,
        tipo : modalidad,
        fechaCreacion : fechaCreacion
    }
    let petPost = {
        method: 'POST',
        body: JSON.stringify(datosTest),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let idTestCreado = await peticionREST(urlPost, petPost);

    let urlPost2 = `/api/admin/:id/addPreguntas?token=${crendenciales}`
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
    alert(crearRelaciones)
}


//  ----------REGISTRO DE ENFERMERO----------
function pantallaRegistrarEnfermero(){
    document.getElementById('nombreEnfermero').value = "";
    document.getElementById('apellidosEnfermero').value = "";
    document.getElementById('dniEnfermero').value = "";
    document.getElementById('fechaNacimientoEnfermero').value = "";
    document.getElementById('emailEnfermero').value = "";
    cambiarPantalla('menuRegistrarEnfermero');
}
async function registrarEnfermero(){
    let datosEnfermero = {
        nombre : document.getElementById('nombreEnfermero').value,
        apellidos : document.getElementById('apellidosEnfermero').value,
        dni : document.getElementById('dniEnfermero').value,
        fechaNacimiento : document.getElementById('fechaNacimientoEnfermero').value,
        email : document.getElementById('emailEnfermero').value
    }
    let url = `/api/admin/:id/registrarEnfermero?token=${crendenciales}`;
    let petPost = {
        method : 'POST',
        body : JSON.stringify(datosEnfermero),
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let respuestaServidor = await peticionREST(url,petPost);
    console.log(respuestaServidor);
}
// LISTA DE ENFERMEROS
async function fillListaEnfermeros(){
    let url = `/api/admin/:id/getEnfermeros?token=${crendenciales}`
    let petGet = {
        method : "GET",
        headers: {
            'Content-Type':'application/json',
        } 
    }

    let enfermeros = await peticionREST(url, petGet)
    let listaEnfermeros = document.getElementById('cuerpoListaEnfermeros')
    listaEnfermeros.innerHTML = ""
    for(let a = 0; a < enfermeros.length; a++){
        let enfermero = enfermeros[a]
        listaEnfermeros.innerHTML += `<tr id="TR${enfermero.DNI}"><td>${enfermero.DNI}</td><td>${enfermero.Nombre}</td><td>${enfermero.Apellidos}</td><td><button type="button" onclick="verMenuEditarEnfermero('${enfermero.DNI}')">Editar</button></td><td><button type="button" onclick="borrarEnfermero('${enfermero.DNI}')">Borrar</button></td></tr>`;
    }
    cambiarPantalla("menuListaEnfermeros");

}

async function borrarEnfermero(dniEnfermero){
    let url = `/api/admin/:id/deleteEnfermero/${dniEnfermero}?token=${crendenciales}`
    let petDelete = {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let respuesta = await peticionREST(url, petDelete)
    if(respuesta.serverStatus === 2){
        let fila = document.getElementById(`TR${dniEnfermero}`)
        fila.parentElement.removeChild(fila)
    }else{
        console.log(respuesta)
    }
    
}

async function verMenuEditarEnfermero(dniEnfermero){
    document.getElementById('nombreEnfermeroE').value = "";
    document.getElementById('apellidosEnfermeroE').value = "";
    document.getElementById('dniEnfermeroE').value = "";
    document.getElementById('fechaNacimientoEnfermeroE').value = "";
    document.getElementById('emailEnfermeroE').value = "";
    document.getElementById('fotoEnfermeroE').value = "";
    let url = `/api/admin/:id/getEnfermero/${dniEnfermero}?token=${crendenciales}`
    let petGet ={
        method : "GET",
        headers: {
            'Content-Type':'application/json',
        } 
    }
    let datosEnfermero = await peticionREST(url, petGet);
    document.getElementById('botonEditarEnfermero').setAttribute('onclick',`editarEnfermero('${datosEnfermero[0].DNI}')`)
    document.getElementById('nombreEnfermeroE').value = datosEnfermero[0].Nombre
    document.getElementById('apellidosEnfermeroE').value = datosEnfermero[0].Apellidos
    document.getElementById('dniEnfermeroE').value = datosEnfermero[0].DNI
    let fecha = new Date(datosEnfermero[0].FechaNacimiento)
    let dia = fecha.getDay()+1; dia = dia.toString(); dia.length == 1 ? (dia = "0"+dia):(dia = dia)
    let mes = fecha.getMonth()+1; mes = mes.toString(); mes.length == 1 ? (mes = "0"+ mes): (mes = mes)
    let anno = fecha.getFullYear(); anno = anno.toString()
    fecha = `${anno}-${mes}-${dia}`
    document.getElementById('fechaNacimientoEnfermeroE').value = fecha;
    document.getElementById('emailEnfermeroE').value = datosEnfermero[0].EmailContacto
    document.getElementById('fotoEnfermeroE').value = datosEnfermero[0].IDFoto

    cambiarPantalla('menuEditarEnfermero');
}

async function editarEnfermero(dniEnfermero){
    let url = `/api/admin/:id/editarEnfermero/${dniEnfermero}?token=${crendenciales}`

    datosEnfermero = {
        nombre : document.getElementById('nombreEnfermeroE').value,
        apellidos : document.getElementById('apellidosEnfermeroE').value,
        dni : document.getElementById('dniEnfermeroE').value,
        idFoto : document.getElementById('fotoEnfermeroE').value,
        email : document.getElementById('emailEnfermeroE').value,
        fechaNacimiento : document.getElementById('fechaNacimientoEnfermeroE').value
    }

    let petPut = { 
        method: 'PUT', 
        body: JSON.stringify(datosEnfermero),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    await  peticionREST(url, petPut);
}



//      ----------REGISTRO DE PACIENTE Y EDICION DE PACIENTE----------
//      las funciones con una "E" al final son para editar al paciente
function verMenuRegistroPaciente(){
    //limpia formulario y lo muestra
    document.getElementById('embarazoDesde').disabled = true;
    document.getElementById('formularioRegistroPaciente').reset();
    document.getElementById('listaTratamientos').innerHTML = "";
    document.getElementById('listaPatologiasPrevias').innerHTML = "";
    document.getElementById('alergiasPaciente').innerHTML = "";
    document.getElementById('listaEmbarazos').innerHTML = "";
    metaListaEmbarazos.splice(0,metaListaEmbarazos.length)
    metaListaAlergias.splice(0,metaListaAlergias.length)
    metaListaPatologias.splice(0,metaListaPatologias.length)
    metaListaTratamientos.splice(0,metaListaTratamientos.length)
    cambiarPantalla('menuRegistrarPaciente');
    listaFarmacos.splice(0, listaFarmacos.length);
    fillListaFarmacos()
}

//ajusta las entradas de lactancia y embarazo segun sexo del paciente
let formSexoPaciente = document.getElementById('sexoPaciente');
formSexoPaciente.addEventListener('change',() => {
    
    let formEmbarazo = document.getElementById('formularioEmbarazo');
    if (formSexoPaciente.value == "M"){
        document.getElementById('embarazo').disabled = true;
        document.getElementById('embarazo').value = "NO";
        document.getElementById('inicioEmbarazo').disabled = true;
        document.getElementById('finEmbarazo').disabled = true;
        document.getElementById('botonAddEmbarazo').disabled = true;
        document.getElementById('lactancia').disabled = true;
        document.getElementById('lactancia').value = "NO";
    }else{
        document.getElementById('embarazo').disabled = false;
        document.getElementById('embarazo').value = "NO";
        document.getElementById('inicioEmbarazo').disabled = false;
        document.getElementById('finEmbarazo').disabled = false;
        document.getElementById('botonAddEmbarazo').disabled = false;
        document.getElementById('lactancia').disabled = false;
        document.getElementById('lactancia').value = "NO";
    }
})
//ALERGIAS
function addAlergia(){
    let alergeno = document.getElementById('alergenoPaciente').value;
    let listaAlergenos = document.getElementById('alergiasPaciente');
    listaAlergenos.innerHTML += `<li id="LI${alergeno}">${alergeno}<button type="button" onclick ="deleteAlergia('${alergeno}')">❌</li>`;
    document.getElementById('alergenoPaciente').value="";
}
function deleteAlergia(idFila){
    let lista = document.getElementById('alergiasPaciente');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
}
function addAlergiaE(){
    let alergeno = document.getElementById('alergenoPacienteE').value;
    let listaAlergenos = document.getElementById('alergiasPacienteE');
    listaAlergenos.innerHTML += `<li id="LI${alergeno}">${alergeno}<button type="button" onclick ="deleteAlergiaE('${alergeno}')">❌</li>`;
    document.getElementById('alergenoPacienteE').value="";
    var pushAlergia = [alergeno];
    metaListaAlergias.push(pushAlergia);
}
function deleteAlergiaE(idFila){
    let lista = document.getElementById('alergiasPacienteE');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);

    for(let a = 0; a<metaListaAlergias.length; a++){
        if(idFila == metaListaAlergias[a][1]){
            metaListaAlergias.splice(a,1)
            break;
        }
    }
}

function extraerAlergias(){ //permite extraer el contenido de la lista de alergias para el post hacia el server
    let listaInputAl = document.getElementById('alergiasPaciente');
    let alergias = listaInputAl.childNodes;
    let listaAlergias = [];
    for(let a = 0; a<alergias.length; a++){
        listaAlergias.push(alergias[a].childNodes[0].data);
    }
    return listaAlergias;
}
var metaListaAlergias = []
function extraerAlergiasE(){ //permite extraer el contenido de la lista de alergias para el post hacia el server
    let longitud = metaListaAlergias.length;
    let array = metaListaAlergias.splice(0,longitud);
    return array;
}
//DATOS TABLA PACIENTE
function extraerDatosTablaPaciente(){
    let nombre = document.getElementById('nombrePaciente').value;
    let apellidos = document.getElementById('apellidosPaciente').value;
    let identificador = document.getElementById('SIPPaciente').value;
    let fechaNacimiento = document.getElementById('fechaNacimientoPaciente').value;
    let sexo = document.getElementById('sexoPaciente').value;
    let peso = document.getElementById('pesoPaciente').value;
    let talla = document.getElementById('tallaPaciente').value;
    let datos = [nombre,apellidos,identificador,fechaNacimiento,sexo,peso,talla];
    return datos;
}
function extraerDatosTablaPacienteE(){
    let nombre = document.getElementById('nombrePacienteE').value;
    let apellidos = document.getElementById('apellidosPacienteE').value;
    let identificador = document.getElementById('IdPacienteE').value;
    let fechaNacimiento = document.getElementById('fechaNacimientoPacienteE').value;
    let sexo = document.getElementById('sexoPacienteE').value;
    let peso = document.getElementById('pesoPacienteE').value;
    let talla = document.getElementById('tallaPacienteE').value;
    let datos = [nombre,apellidos,identificador,fechaNacimiento,sexo,peso,talla];
    return datos;
}

//EMBARAZO
document.getElementById('embarazo').addEventListener('change', ()=>{
    let valor = document.getElementById('embarazo').value;
    if (valor == 'ACTIVO'){
        document.getElementById('embarazoDesde').disabled = false;
    }else if(valor == 'NOACTIVO'){
        document.getElementById('embarazoDesde').disabled = true;
    }
})
document.getElementById('embarazoE').addEventListener('change', ()=>{
    let valor = document.getElementById('embarazoE').value;
    if (valor == 'ACTIVO'){
        document.getElementById('embarazoDesdeE').disabled = false;
    }else if(valor == 'NOACTIVO'){
        document.getElementById('embarazoDesdeE').disabled = true;
    }
})
var metaListaEmbarazos = []
function addEmbarazo(){
    let activo = document.getElementById('embarazo').value;
    let listaEmbarazos = document.getElementById('listaEmbarazos');

    if (activo == "ACTIVO"){
        let embDesde = document.getElementById('embarazoDesde').value;
        fechaFin = "NULL";
        listaEmbarazos.innerHTML += `<li id="LI${embDesde}">${embDesde} ${activo} <button type="button" onclick ="deleteEmbarazo('${embDesde}')">❌</li>`;
        var pushTrat = [activo,embDesde,fechaFin];
    }else{
        let fechaInicio = document.getElementById('inicioEmbarazo').value;
        let fechaFin = document.getElementById('finEmbarazo').value;
        listaEmbarazos.innerHTML += `<li id="LI${fechaInicio}">${fechaInicio} a ${fechaFin}<button type="button" onclick ="deleteEmbarazo('${fechaInicio}')">❌</li>`;
        var pushTrat = [activo,fechaInicio,fechaFin];
    }
    metaListaEmbarazos.push(pushTrat)
    document.getElementById('embarazoDesde').value="";
    document.getElementById('inicioEmbarazo').value="";
    document.getElementById('finEmbarazo').value="";
}
function deleteEmbarazo(idFila){
    let lista = document.getElementById('listaEmbarazos');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
    for(let a = 0; a<metaListaEmbarazos.length; a++){
        if(idFila == metaListaEmbarazos[a][1]){
            metaListaEmbarazos.splice(a,1)
            break;
        }
    }
}
function addEmbarazoE(){
    let activo = document.getElementById('embarazoE').value;
    let listaEmbarazos = document.getElementById('listaEmbarazosE');

    if (activo == "ACTIVO"){
        let embDesde = document.getElementById('embarazoDesdeE').value;
        fechaFin = "NULL";
        listaEmbarazos.innerHTML += `<li id="LI${embDesde}">${embDesde} ${activo} <button type="button" onclick ="deleteEmbarazoE('${embDesde}')">❌</li>`;
        var pushTrat = [activo,embDesde,fechaFin];
    }else{
        let fechaInicio = document.getElementById('inicioEmbarazoE').value;
        let fechaFin = document.getElementById('finEmbarazoE').value;
        listaEmbarazos.innerHTML += `<li id="LI${fechaInicio}">${fechaInicio} a ${fechaFin}<button type="button" onclick ="deleteEmbarazoE('${fechaInicio}')">❌</li>`;
        var pushTrat = [activo,fechaInicio,fechaFin];
    }
    metaListaEmbarazos.push(pushTrat)
    document.getElementById('embarazoDesdeE').value="";
    document.getElementById('inicioEmbarazoE').value="";
    document.getElementById('finEmbarazoE').value="";
}
function deleteEmbarazoE(idFila){
    let lista = document.getElementById('listaEmbarazosE');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
    for(let a = 0; a<metaListaEmbarazos.length; a++){
        if(idFila == metaListaEmbarazos[a][1]){
            metaListaEmbarazos.splice(a,1)
            break;
        }
    }
}
function extraerEmbarazos(){
    let longitud = metaListaEmbarazos.length;
    let array = metaListaEmbarazos.splice(0,longitud);
    return array;
}
//PATOLOGIAS PREVIAS
var metaListaPatologias = []; //se usa mas tarde para el formulario de patologias previas
function addPatologia(){
    let listaPatologias = document.getElementById('listaPatologiasPrevias');
    //get datos
    let patologia = document.getElementById('enfermedadPrevia').value;
    let activa = document.getElementById('enfermedadActiva').value;
    let fechaInicio = document.getElementById('fechaInicioEnfermedad').value;
    let fechaFin = document.getElementById('fechaFinEnfermedad').value;
    let descripcion = document.getElementById('descripcionEnfermedad').value;
    let pushLista;
    activa == "ACTIVA" ? (
        pushLista = `<li id="LI${patologia}">${patologia} - Desde ${fechaInicio} ${activa}<button type="button" onclick ="deletePatologia('${patologia}')">❌</li>`
    ):(
        pushLista = `<li id="LI${patologia}">${patologia} - Desde ${fechaInicio} hasta ${fechaFin}<button type="button" onclick ="deletePatologia('${patologia}')">❌</li>`
    );
    listaPatologias.innerHTML += pushLista;
    var pushPat = [patologia,activa,fechaInicio,fechaFin,descripcion];
    metaListaPatologias.push(pushPat);
    document.getElementById('enfermedadPrevia').value = "";
    document.getElementById('enfermedadActiva').value = "placeholderPatAct";
    document.getElementById('fechaInicioEnfermedad').value = "";
    document.getElementById('fechaFinEnfermedad').value = "";
    document.getElementById('descripcionEnfermedad').value = "";
}
function addPatologiaE(){
    let listaPatologias = document.getElementById('listaPatologiasPreviasE');
    //get datos
    let patologia = document.getElementById('enfermedadPreviaE').value;
    let activa = document.getElementById('enfermedadActivaE').value;
    let fechaInicio = document.getElementById('fechaInicioEnfermedadE').value;
    let fechaFin = document.getElementById('fechaFinEnfermedadE').value;
    let descripcion = document.getElementById('descripcionEnfermedadE').value;
    let pushLista;
    activa == "ACTIVA" ? (
        pushLista = `<li id="LI${patologia}">${patologia} - Desde ${fechaInicio} ${activa}<button type="button" onclick ="deletePatologiaE('${patologia}')">❌</li>`
    ):(
        pushLista = `<li id="LI${patologia}">${patologia} - Desde ${fechaInicio} hasta ${fechaFin}<button type="button" onclick ="deletePatologiaE('${patologia}')">❌</li>`
    );
    listaPatologias.innerHTML += pushLista;
    var pushPat = [patologia,activa,fechaInicio,fechaFin,descripcion];
    metaListaPatologias.push(pushPat);
    document.getElementById('enfermedadPreviaE').value = "";
    document.getElementById('enfermedadActivaE').value = "placeholderPatAct";
    document.getElementById('fechaInicioEnfermedadE').value = "";
    document.getElementById('fechaFinEnfermedadE').value = "";
    document.getElementById('descripcionEnfermedadE').value = "";
}

function extraerPatologias(){
    let longitud = metaListaPatologias.length;
    let array = metaListaPatologias.splice(0,longitud);
    return array;
}

function deletePatologia(idFila){
    let lista = document.getElementById('listaPatologiasPrevias');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
    for(let a = 0; a<metaListaPatologias.length; a++){
        if(idFila == metaListaPatologias[a][0]){
            metaListaPatologias.splice(a,1)
            break;
        }
    }
}
function deletePatologiaE(idFila){
    let lista = document.getElementById('listaPatologiasPreviasE');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
    for(let a = 0; a<metaListaPatologias.length; a++){
        if(idFila == metaListaPatologias[a][0]){
            metaListaPatologias.splice(a,1)
            break;
        }
    }
}
var metaListaTratamientos = [];
var listaFarmacos = [];

async function fillListaFarmacos() {
    let url = `/api/enfermero/:id/getFarmacos?token=${crendenciales}`
    let peticion = {
        method: "GET"
    }
    let respuesta = await peticionREST(url, peticion);
    for (let a = 0; a < respuesta.length; a++) {
        listaFarmacos.push(`${respuesta[a].Nombre} - ${respuesta[a].IDFarmaco}`);
    }
}

function addTratamiento() {
    //obtencion de datos
    let listaTratamientos = document.getElementById('listaTratamientos');
    let farmaco = document.getElementById('farmaco').value;
    let fechaInicio = document.getElementById('fechaInicioTratamiento').value;
    let fechaFin = document.getElementById('fechaFinTratamiento').value;
    let dosis = document.getElementById('dosisConsumida').value;
    let intervalos = document.getElementById('intervalosTratamiento').value;

    //manejo de datos
    listaTratamientos.innerHTML += `<li id="LI${farmaco}">${farmaco} - ${fechaInicio} - ${fechaFin}<button type="button" onclick="deleteTratamiento('${farmaco}')">❌</li>`;
    let pushTrat = [farmaco,fechaInicio,fechaFin, intervalos, dosis];
    metaListaTratamientos.push(pushTrat);

    //vaciado de campos
    document.getElementById('farmaco').value = "";
    document.getElementById('fechaInicioTratamiento').value = "";
    document.getElementById('fechaFinTratamiento').value = "";
    document.getElementById('dosisConsumida').value = "";
    document.getElementById('intervalosTratamiento').value = "";
}
function addTratamientoE() {
    //obtencion de valores
    let listaTratamientos = document.getElementById('listaTratamientosE');
    let farmaco = document.getElementById('farmacoE').value;
    let fechaInicio = document.getElementById('fechaInicioTratamientoE').value;
    let fechaFin = document.getElementById('fechaFinTratamientoE').value;
    let dosis = document.getElementById('dosisConsumidaE').value;
    let intervalos = document.getElementById('intervaloTomasE').value;
    
    //manejo de datos
    listaTratamientos.innerHTML += `<li id="LI${farmaco}">${farmaco} - ${fechaInicio} - ${fechaFin}<button type="button" onclick="deleteTratamientoE('${farmaco}')">❌</li>`;
    let pushTrat = [farmaco, fechaInicio, fechaFin, intervalos, dosis];
    metaListaTratamientos.push(pushTrat);

    //vaciado de campos
    document.getElementById('farmacoE').value = "";
    document.getElementById('fechaInicioTratamientoE').value = "";
    document.getElementById('fechaFinTratamientoE').value = "";
    document.getElementById('dosisConsumidaE').value = "";
    document.getElementById('intervaloTomasE').value = "";
}

function deleteTratamiento(idFila){
    let lista = document.getElementById('listaTratamientos');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
    for(let a = 0; a<metaListaTratamientos.length; a++){
        if(idFila == metaListaTratamientos[a][0]){
            metaListaTratamientos.splice(a,1)
            break;
        }
    }
}
function deleteTratamientoE(idFila){
    let lista = document.getElementById('listaTratamientosE');
    let IDFila = `LI${idFila}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);
    for(let a = 0; a<metaListaTratamientos.length; a++){
        if(idFila == metaListaTratamientos[a][0]){
            metaListaTratamientos.splice(a,1)
            break;
        }
    }
}

function extraerTratamientos(){
    let longitud = metaListaTratamientos.length;
    let array = metaListaTratamientos.splice(0,longitud);
    return array;
}

async function registrarPaciente(){
    let formSexoPaciente = document.getElementById('sexoPaciente').value;
    if(formSexoPaciente =='F'){
        //si es femenino, se lee la parte de embarazo y lactancia
        let lactanciaValue = document.getElementById('lactancia').value;
        var datosPaciente = {
            info : extraerDatosTablaPaciente(),
            alergias : extraerAlergias(),
            patologias : extraerPatologias(),
            tratamientos : extraerTratamientos(),
            embarazos : extraerEmbarazos(),
            lactancia : lactanciaValue
        }   
    }else if(formSexoPaciente =='M'){
        var datosPaciente = {
            info : extraerDatosTablaPaciente(),
            alergias : extraerAlergias(),
            patologias : extraerPatologias(),
            tratamientos : extraerTratamientos()
        }
    }
    let url = `/api/admin/:id/nuevoPaciente?token=${crendenciales}`;
    let peticionServer = {
        method : 'POST',
        body : JSON.stringify(datosPaciente),
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let respuestaServidor = await peticionREST(url,peticionServer);
}
async function borrarPaciente(idPaciente){
    let url = `/api/admin/:id/borrarPaciente/${idPaciente}?token=${crendenciales}`
    let peticionServer = {
        method : 'DELETE',
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let respuestaServidor = await peticionREST(url, peticionServer);
    let lista = document.getElementById("cuerpoListadoPacientes");
    respuestaServidor == "Borrado" ? (verMenuListaPacientes()) : (alert('No se ha podido borrar el paciente'))
}

async function deleteAlergiaBBDD(idAlergia){
    let url = `/api/admin/:id/deleteAlergia/${idAlergia}?token=${crendenciales}`;
    let petDelete = { 
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
        }
    };
    let respuesta = await peticionREST(url, petDelete);
    if(respuesta == "Borrado"){
        let lista = document.getElementById('alergiasPacienteE');
        let IDFila = `LI${idAlergia}`
        let fila = document.getElementById(IDFila);
        lista.removeChild(fila);
    }
}
async function borrarEmbarazoBBDD(idEmbarazo){
    let url = `/api/admin/:id/deleteEmbarazo/${idEmbarazo}?token=${crendenciales}`;
    let petDelete = { 
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
        }
    };
    let respuesta = await peticionREST(url, petDelete);
    if(respuesta == "Borrado"){
        let lista = document.getElementById('listaEmbarazosE');
        let IDFila = `LI${idEmbarazo}`
        let fila = document.getElementById(IDFila);
        lista.removeChild(fila);
    }
}
async function deletePatologiaBBDD(idPatologia){
    let url = `/api/admin/:id/deletePatologia/${idPatologia}?token=${crendenciales}`;
    let petDelete = { 
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
        }
    };
    let respuesta = await peticionREST(url, petDelete);
    if(respuesta == "Borrado"){
        let lista = document.getElementById('listaPatologiasPreviasE')
        let IDFila = `LI${idPatologia}`
        let fila = document.getElementById(IDFila)
        lista.removeChild(fila);
    }
}

async function deleteTratamientoBBDD(idTratamiento){
    let url = `/api/admin/:id/deleteTratamiento/${idTratamiento}?token=${crendenciales}`;
    let petDelete = { 
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
        }
    };
    let respuesta = await peticionREST(url, petDelete);
    if(respuesta == "Borrado"){
        let lista = document.getElementById('listaTratamientosE')
        let IDFila = `LI${idTratamiento}`
        let fila = document.getElementById(IDFila)
        lista.removeChild(fila);
    }
}

async function verMenuEditarPaciente(idPaciente) {
    listaFarmacos.splice(0,listaFarmacos.length);
    fillListaFarmacos();
    document.getElementById('embarazoDesdeE').disabled = true;
    document.getElementById('formularioEditarPaciente').reset();
    document.getElementById('listaTratamientosE').innerHTML = "";
    document.getElementById('listaPatologiasPreviasE').innerHTML = "";
    document.getElementById('alergiasPacienteE').innerHTML = "";
    document.getElementById('listaEmbarazosE').innerHTML = "";

    metaListaEmbarazos.splice(0,metaListaEmbarazos.length)
    metaListaAlergias.splice(0,metaListaAlergias.length)
    metaListaPatologias.splice(0,metaListaPatologias.length)
    metaListaTratamientos.splice(0,metaListaTratamientos.length)


    let url = `/api/admin/:id/getPaciente/${idPaciente}?token=${crendenciales}`
    let urlAlergias = `/api/admin/:id/getAlergiasPaciente/${idPaciente}?token=${crendenciales}`
    let urlPatPrev = `/api/admin/:id/getPatPreviasPaciente/${idPaciente}?token=${crendenciales}`
    let urlTratamientos = `/api/admin/:id/getTratamientosPaciente/${idPaciente}?token=${crendenciales}`
    let peticionServer = {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let datosPaciente = await peticionREST(url,peticionServer);
    let alergiasPaciente = await peticionREST(urlAlergias, peticionServer)
    let patologiasPrevias = await peticionREST(urlPatPrev, peticionServer)
    let tratamientos = await peticionREST(urlTratamientos, peticionServer)
    let data = datosPaciente[0];


    //cambio de los formularios de maternidad
    if (data.Sexo == "F"){
        let urlEmbarazos = `/api/admin/:id/getEmbarazosPaciente/${idPaciente}?token=${crendenciales}`
        let urlLactancia = `/api/admin/:id/getLactanciaPaciente/${idPaciente}?token=${crendenciales}`
        let embarazosPaciente = await peticionREST(urlEmbarazos, peticionServer);
        let lactanciaPaciente = await peticionREST(urlLactancia, peticionServer);
        document.getElementById('embarazoE').disabled = false;
        document.getElementById('embarazoE').value = "NO";
        document.getElementById('inicioEmbarazoE').disabled = false;
        document.getElementById('finEmbarazoE').disabled = false;
        document.getElementById('botonAddEmbarazoE').disabled = false;
        document.getElementById('lactanciaE').disabled = false;
        document.getElementById('lactanciaE').value = "NO";
        let listaEmb = document.getElementById('listaEmbarazosE');
        for(let a = 0; a<embarazosPaciente.length; a++){
            let embarazo = embarazosPaciente[a];
            let activo;
            let liLista;
            let fechaInicio = embarazo.FechaInicio;
            fechaInicio = fechaInicio.substring(0,10)
            embarazo.Activo == 1? 
            (activo ="Activo", liLista =`<li id="LI${embarazo.IDEmbarazo}"> ${activo} - Desde ${fechaInicio}<button type = "button" onclick="borrarEmbarazoBBDD('${embarazo.IDEmbarazo}')">❌</button></li>`):
                (activo = "No Activo", liLista = `<li id="LI${embarazo.IDEmbarazo}"> ${activo} - Desde ${fechaInicio} Hasta ${(embarazo.FechaFin).substring(0, 10)}<button type = "button" onclick="borrarEmbarazoBBDD('${embarazo.IDEmbarazo}')">❌</button></li>`)
            listaEmb.innerHTML += liLista;
        }
        console.log(lactanciaPaciente[0].Activa);
        document.getElementById("lactanciaE").value = lactanciaPaciente[0].Activa;

    }else if(data.Sexo =="M"){
        document.getElementById('embarazoE').disabled = true;
        document.getElementById('embarazoE').value = "NO";
        document.getElementById('inicioEmbarazoE').disabled = true;
        document.getElementById('finEmbarazoE').disabled = true;
        document.getElementById('botonAddEmbarazoE').disabled = true;
        document.getElementById('lactanciaE').disabled = true;
        document.getElementById('lactanciaE').value = "NO";
    }

    //datos del paciente
    document.getElementById('nombrePacienteE').value = data.Nombre;
    document.getElementById('apellidosPacienteE').value = data.Apellidos;
    document.getElementById('IdPacienteE').value = data.NIdentidad;
    let fecha = new Date(data.FechaNacimiento)
    let dia = fecha.getDay()+1
    dia = dia.toString()
    dia.length == 1 ? (dia = "0"+dia):(dia = dia)
    let mes = fecha.getMonth()+1
    mes = mes.toString()
    mes.length == 1 ? (mes = "0"+ mes): (mes = mes)
    let anno = fecha.getFullYear()
    anno = anno.toString()
    fecha = `${anno}-${mes}-${dia}`
    document.getElementById('fechaNacimientoPacienteE').value = fecha;

    document.getElementById('sexoPacienteE').value = data.Sexo;
    document.getElementById('pesoPacienteE').value = data.Peso;
    document.getElementById('tallaPacienteE').value = data.Talla;
    document.getElementById("submitCambiosPaciente").setAttribute('onclick',`editarPaciente('${data.NIdentidad}')`)
    let listaAlergenos = document.getElementById('alergiasPacienteE');
    //alergias
    for(let a = 0; a<alergiasPaciente.length; a++){
        let alergia = alergiasPaciente[a];
        listaAlergenos.innerHTML += `<li id="LI${alergia.IDAlergia}">${alergia.Alergeno}<button type="button" onclick ="deleteAlergiaBBDD('${alergia.IDAlergia}')">❌</li>`;
    }
    let listaPatologiasPrevias = document.getElementById('listaPatologiasPreviasE');
    for(let a = 0; a<patologiasPrevias.length; a++){
        let patologia = patologiasPrevias[a];
        listaPatologiasPrevias.innerHTML += `<li id="LI${patologia.IDPatologia}">${patologia.Nombre}<button type="button" onclick="deletePatologiaBBDD('${patologia.IDPatologia}')">❌</button></li>`
    }
    let listaTratamientos = document.getElementById('listaTratamientosE');
    for(let a  = 0; a<tratamientos.length; a++){
        let tratamiento = tratamientos[a];
        listaTratamientos.innerHTML += `<li id="LI${tratamiento.idTratamiento}">${tratamiento.nombre}<button type="button" onclick="deleteTratamientoBBDD('${tratamiento.idTratamiento}')">❌</button></li>`
    }
    cambiarPantalla("menuEditarPaciente");
}

async function editarPaciente(idPaciente){
    let url = `/api/admin/:id/editPaciente/${idPaciente}?token=${crendenciales}`
    let formSexoPaciente = document.getElementById('sexoPacienteE').value;

    if(formSexoPaciente =='F'){
        //si es femenino, se lee la parte de embarazo y lactancia
        let lactanciaValue = document.getElementById('lactanciaE').value;
        var datosPaciente = {
            info : extraerDatosTablaPacienteE(),
            alergias : extraerAlergiasE(),
            patologias : extraerPatologias(),
            tratamientos : extraerTratamientos(),
            embarazos : extraerEmbarazos(),
            lactancia : lactanciaValue
        }   
    }
    else if (formSexoPaciente == 'M') {
        var datosPaciente = {
            info : extraerDatosTablaPacienteE(),
            alergias : extraerAlergiasE(),
            patologias : extraerPatologias(),
            tratamientos : extraerTratamientos()
        }
    }
    let petPut = { 
        method: 'PUT', 
        body: JSON.stringify(datosPaciente),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    await peticionREST(url,petPut)
}

async function fillListaPacientes(){
    let url = `/api/admin/:id/getPacientes?token=${crendenciales}`;
    let petGet = {
        method : "GET",
        headers: {
            'Content-Type':'application/json',
        } 
    }
    let listaPacientes = await peticionREST(url,petGet);
    var tabla = document.getElementById('cuerpoListadoPacientes');
    for (let a = 0; a < listaPacientes.length; a++) {
        let paciente = listaPacientes[a];
        let identificadorPaciente = paciente.NIdentidad;
        let nombre = paciente.Nombre;
        let apellidos = paciente.Apellidos;
        tabla.innerHTML += `<tr id="${identificadorPaciente}"><td>${identificadorPaciente}</td><td>${nombre}</td><td>${apellidos}</td><td><button type="button" onclick="verMenuEditarPaciente('${identificadorPaciente}')">Editar</button></td><td><button type="button" onclick="borrarPaciente('${identificadorPaciente}')">Borrar</button></td></tr>`;
    }
}

function verMenuListaPacientes(){
    document.getElementById('cuerpoListadoPacientes').innerHTML = "";
    fillListaPacientes()
    cambiarPantalla("menuListaPacientes");
}
//  FIN DE REGISTRAR/EDITAR PACIENTE
//  --------------------------------

// MENU DAR CITA
var listaPacientes = []
var listaEnfermeros = []

function pantallaDarCita() {
    listaPacientes.splice(0, listaPacientes.length)
    listaEnfermeros.splice(0, listaEnfermeros.length)
    document.getElementById('formularioCita').reset()
    llenarListasCita()
    cambiarPantalla('menuDarCita')
}

async function llenarListasCita() {
    let url = `/api/admin/:id/getPacientesEnfermeros?token=${crendenciales}`
    let petGet = {
        method: 'GET'
    }
    let respuesta = await peticionREST(url,petGet);
    for(let a = 0; a<respuesta[0].length; a++){
        let entrada = `${respuesta[0][a].Nombre} ${respuesta[0][a].Apellidos} - ${respuesta[0][a].NIdentidad}`;
        listaPacientes.push(entrada)
    }
    for(let a = 0; a<respuesta[1].length; a++){
        let entrada = `${respuesta[1][a].Nombre} ${respuesta[1][a].Apellidos} - ${respuesta[1][a].ID}`;
        listaEnfermeros.push(entrada)
    }
    
}

async function crearCita(){
    let fechaHora = document.getElementById('fechaCita').value
    let tipo = document.getElementById('tipoRevision').value
    let presencialidad = document.getElementById('ubicacionCita').value
    let enfermero = document.getElementById('nombreEnfermeroCita').value
    let paciente = document.getElementById('nombrePacienteCita').value
    let datosCita = {
        paciente : paciente,
        enfermero : enfermero,
        tipo : tipo,
        presencialidad : presencialidad,
        fechaHora : fechaHora
    }
    console.log(datosCita);

    if (datosCita.paciente == "" || datosCita.enfermero == "" || datosCita.tipo == "placeholderTipoRevision" || datosCita.presencialidad == "placeholderUbiCita" || datosCita.fechaHora == "") {
        alert("Rellene todos los campos")
        return;
    }
    let url = `/api/admin/:id/crearCita?token=${crendenciales}`
    let petServer = {
        method : 'POST',
        body : JSON.stringify(datosCita),
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    
    let respuesta = await peticionREST(url, petServer)
    if (respuesta === "Cita creada") {
        alert("Cita creada")
        document.getElementById('formularioCita').reset()

    } else if (respuesta === 400) {
        alert("Esa hora ya esta ocupada, prueba otra")
    }
    
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

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////MENU ENFERMERO///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

var dniEnfermeroActual
async function getIDEnfermero(dniEnfermero){
    let url = `/api/enfermero/getIDEnfermero/${dniEnfermero}?token=${crendenciales}`
    let peticionServer = {
        method: "GET",
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let idEnfermero = await peticionREST(url,peticionServer)
    return idEnfermero[0].ID
}
function verMenuEnfermeroHTML(dniEnfermero = dniEnfermeroActual){
    document.getElementById('h0').innerHTML = `<td id="ch0" class="casillaHora"></td>`
    document.getElementById('h1').innerHTML = `<td id="ch1" class="casillaHora"></td>`
    document.getElementById('h2').innerHTML = `<td id="ch2" class="casillaHora"></td>`
    document.getElementById('h3').innerHTML = `<td id="ch3" class="casillaHora"></td>`
    document.getElementById('h4').innerHTML = `<td id="ch4" class="casillaHora"></td>`
    document.getElementById('h5').innerHTML = `<td id="ch5" class="casillaHora"></td>`
    document.getElementById('h6').innerHTML = `<td id="ch6" class="casillaHora"></td>`
    document.getElementById('h7').innerHTML = `<td id="ch7" class="casillaHora"></td>`
    document.getElementById('h8').innerHTML = `<td id="ch8" class="casillaHora"></td>`
    document.getElementById('h9').innerHTML = `<td id="ch9" class="casillaHora"></td>`
    document.getElementById('h10').innerHTML = `<td id="ch10" class="casillaHora"></td>`
    document.getElementById('h11').innerHTML = `<td id="ch11" class="casillaHora"></td>`
    let hoy = new Date()
    let mes = hoy.toLocaleString("es", { month: "long" }).toUpperCase()
    let displays = document.getElementsByName('monthDisplay')
    for (let a = 0; a<displays.length; a++){
        displays[a].innerHTML = mes
    }
    verMenuEnfermero(dniEnfermero)
}
async function verMenuEnfermero(dniEnfermero){
    //info para rellenar toda la pagina
    await getCitas(dniEnfermero); //aqui tengo las citas del enfermero
    let resultados = await getResultados(dniEnfermero); //aqui tengo los resultados de sus test actuales
    dniEnfermeroActual = dniEnfermero
    //ajustar fechas y horas de la tabla

    cambiarPantalla('menuEnfermero')
}

//FUNCIONES PARA RELLENAR MENU PRINCIPAL ENFERMERO
//funcion para obtener citas
async function getCitas(dni) {
    let idEnfermero = await getIDEnfermero(dni)
    let url = `/api/enfermero/${idEnfermero}/citas?token=${crendenciales}`;
    let peticionGet = { method: 'GET' };
    let respuesta = await peticionREST(url,peticionGet);
    let citas = respuesta[0] //datos de las citas
    
    //rellenado de horas de la tabla
    let date = new Date()
    let dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    let intDia  = date.getDate(); let intMes = date.getUTCMonth() + 1; let stringDia =  dias[date.getUTCDay()]
    for(let a = 0; a<12; a++){
        let casillaHora = document.getElementById(`ch${a}`);
        let hora = `${date.getHours()+a}:00`
        casillaHora.innerHTML = hora
    }
    for(let a  = 0; a<=3; a++){
        let fragHora = document.getElementById(`${a}/4h`)
        let minuto  = (a*15).toString()
        minuto.length == 1 ? (minuto = '00') : (minuto = minuto) 
        fragHora.innerHTML = `${date.getHours()}:${minuto}`
    }
    let stringFecha = `${intDia}/${intMes} - ${stringDia}`
    document.getElementById('dia0').innerHTML = stringFecha
    ///////////////////////////////////////////////////////////

    //SE AÑADEN LAS CITAS A LA TABLA FORMADA EN EL PASO ANTERIOR
    citasHoy = [] //aqui se almacenan las citas pendientes del enfermero, es decir, las que se han de mostrar en el horario
    let pacientes = respuesta[1] //datos de los pacientes citados
    let fechaHoy = fecha();
    for (let a = 0; a < citas.length; a++){
        let cita = citas[a]
        if (cita.FechaHora.substring(0, 10) == fechaHoy && date.getHours() <= cita.FechaHora.substring(11, 13)) {
            citasHoy.push(cita)
        }
    }
    let hora = date.getHours();
    var horarioCitas = new Array(12); 
    var hora0 = new Array(4);
    var hora1 = new Array(4);
    var hora2 = new Array(4);
    var hora3 = new Array(4);
    var hora4 = new Array(4);
    var hora5 = new Array(4);
    var hora6 = new Array(4);
    var hora7 = new Array(4);
    var hora8 = new Array(4);
    var hora9 = new Array(4);
    var hora10 = new Array(4);
    var hora11 = new Array(4);
    for (let c = 0;c < hora0.length; c++) {
        hora0[c] = 0; hora1[c] = 0; hora2[c] = 0; hora3[c] = 0; hora4[c] = 0; hora5[c] = 0; hora6[c] = 0;
        hora7[c] = 0; hora8[c] = 0; hora9[c] = 0; hora10[c] = 0; hora11[c] = 0;
    }
    
    horarioCitas= [hora0,hora1,hora2,hora3,hora4,hora5,hora6,hora7,hora8,hora9,hora10,hora11]

    for (let a = 0; a < citasHoy.length; a++) {
        let cita = citasHoy[a]
        let paciente;
        for (let b = 0; b < pacientes.length; b++) {
            if(cita.IdPaciente == pacientes[b].NIdentidad){
                paciente = pacientes[b]
            }
        }
        let td = `<td id='cita${cita.IDCita}' onClick='verCita(${cita.IDCita})' class='celdaCita tipo${cita.Online}'><div id="datosPacienteCita">${paciente.Nombre} ${paciente.Apellidos}</div><div id='tipoConsulta'>${cita.TipoRevision}    ${cita.FechaHora.substring(11,16)}</div></td>`
        let idFila = cita.FechaHora.substring(11, 13)
        let nFila = idFila - hora;
        let idColumna = cita.FechaHora.substring(14,16);
        let nColumna;
        if(idColumna<15){
            nColumna = 0;
        }else if(15<=idColumna && idColumna<30){
            nColumna = 1;
        }else if(30<=idColumna && idColumna<45){
            nColumna = 2;
        }else if(45<=idColumna && idColumna<60){
            nColumna = 3;
        }
        horarioCitas[nFila][nColumna] = td;
    }
    for (let a = 0; a < horarioCitas.length; a++) {
        let fila = document.getElementById(`h${a}`)
        for (let b = 0; b < horarioCitas[a].length; b++) {
            if(horarioCitas[a][b] == 0){
                let td = `<td class="celdaVacia"></td>`
                fila.innerHTML += td
            }else{
                fila.innerHTML += horarioCitas[a][b]
            }
        }  
    }

}




//funcion para obtener los resultados de los test
function getResultados(dni) {
    let url = `/api/enfermero/${dni}/resultados?token=${crendenciales}`;
    let peticionGet = { method: 'GET'};
    let resultados = peticionREST(url, peticionGet);
    return resultados;
}


//FUNCIONES PARA TEST
async function cargarTest({tipo}){
    //obtiene un unico test y sus preguntas, y genera un array con el ID del test, los ids de las preguntas
    // return ID test, ciclotest, preguntas[]
    let idEnfermero = await getIDEnfermero(dniEnfermeroActual)
    let url = `/api/enfermero/${idEnfermero}/getTest/${tipo}?token=${crendenciales}`
    let peticion = {
        method: "GET"
    }
    let contestacion = await peticionREST(url, peticion)
    console.log(contestacion);
    return contestacion
}

async function cargarPreguntas({idTest}){
    let url = `/api/enfermero/:id/getPreguntasTest/${idTest}?token=${crendenciales}`
    let peticionServer = {
        method: 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let conjuntoPreguntas = await peticionREST(url, peticionServer)
    return conjuntoPreguntas
}

var preguntasActivas = []
var contestaciones = []
var preguntasMalas = []
var preguntaActual = 1
var puntuacion = 0
var idTestActual 
var tipoTestActual
var periodoTestActual
function gestionBotonesTest(){
    //cambia el boton a usar en funcion de la pregunta en la que se encuentra el test
    if (preguntaActual >= preguntasActivas.length){
        document.getElementById("botonSiguientePregunta").style.display = "none"
        document.getElementById("botonTerminarTest").style.display = "inline"
    }else{
        document.getElementById("botonSiguientePregunta").style.display = "inline"
        document.getElementById("botonTerminarTest").style.display = "none"
    }
}

function terminarTest(){
    var contestacion = 0
    puntuacion = 0
    let opciones = document.getElementsByName('respuestas')
    for(let a  = 0; a<opciones.length;a++){
        if(opciones[a].checked){
            contestacion = opciones[a].value
        }
    }
    contestaciones[preguntaActual-1] = contestacion
    let correctas =  []
    for(let a  = 0; a<preguntasActivas.length; a++){
        correctas.push(preguntasActivas[a].RespuestaCorrecta)
        if(contestaciones[a] == preguntasActivas[a].RespuestaCorrecta){
            let valor = 10/preguntasActivas.length
            puntuacion += valor
        } else if (contestaciones[a] != preguntasActivas[a].RespuestaCorrecta && contestaciones[a] != 0) {
            let valor = 10/(preguntasActivas.length*3)
            preguntasMalas.push(preguntasActivas[a])
            puntuacion -= valor
        }
    }
    tiempoRestanteTest = document.getElementById('testTimer').innerHTML
    enviarResultadosTest()
    cambiarPantalla('pantallaReviewTest')
    //hay que devolver el IDEnfermero, IDTest, IDPreguntas Contestadas, las contestaciones, el tiempo restante, puntuacion
    //hay que hacer insert en enfermero test y en contestacion enfermero
}

async function enviarResultadosTest(){
    let idPreguntas = preguntasActivas.map((x)=>{return x.IDPregunta})
    let porcentajeCompleto = 0
    for(let a = 0; a<contestaciones.length; a++){
        contestaciones[a] != 0 ? (porcentajeCompleto += (100/(contestaciones.length))) : (porcentajeCompleto = porcentajeCompleto)
    }
    let datosTest = {
        dniEnfermero : dniEnfermeroActual,
        idTest: idTestActual,
        idPreguntas : idPreguntas,
        contestaciones : contestaciones,
        tiempoRestante : tiempoRestanteTest,
        puntuacion : puntuacion,
        fecha: fecha(),
        completado : porcentajeCompleto
    }
    //rellenado de la pantalla de review
    document.getElementById('testRealizado').innerHTML = `${tipoTestActual} - ${periodoTestActual}`
    document.getElementById('resultadoTestRealizado').innerHTML = `${puntuacion} - Correctas: ${preguntasActivas.length-preguntasMalas.length} - Incorrectas: ${preguntasMalas.length}`
    document.getElementById('tiempoRestanteTestRealizado').innerHTML = `Tiempo sobrante: ${tiempoRestanteTest}`
    let listaPreguntasMalas = document.getElementById('listaPreguntasIncorrectas')
    listaPreguntasMalas.innerHTML = ""
    for(let a  = 0; a<preguntasMalas.length; a++){
        listaPreguntasMalas.innerHTML += `<li>${preguntasMalas[a].Pregunta}</li>`
    }
    let url = `/api/enfermero/:id/guardarTest?token=${crendenciales}`
    let peticion = {
        method: 'POST',
        body : JSON.stringify(datosTest),
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let contestacion = peticionREST(url, peticion)
}

function cargarPregunta(){
    let pregunta = preguntasActivas[preguntaActual - 1].Pregunta
    console.log(pregunta);
    let resp1 = preguntasActivas[preguntaActual-1].Respuesta1
    let resp2 = preguntasActivas[preguntaActual-1].Respuesta2
    let resp3 = preguntasActivas[preguntaActual-1].Respuesta3
    let resp4 = preguntasActivas[preguntaActual - 1].Respuesta4
    console.log(resp1);
    document.getElementById("preguntaActual").innerHTML = `Pregunta ${preguntaActual}/${preguntasActivas.length}`
    document.getElementById("enunciadoPregunta").innerHTML = pregunta
    document.getElementById("contenidoR1T").innerHTML = resp1
    document.getElementById("contenidoR2T").innerHTML = resp2
    document.getElementById("contenidoR3T").innerHTML = resp3
    document.getElementById("contenidoR4T").innerHTML = resp4
    let respuestaDada = contestaciones[preguntaActual-1]
    if(respuestaDada != 0){
        document.getElementById(`respuesta${respuestaDada}T`).checked = true;
    } else if (respuestaDada == 0){
        document.getElementById(`respuesta1T`).checked = false;
        document.getElementById(`respuesta2T`).checked = false;
        document.getElementById(`respuesta3T`).checked = false;
        document.getElementById(`respuesta4T`).checked = false;
    }
    gestionBotonesTest()
}

function siguientePregunta(){
    let contestacion = 0
    let opciones = document.getElementsByName('respuestas')
    for(let a  = 0; a<opciones.length;a++){
        if(opciones[a].checked){
            contestacion = opciones[a].value
        }
    }
    contestaciones[preguntaActual-1] = contestacion
    preguntaActual +=1
    cargarPregunta()
}

function preguntaAnterior(){
    preguntaActual -=1
    cargarPregunta()
}
function getMomentoActual(){
    let tiempo = new Date().getTime()
    return tiempo
}
var tiempoRestanteTest
function setTimer(){
    document.getElementById('testTimer').innerHTML = ""
    let tiempoInicial = new Date().getTime()
    let tiempoLimite = tiempoInicial + 30*60*1000
    let tiempoActual = getMomentoActual()
    let tiempoRestante = tiempoLimite - tiempoActual
    let minutosRestantes
    let segundosRestantes
    let temporizador = setInterval(()=>{
        tiempoActual = getMomentoActual()
        tiempoRestante = tiempoLimite - tiempoActual
        minutosRestantes = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        segundosRestantes = Math.floor((tiempoRestante % (1000 * 60)) / 1000);
        segundosRestantes = segundosRestantes.toString()
        if(segundosRestantes.length == 1){
            segundosRestantes = `0${segundosRestantes}`; 
        }
        document.getElementById('testTimer').innerHTML = `${minutosRestantes}:${segundosRestantes}`;
        if(tiempoRestante<0){
            clearInterval(temporizador)
            tiempoRestanteTest = "00:00"
            terminarTest()
        }
        document.getElementById('botonAbandonarTest').addEventListener('click',()=>{
            console.log("Test abandonado")
            clearInterval(temporizador)
        })
        document.getElementById('botonTerminarTest').addEventListener('click',()=>{
            clearInterval(temporizador)
            console.log("Test terminado")
        })
    },1000)
}

async function verTest0(){
    //lleva al test de diabetes
    //primero se obtiene el test del ciclo actual
    
    preguntasActivas = []
    preguntaActual = 1
    let hoy = new Date()
    let periodo = `${hoy.getMonth()}-${hoy.getFullYear()}`;
    let test = await cargarTest({ tipo: "Diabetes" })
    if(test != 403 && test != 404){
        tipoTestActual = "Diabetes"
        periodoTestActual = periodo
        let idTest = test.IDTest
        idTestActual = idTest
        //a continuacion se obtienen los ids de las preguntas que aparecen en el test 
        preguntasActivas = await cargarPreguntas({ idTest: idTest })
        console.log(preguntasActivas);
        document.getElementById("nombreTest").innerHTML = "Diabetes";
        document.getElementById("periodoTest").innerHTML = periodo;
        contestaciones = new Array(preguntasActivas.length)
        for(let a = 0;a<contestaciones.length; a++){
            contestaciones[a] = 0
        }
        cargarPregunta()
        setTimer()
        cambiarPantalla("pantallaTest")
    }else if(test == 403){
        alert("Ya has hecho este test, debes esperar al siguiente");
    } else if (test == 404) {
        alert("No hay test para este periodo")
    }
}

async function verTest1(){
    //lleva al test de ACOs
    //primero se obtiene el test del ciclo actual
    preguntasActivas = []
    preguntaActual = 1
    let hoy = new Date()
    let periodo = `${hoy.getMonth()}-${hoy.getFullYear()}`
    let test = await cargarTest({periodo:periodo,tipo: "ACOs"})
    if (test != 403 && test != 404){
        tipoTestActual = "ACOs"
        periodoTestActual = periodo
        let idTest = test.IDTest
        idTestActual = idTest
        //a continuacion se obtienen los ids de las preguntas que aparecen en el test 
        preguntasActivas = await cargarPreguntas({idTest:idTest})
        document.getElementById("nombreTest").innerHTML = "Anticoagulantes Orales";
        document.getElementById("periodoTest").innerHTML = periodo;
        contestaciones = new Array(preguntasActivas.length)
        for(let a = 0;a<contestaciones.length; a++){
            contestaciones[a] = 0
        }
        cargarPregunta()
        setTimer()
        cambiarPantalla("pantallaTest")
    } else if (test == 403) {
        alert("Ya has hecho este test, debes esperar al siguiente");
    } else if (test == 404) {
        alert("No hay test para este periodo")
    }
}

async function verTest2(){
    //lleva al test de RV
    //primero se obtiene el test del ciclo actual
    preguntasActivas = []
    preguntaActual = 1
    let hoy = new Date()
    let periodo = `${hoy.getMonth()}-${hoy.getFullYear()}`
    let test = await cargarTest({periodo:periodo,tipo: "RV"})
    if (test != 403 && test != 404){
        tipoTestActual = "RV"
        periodoTestActual = periodo
        let idTest = test.IDTest
        idTestActual = idTest
        //a continuacion se obtienen los ids de las preguntas que aparecen en el test 
        preguntasActivas = await cargarPreguntas({idTest:idTest})
        document.getElementById("nombreTest").innerHTML = "Riesgo Vascular";
        document.getElementById("periodoTest").innerHTML = periodo;
        contestaciones = new Array(preguntasActivas.length)
        for(let a = 0;a<contestaciones.length; a++){
            contestaciones[a] = 0
        }
        cargarPregunta()
        setTimer()
        cambiarPantalla("pantallaTest")
    } else if (test == 403) {
        alert("Ya has hecho este test, debes esperar al siguiente");
    } else if (test == 404) {
        alert("No hay test para este periodo")
    }
}


//FUNCIONES PARA PANTALLA CITA
var idPacienteCita;
var tipoCita;
var idCitaActual;
async function verCita(idCita){
    //datos relacionados con el paciente
    //obtencion idPaciente
    idCitaActual = idCita;
    let urlCita = `/api/enfermero/:id/getCita/${idCita}?token=${crendenciales}`
    let peticionServer = {
        method : 'GET',
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    let datosCita = await peticionREST(urlCita,peticionServer)
    let idPaciente = datosCita[0].IdPaciente
    idPacienteCita = idPaciente;
    tipoCita = datosCita[0].TipoRevision;

    let urlPaciente = `/api/admin/:id/getPaciente/${idPaciente}?token=${crendenciales}`
    let urlAlergias = `/api/admin/:id/getAlergiasPaciente/${idPaciente}?token=${crendenciales}`
    let urlPatPrev = `/api/admin/:id/getPatPreviasPaciente/${idPaciente}?token=${crendenciales}`
    let urlTratamientos = `/api/admin/:id/getTratamientosPaciente/${idPaciente}?token=${crendenciales}`
    
    let datosPaciente = await peticionREST(urlPaciente,peticionServer);
    let data = datosPaciente[0];
    document.getElementById('indNombreApellidos').innerHTML = `${data.Nombre} ${data.Apellidos}`
    document.getElementById('indIdPaciente').innerHTML = `${data.NIdentidad}`
    document.getElementById('indSexo').innerHTML = `${data.Sexo}`
    document.getElementById('indEdad').innerHTML = `${calcularEdad(data.FechaNacimiento)}`
    document.getElementById('indPeso').innerHTML = `${data.Peso}`
    document.getElementById('indMotivo').innerHTML = `${datosCita[0].TipoRevision}`

    document.getElementById('cantidadVariable').value=""



    //alergias
    let alergiasPaciente = await peticionREST(urlAlergias, peticionServer)
    document.getElementById('citaListaAlergias').innerHTML = ""
    for (let a = 0; a < alergiasPaciente.length; a++) {
        document.getElementById('citaListaAlergias').innerHTML += `<li>${alergiasPaciente[a].Alergeno}</li>`;
    }
    //enfermedades previas
    let patologiasPrevias = await peticionREST(urlPatPrev, peticionServer)
    document.getElementById('citaListaPatologias').innerHTML = ""
    for (let a = 0; a < patologiasPrevias.length; a++) {
        document.getElementById('citaListaPatologias').innerHTML+= `<li>${patologiasPrevias[a].Nombre}</li>`        
    }
    //tratamiento en curso
    let tratamientos = await peticionREST(urlTratamientos, peticionServer)
    document.getElementById('citaListaTratamientos').innerHTML = ""
    for (let a = 0; a < tratamientos.length; a++) {
        document.getElementById('citaListaTratamientos').innerHTML += `<li>${tratamientos[a].nombre} - ${tratamientos[a].principioActivo} - ${tratamientos[a].cantidad}</li>`        
    }
    //maternidad
    if (data.Sexo == "F"){
        document.getElementById('citaListaMaternidad').style.display = ""
        document.getElementById('citaListaMaternidad').innerHTML = ""
        let urlEmbarazos = `/api/admin/:id/getEmbarazosPaciente/${idPaciente}?token=${crendenciales}`
        let urlLactancia = `/api/admin/:id/getLactanciaPaciente/${idPaciente}?token=${crendenciales}`
        let embarazosPaciente = await peticionREST(urlEmbarazos, peticionServer);
        let lactanciaPaciente = await peticionREST(urlLactancia, peticionServer);

        document.getElementById('citaListaMaternidad').innerHTML += `<li id ="citaPacienteEmbarazada" onclick="abrirEmbarazo('${data.NIdentidad}')">No Embarazada</li>`
        document.getElementById('citaListaMaternidad').innerHTML += `<li id="citaPacienteLactancia" onclick="abrirLactancia('${data.NIdentidad}')">No da Lactancia</li>`
        for (let a = 0; a < embarazosPaciente.length; a++) {
            if(embarazosPaciente[a].Activo == 1){
                document.getElementById('citaListaMaternidad').removeChild(document.getElementById('citaPacienteEmbarazada'))
                document.getElementById('citaListaMaternidad').innerHTML += `<li id="citaPacienteEmbarazada" onclick="cerrarEmbarazo(${embarazosPaciente[a].IDEmbarazo})">Embarazada</li>`
            }
        }
        for (let a = 0; a < lactanciaPaciente.length; a++) {
            if(lactanciaPaciente[a].Activa == 1){
                document.getElementById('citaListaMaternidad').removeChild(document.getElementById('citaPacienteLactancia'))
                document.getElementById('citaListaMaternidad').innerHTML += `<li id="citaPacienteLactancia" onclick="cerrarLactancia(${lactanciaPaciente[a].IDLactancia})">En lactancia</li>`
            }
        }

    } else if (data.Sexo == "M"){
        document.getElementById('citaListaMaternidad').style.display = "none"
    }

    document.getElementById('medicamentoSeleccionado').value = "placeHolderMedicamento";
    solicitarPrescripcion(idCitaActual);
    cargarMedicionesPaciente(idPacienteCita);
    cambiarPantalla('menuCita')
    getTiposVariables({select: 'tipoVariable'});
}

async function cargarMedicionesPaciente(idPaciente) {
    let url = `/api/enfermero/:id/getMedicionesPaciente/${idPaciente}/${idCitaActual}?token=${crendenciales}`
    let peticionServer = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url, peticionServer);
    let mediciones = respuesta.mediciones;
    let tipos = respuesta.tipos;
    document.getElementById('listaMediciones').innerHTML = ""
    for (let a = 0; a < mediciones.length; a++){
        let tipo = tipos.find(x => x.IDVariable == mediciones[a].Tipo);
        let li = `<li id="LIM${mediciones[a].IDVariable}">${tipo.Nombre} - ${mediciones[a].Valor} ${mediciones[a].Unidades}<button type="button" onclick="borrarMedicion('${mediciones[a].IDVariable}')">❌</button></li>`;
        document.getElementById('listaMediciones').innerHTML += li
    }
}


function calcularEdad(fechaNacimiento){
    let nacimiento = new Date(fechaNacimiento)
    let hoy = new Date()
    var edad = hoy.getFullYear() - nacimiento.getFullYear()
    var m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad
}

async function abrirEmbarazo(idPaciente){
    console.log(idPaciente)
    let url = `/api/enfermero/:id/abrirEmbarazo/${idPaciente}?token=${crendenciales}`
    let fechaInicio = fecha();
    let datos = {fecha: fechaInicio}
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let respuesta = await peticionREST(url,peticion);
    if(respuesta.serverStatus == 2){
        document.getElementById('citaListaMaternidad').removeChild(document.getElementById('citaPacienteEmbarazada'));
        document.getElementById('citaListaMaternidad').innerHTML += `<li id="citaPacienteEmbarazada" onclick="cerrarEmbarazo(${respuesta.insertId})">Embarazada</li>`
    }
} 

async function cerrarEmbarazo(idEmbarazo){
    let url = `/api/enfermero/:id/cerrarEmbarazo/${idEmbarazo}?token=${crendenciales}`
    let datos = {fechaFin : fecha()}
    let peticion = { 
        method: 'PUT',
        body :  JSON.stringify(datos),
        headers : {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url,peticion)
    if(respuesta.serverStatus == 2){
        document.getElementById('citaListaMaternidad').removeChild(document.getElementById('citaPacienteEmbarazada'))
        document.getElementById('citaListaMaternidad').innerHTML += `<li id ="citaPacienteEmbarazada" onclick="abrirEmbarazo('${idPacienteCita}')">No Embarazada</li>`
    }
}

async function abrirLactancia(idPaciente){
    console.log(idPaciente)
    let url = `/api/enfermero/:id/abrirLactancia/${idPaciente}?token=${crendenciales}`
    let fechaInicio = fecha();
    let datos = {fecha: fechaInicio}
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let respuesta = await peticionREST(url,peticion);
    if(respuesta.serverStatus == 2){
        document.getElementById('citaListaMaternidad').removeChild(document.getElementById('citaPacienteLactancia'));
        document.getElementById('citaListaMaternidad').innerHTML += `<li id="citaPacienteLactancia" onclick="cerrarLactancia(${respuesta.insertId})">En lactancia</li>`
    }
} 

async function cerrarLactancia(idEmbarazo){
    let url = `/api/enfermero/:id/cerrarLactancia/${idEmbarazo}?token=${crendenciales}`
    let peticion = { 
        method: 'PUT',
        headers : {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url,peticion)
    if(respuesta.serverStatus == 2){
        document.getElementById('citaListaMaternidad').removeChild(document.getElementById('citaPacienteLactancia'))
        document.getElementById('citaListaMaternidad').innerHTML += `<li id ="citaPacienteLactancia" onclick="abrirLactancia('${idPacienteCita}')">No da lactancia</li>`
    }
}



async function addMedicion(){
    let tipo = document.getElementById('tipoVariable').value
    let nombreTipo = document.getElementById('tipoVariable').selectedOptions[0].innerHTML
    let cantidad = document.getElementById('cantidadVariable').value
    let unidad = document.getElementById('unidadVariable').value
    cantidad = cantidad.replace(",",".")


    let url = `/api/enfermero/${dniEnfermeroActual}/guardarMedidaPaciente/${idPacienteCita}?token=${crendenciales}`
    let datos = {
        tipo: tipo,
        cantidad: cantidad,
        unidades: unidad,
        cita: idCitaActual
    }
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url, peticion)
    if (respuesta.serverStatus == 2) {
        // let li = `<li id="LIM${respuesta.insertId}">${nombreTipo} - ${cantidad} ${unidad} <button type="button" onclick="borrarMedicion('${respuesta.insertId}')">❌</button></li>`;
        document.getElementById('tipoVariable').value = "placeholderVariable";
        document.getElementById('cantidadVariable').value = ""
        document.getElementById('unidadVariable').value = ""
        cargarMedicionesPaciente(idPacienteCita);
    } else {
        alert("Error al guardar la medición")
    }


}

async function borrarMedicion(idMedicion) {
    
    let url = `/api/enfermero/${dniEnfermeroActual}/borrarMedidaPaciente/${idMedicion}?token=${crendenciales}`
    let peticion = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let respuesta = await peticionREST(url, peticion)
    if (respuesta.serverStatus == 2) {
        cargarMedicionesPaciente(idPacienteCita);
    } else {
        alert("Error al borrar la medición");
    }
}

async function guardarMedidas(){
    let idEnfermero = await getIDEnfermero(dniEnfermeroActual)
    let url = `/api/enfermero/${idEnfermero}/guardarMedidasPaciente/${idPacienteCita}?token=${crendenciales}`
    let datos = {
        ids : idMedidaTomada,
        cantidades : cantidadTomada,
        unidades : unidadTomada,
        cita: idCitaActual
    }
    console.log(datos);
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let respuesta = await peticionREST(url,peticion)
    console.log(respuesta)
    
}

async function citaGuardarCambios() {
    let url = `/api/enfermero/${dniEnfermeroActual}/citaGuardarCambios/${idCitaActual}?token=${crendenciales}`
    let sintomasSignos = {
        sintomas: document.getElementById('citaSintomas').value,
        signos: document.getElementById('citaSignos').value
    }


    let peticionServer = {
        method: 'PUT',
        body: JSON.stringify(sintomasSignos),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url, peticionServer)
    console.log(respuesta);
    if (respuesta.serverStatus === 2) {
        document.getElementById('labelSintomas').innerHTML = "Datos guardados correctamente"
        document.getElementById('labelSintomas').style.color = "green"
        setTimeout(() => {
            document.getElementById('labelSintomas').innerHTML = "Síntomas indicados por el paciente";
            document.getElementById('labelSintomas').style.color = "#1b4965"
        }, 2000);
    } else {
        document.getElementById('labelSintomas').innerHTML = "No se pudo actualizar la información"
        document.getElementById('labelSintomas').style.color = "red"
        setTimeout(() => {
            document.getElementById('statusActualizarTratamiento').innerHTML = "Síntomas indicados por el paciente";
            document.getElementById('labelSintomas').style.color = "#1b4965"
        }, 2000);
    }
}

async function verGraficasPaciente(){
    document.getElementById('botonVolverGraficas').setAttribute('onclick', `verCita('${idCitaActual}')`)
    await getTiposVariables({ select:'variableFisicaGrafica'})
    cambiarPantalla('graficasPaciente')
}

document.getElementById('variableFisicaGrafica').addEventListener('change', () => { cargarGraficasPaciente() })
async function cargarGraficasPaciente() { 
    let variable = document.getElementById('variableFisicaGrafica').value;
    let url = `/api/enfermero/${dniEnfermeroActual}/getMedicionesPaciente/${idPacienteCita}/uno?token=${crendenciales}`;
    let peticion = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url, peticion);
    let medidas = respuesta.mediciones;
    let tipos = respuesta.tipos;
    let nTipos = tipos.length;

    medidas.sort(function (a, b) {
        return a.Cita - b.Cita;
    });

    var etiquetas = [];
    for (let a = 0; a < medidas.length; a++) { //se guardan las citas
        etiquetas.push(medidas[a].Cita);
    }
    let etiquetasUnicas = etiquetas.filter(function (value, index, self) { // se obtienen las citas unicas
        return self.indexOf(value) === index;
    });
    let valores = [];
    for (let a = 0; a < nTipos; a++) {
        valores.push([]);
    }
    let idCita;
    for (let a = 0; a < medidas.length; a++) {
        console.log(idCita);
        for (let b = 0; b < nTipos; b++) {
            if (medidas[a].Tipo == tipos[b].IDVariable && medidas[a].Cita != idCita) {
                valores[b].push(medidas[a].Valor);
            } else if (medidas[a].Tipo == tipos[b].IDVariable && medidas[a].Cita == idCita) {
                valores[b][valores[b].length - 1] = (valores[b][valores[b].length - 1] + medidas[a].Valor) / 2;
            }
        }
        idCita = medidas[a].Cita;
        console.log(idCita);
    }
    
    let valoresGrafica = valores[variable - 1];
    let etiquetasGrafica = etiquetasUnicas.map((e) => { return `Cita ${e}` })
    console.log(etiquetasGrafica);
    console.log(valoresGrafica);
    
    let data = {
        labels: etiquetasGrafica,
        datasets: [{
            label: tipos[variable - 1].Nombre,
            data: valoresGrafica,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        }]
    };
    let config = {
        type: 'line',
        data: data,
        options: {}
    }
    let grafica = new Chart(
        document.getElementById('graficaPaciente'),
        config
    );
    return respuesta;
}

async function actualizarTratamiento() {
    //esta funcion obtiene los datos que se muestran en el menu de tratamiento y los envia al servidor para que se guarden en la base de datos
    let url = `/api/enfermero/:id/actualizarTratamiento/${idPacienteCita}/${document.getElementById("medicamentoSeleccionado").value}/${idCitaActual}?token=${crendenciales}`
    let datos = {
        medicamento: document.getElementById("medicamentoSeleccionado").value,
        indicaciones: document.getElementById("recomendacionesMedicamento").value,
        cantidad: document.getElementById("posologiaMedicamento").value,
        intervalo: document.getElementById("intervaloTomas").value,
        fechaInicio: document.getElementById("fechaInicioMedicacion").value,
        fechaFin: document.getElementById("fechaFinMedicacion").value
    }
    console.log(datos);
    
    datos.intervalo = datos.intervalo.substring(0, datos.intervalo.length - 5)
    let peticion = {
        method: 'PUT',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let respuesta = await peticionREST(url, peticion)
    if (respuesta.serverStatus == 2) {
        document.getElementById('statusActualizarTratamiento').style.color = "green";
        document.getElementById('statusActualizarTratamiento').innerHTML = "Tratamiento actualizado";
        setTimeout(() => {
            document.getElementById('statusActualizarTratamiento').innerHTML = "";
        }, 2000);
    } else {
        document.getElementById('statusActualizarTratamiento').style.color = "red";
        document.getElementById('statusActualizarTratamiento').innerHTML = "Error al actualizar el tratamiento";
        setTimeout(() => {
            document.getElementById('statusActualizarTratamiento').innerHTML = "";
        }, 2000);
    }
}

function prescribirMedicamento() {
    solicitarPrescripcion(idCitaActual);
}



//funciones para crear medicamentos y variables de las mediciones
function pantallaMantenimientoCita(){
    metaUnidades.splice(0,metaUnidades.length)
    metaAbreviaturas.splice(0,metaAbreviaturas.length)
    metaRangosMax.splice(0,metaRangosMax.length)
    metaRangosMin.splice(0,metaRangosMin.length)
    document.getElementById('listaUnidadesVariable').innerHTML = ""
    document.getElementById('creacionVariable').reset();
    document.getElementById('formMedicamentoSeleccionado').reset();
    document.getElementById('nomMedicamento').value = ""
    cambiarPantalla('mantenimientoCita')
}
var metaUnidades = []
var metaAbreviaturas = []
var metaRangosMax = []
var metaRangosMin = []

function addUnidad(){
    let unidad = document.getElementById('unidadesVariable').value
    let abreviatura = document.getElementById('abreviaturaUnidad').value
    let maxU = document.getElementById('rangoHabitualMax').value
    let minU = document.getElementById('rangoHabitualMin').value
    maxU = maxU.replace(',','.')
    minU = minU.replace(',','.')
    console.log(maxU)
    console.log(minU)
    metaUnidades.push(unidad)
    metaAbreviaturas.push(abreviatura)
    metaRangosMax.push(maxU)
    metaRangosMin.push(minU)

    let li = `<li id="LI${abreviatura}">${unidad} - ${abreviatura} - (${maxU}:${minU}) <button type="button" onclick="borrarUnidad('${abreviatura}')">❌</button></li>`;
    document.getElementById('listaUnidadesVariable').innerHTML += li
}

function borrarUnidad(abreviatura){
    let lista = document.getElementById('listaUnidadesVariable');
    let IDFila = `LI${abreviatura}`
    let fila = document.getElementById(IDFila);
    lista.removeChild(fila);

    for(let a = 0; a<metaUnidades.length; a++){
        if(abreviatura == metaAbreviaturas[a]){
            metaUnidades.splice(a,1)
            metaAbreviaturas.splice(a,1)
            metaRangosMax.splice(a,1)
            metaRangosMin.splice(a,1)
            break;
        }
    }
}

async function crearVariable(){
    //obtencion de datos de la variable
    let nombreVariable = document.getElementById('nombreVariable').value;
    let datosVariable = [metaUnidades, metaAbreviaturas, metaRangosMax, metaRangosMin];
    //enviado de datos a servidor
    let datos = {nombre:nombreVariable, datosVariable: datosVariable}
    let url = `/api/enfermero/:id/createVariable?token=${crendenciales}`
    let peticionServer = {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    //procesado de la respuesta
    let respuesta = await peticionREST(url, peticionServer)
    console.log(respuesta);
    if (respuesta.toString() == "Variable creada") {
        alert("Variable creada")
        pantallaMantenimientoCita()
    }
    console.log(respuesta)
}

var unidades = []
async function getTiposVariables({select}){
    let url = `/api/enfermero/:id/getTiposVariables?token=${crendenciales}`
    let peticion = {
        method : "GET"
    }
    let respuesta = await peticionREST(url, peticion)
    let tipos = respuesta[0]
    unidades = respuesta[1]
    let selectTipo = document.getElementById(`${select}`)
    selectTipo.innerHTML = '<option hidden selected value="placeholderVariable">Escoge un parámetro</option>'
    for (let a = 0; a < tipos.length; a++) {
        let option = document.createElement('option')
        option.setAttribute('id',`VAR${tipos[a].IDVariable}`)
        option.setAttribute('value',`${tipos[a].IDVariable}`)
        option.innerHTML = `${tipos[a].Nombre}`
        selectTipo.appendChild(option);
    }
}
document.getElementById('tipoVariable').addEventListener('change', ()=>{
    let tipo = document.getElementById('tipoVariable').value
    let abreviatura = document.getElementById('unidadVariable')
    abreviatura.innerHTML = ""
    for (let a = 0; a < unidades.length; a++) {
        if(unidades[a].IDVariable == tipo){
            let option = document.createElement('option')
            option.setAttribute('id',`U${unidades[a].Abreviatura}`)
            option.setAttribute('value',`${unidades[a].Abreviatura}`)
            option.innerHTML = `${unidades[a].Abreviatura}`
            abreviatura.appendChild(option)
        }
    }
})







function debugg(paso) {
    console.log(`Paso realizado ${paso}`);
}







//AUTOCOMPLETE
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
} 

autocomplete(document.getElementById("nombrePacienteCita"), listaPacientes);

autocomplete(document.getElementById("nombreEnfermeroCita"), listaEnfermeros);

autocomplete(document.getElementById('farmaco'), listaFarmacos);

autocomplete(document.getElementById('farmacoE'), listaFarmacos);



let medicamentoSeleccionado;
let medicamentos = [];
//IMPLEMENTACION DE API REST CIMA
async function buscarMedicamento() {
    let nombre = document.getElementById('nomMedicamento').value;   //nombre del medicamento pasado por el user
    let prAct = document.getElementById('prActMed').value;          //principio activo del medicamento pasado por el user
    let listaEncontrados = document.getElementById('listaMedicamentosEncontrados');
    let url1 = `https://cima.aemps.es/cima/rest/medicamentos?nombre=${nombre}&comerc=1`;
    let url2 = `https://cima.aemps.es/cima/rest/medicamentos?practiv1=${prAct}&comerc=1`;
    let url3 = `https://cima.aemps.es/cima/rest/medicamentos?nombre=${nombre}&practiv1=${prAct}&comerc=1`;
    let peticion = {
        method: 'GET'
    }
    let url = nombre === "" ? url2 : url1
    url = nombre != "" && prAct != "" ?  url3 : url
    let respuestaCIMA = await peticionREST(url, peticion)
    let numeroResultados = respuestaCIMA.totalFilas; //indica la cantidad de medicamentos que cumplen los parametros de busqueda
    let resultados = respuestaCIMA.resultados; // aqui se almacenan todos los medicamentos y sus datos
    if (numeroResultados == 0) {
        console.log("no hay resultados");
        //COMPRUEBA QUE SE HAYAN ENCONTRADO RESULTADOS
        listaEncontrados.innerHTML += `<li style="color:red">No se han encontrado resultados</li>`;
        setTimeout(() => {
            listaEncontrados.innerHTML = "";
        }, 5000)
        return
    } else {
        console.log(resultados);
        medicamentos = resultados.map(
            resultado => new Medicamento({ nombre: resultado.nombre, prAct1: resultado.vtm.nombre, formFarm: resultado.formaFarmaceuticaSimplificada.nombre, dosis: resultado.dosis, fotoCaja: resultado.fotos?.[0].url, fotoForma: resultado.fotos?.[1]?.url, viaAdmin: resultado.viasAdministracion[0].nombre, nRegistro: resultado.nregistro, fichaTecnica: resultado.docs[0]?.url })
        )
        listaEncontrados.innerHTML = "";
        for (let i = 0; i < medicamentos.length; i++) {
            let elementoLista = `<li id="${medicamentos[i].nRegistro}" onclick="seleccionarMedicamento('${medicamentos[i].nRegistro}')">${medicamentos[i].nombre}</li>`;
            listaEncontrados.innerHTML += elementoLista;
        } 
    }       
}

function seleccionarMedicamento(nRegistro) {
    /*Permite al usuario ver la informacion mas importante del medicamento seleccionado */
    document.getElementById("datosMedSeleccionado").style.display = "grid";
    medicamentoSeleccionado = medicamentos.find(medicamento => medicamento.nRegistro === nRegistro);
    document.getElementById('nomSeleccion').value = medicamentoSeleccionado.nombre;
    document.getElementById('prActSeleccion').value = medicamentoSeleccionado.prAct1;
    document.getElementById('formFarmSeleccion').value = medicamentoSeleccionado.formFarm;
    document.getElementById('dosisSeleccion').value = medicamentoSeleccionado.dosis;
    document.getElementById('viaAdminSeleccion').value = medicamentoSeleccionado.viaAdmin;
    document.getElementById('imgCajaSeleccion').src = medicamentoSeleccionado.fotoCaja || "";
    document.getElementById('imgFormaSeleccion').src = medicamentoSeleccionado.fotoForma|| "";
    document.getElementById('nRegistroSeleccion').value = medicamentoSeleccionado.nRegistro;
    document.getElementById('linkFT').href = medicamentoSeleccionado.fichaTecnica;
}
function undoSelectMedicamento() {
    /*Permite al usuario deseleccionar el medicamento seleccionado */
    //hacer invisible la seccion con id "datosMedSeleccionado"
    document.getElementById('datosMedSeleccionado').style.display = "none";
    //poner el valor de los campos de texto a vacio
    document.getElementById('nomSeleccion').value = "";
    document.getElementById('prActSeleccion').value = "";
    document.getElementById('formFarmSeleccion').value = "";
    document.getElementById('dosisSeleccion').value = "";
    document.getElementById('viaAdminSeleccion').value = "";
    document.getElementById('imgCajaSeleccion').src = "";
    document.getElementById('imgFormaSeleccion').src = "";
    document.getElementById('nRegistroSeleccion').value = "";
    document.getElementById('linkFT').href = "";
}

async function registrarMedicamento() {
    console.log("medicamento enviado a la base de datos");
    let rEmb = document.getElementById('rEmbarazo').checked;
    let rLac = document.getElementById('rLactancia').checked;
    rEmb ? rEmb = 1 : rEmb = 0;
    rLac ? rLac = 1 : rLac = 0;

    let fotoCaja = document.getElementById('imgCajaSeleccion').src;
    let fotoForma = document.getElementById('imgFormaSeleccion').src;
    fotoCaja ? fotoCaja = fotoCaja : fotoCaja = "";
    fotoForma ? fotoForma = fotoForma : fotoForma = "";

    let datosMedicamento = {
        nombre: document.getElementById('nomSeleccion').value,
        prAct1: document.getElementById('prActSeleccion').value,
        formFarm: document.getElementById('formFarmSeleccion').value,
        dosis: document.getElementById('dosisSeleccion').value,
        viaAdmin: document.getElementById('viaAdminSeleccion').value,
        fotoCaja: fotoCaja,
        fotoForma: fotoForma,
        nRegistro: document.getElementById('nRegistroSeleccion').value,
        rEmbarazo: rEmb,
        rLactancia: rLac
    };
    
    let url = `/api/admin/:id/registrarMedicamento?token=${crendenciales}`;
    let peticion = {
        method: 'POST',
        body: JSON.stringify(datosMedicamento),
        headers: {
            "content-type": "application/json"
        }
    }
    console.log(peticion);
    let respuestaServer = await peticionREST(url, peticion);
    console.log(respuestaServer);

    if (respuestaServer.serverStatus === 2) {
        console.log("Medicamento registrado");
        undoSelectMedicamento();
    }
}



////////////////////
//SISTEMA EXPERTO///
///////////////////

async function solicitarPrescripcion(idCitaActual) {

    // let datosPaciente = {
    //     enfPrin: ,
    //     edad: ,
    //     sexo: ,
    //     emb: ,
    //     lact: ,
    //     tratAct: ,
    //     enfPrev: ,
    //     varMed: 
    // }
    document.getElementById('medicamentoSeleccionado').value = "placeHolderMedicamento";
    let url = `/api/enfermero/:id/solicitarPrescripcion/${idCitaActual}?token=${crendenciales}`;

    let peticion = {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    }
    let respuesta = await peticionREST(url, peticion); //este es el tratamiento obtenido del SE
    if (respuesta == 500) {
        document.getElementById("recomendacionesMedicamento").innerHTML = "NO SE HAN ENCONTRADO TRATAMIENTOS COMPATIBLES PARA EL ESTADO DEL PACIENTE"
        document.getElementById("recomendacionesMedicamento").style.color = "red";
    } else {
        try {
            let desplegable = document.getElementById("medicamentoSeleccionado");
            desplegable.innerHTML = "<option hidden selected value='placeHolderMedicamento'>Escoge un medicamento</option>";
            for (let i = 0; i < respuesta.medicamento.length; i++) {
                let option = document.createElement("option");
                option.value = respuesta.medicamento[i].IDFarmaco;
                option.text = respuesta.medicamento[i].Nombre;
                desplegable.appendChild(option);
                desplegable.value = respuesta.medicamento.IDFarmaco;
            }
            if (respuesta.medicamento.length === 1) { 
                document.getElementById("medicamentoSeleccionado").options[0].removeAttribute("selected");
                let option = document.getElementById("medicamentoSeleccionado").options[1];
                option.selected = true;

            }
            document.getElementById("posologiaMedicamento").value = respuesta.dosis;
            document.getElementById("intervaloTomas").value = `${respuesta.frecuencia} horas`;
            document.getElementById("recomendacionesMedicamento").innerHTML = respuesta.indicaciones;

            document.getElementById("recomendacionesMedicamento").style.color = "black";

            document.getElementById("fechaInicioMedicacion").valueAsDate = new Date(respuesta.fechaInicio);
            document.getElementById("fechaFinMedicacion").valueAsDate = new Date(respuesta.fechaFin);
        } catch (e) {
            console.log(e);
        }
    }

    

}
document.getElementById("fechaInicioMedicacion").addEventListener("change", () => {
    console.log(document.getElementById("fechaInicioMedicacion").value);
});