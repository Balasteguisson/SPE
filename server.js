
//requires
var express = require("express");
const mysql = require('mysql')
var morgan = require('morgan');




var app = express();


app.use('/enfermero', express.static('enfermero'));
app.use(express.json());
app.use(morgan('dev'));


//Ajustes

app.set('port',8080);
app.set('portDB', 3306); //ajustar esto mas tarde

//Conexion a BBDD
const database ={
    //datos de la base
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bbddSPE',
    port: app.get('portDB')
}

var baseDatos = mysql.createConnection(database);
baseDatos.connect(function (err) {
    if (err) {
        console.error('Fallo en la conexión a la BBDD', err);
        process.exit();
    }
    // console.log('Base de datos conectada');
    
})

//Funciones
//LOGIN
app.post('/api/enfermero/login',(req,res) => {
    var user = req.body.login;
    var password = req.body.password;
    var petUser = 'SELECT * FROM Usuarios';

    baseDatos.query(petUser, (err, users)=>{
        if(err){
            res.status(404).json('La peticion ha fallado');
        }
        for (let i = 0; i < users.length; i++) {
            if(user == users[i].Usuario && password == users[i].Password){
                let datos = {usuario: users[i].Usuario, pass: users[i].Password, id: users[i].ID, permisos: users[i].Tipo};
                // console.log(datos); debug
                res.status(201).json(datos);
                return;
            }
            res.status(403);
        }
        
    })
});

//DATOS DEL ENFERMERO
app.get('/api/enfermero/:id', function (req,res){
    var idEnfermero = req.params.id;
    var petDatos = `SELECT * FROM DatosUsuarios WHERE IDUsuario = '${idEnfermero}'`;
    baseDatos.query(petDatos, (err,datos)=>{
        if(err){
            res.status(404).json('Peticion BBDD fallida');
        }
        res.status(201).json(datos[0]);
    })
})

//CITAS PENDIENTES DEL ENFERMERO
app.get('/api/enfermero/:dni/citas', function (req, res){
    var dniEnfermero = req.params.dni;
    var idEnfermero;
    var petId = `SELECT * FROM Enfermero WHERE DNI = "${dniEnfermero}"`;
    baseDatos.query(petId, (err, datos)=> {
        if(err){
            res.status(404).json('Peticion BBDD fallida');
        }
        idEnfermero = datos[0].ID;
        var petDatos = `SELECT * FROM Cita WHERE (IDEnfermero =${idEnfermero}) AND (Realizada = 0)`;
        baseDatos.query(petDatos, (err,datos)=>{
            if(err){
                res.status(404).json('Peticion BBDD fallida');
            }
            res.status(201).json(datos);
        })
    })
})

//RESULTADO DE LOS TEST- MENU ENFERMERO
app.get('/api/enfermero/:dni/resultados', function (req,res){
    //tengo que ver como hago para que se muestren solamente los test del ciclo actual
    var dniEnfermero = req.params.dni;
    var idEnfermero;
    var petId = `SELECT * FROM Enfermero WHERE DNI = "${dniEnfermero}"`;
    baseDatos.query(petId, (err, datos) =>{
        if(err){
            res.status(404).json('Peticion BBDD fallida');
        }
        idEnfermero = datos[0].ID;
        var petTest = `SELECT * FROM EnfermeroTest WHERE IDEnfermero = ${idEnfermero}`;
        baseDatos.query(petTest,(err,datos)=>{
            if(err){
                res.status(404).json('Peticion BBDD fallida');
            }
            res.status(201).json(datos);
        })
    })
})

// CREACION DE PREGUNTA
app.post("/api/enfermero/:id/addPregunta", function(req, res){
    var id = req.params.id;
    var datos = req.body;
    var addPregunta = `INSERT INTO Preguntas (IDPregunta, Tipo, Pregunta, FechaCreacion, Respuesta1, Respuesta2, Respuesta3, Respuesta4, RespuestaCorrecta) VALUES (NULL, "${datos.tipo}", "${datos.pregunta}", "${datos.fechaCreacion}", "${datos.respuesta1}", "${datos.respuesta2}", "${datos.respuesta3}", "${datos.respuesta4}", "${datos.respuestaCorrecta}");`
    // console.log(datos);
    // console.log(addPregunta);
    if(datos.tipo == '' || datos.pregunta == '' || datos.fechaCreacion == '' || datos.respuestaCorrecta == ''){
        res.status(400).json('Introduce bien los datos');
        return;
    }
    baseDatos.query(addPregunta, function(err,respuesta){
        if(err){
            res.status(502).json('Fallo en la BBDD');
            return;
        }
        res.status(201).json('Entrada añadida a la BBDD');
    });
});
//RELLENADO BANCO PREGUNTAS
app.get("/api/admin/:id/getPreguntas", (req,res)=>{
    var peticion = "SELECT * FROM Preguntas";
    baseDatos.query(peticion, (err,datos)=>{
        if(err){
            res.status(502).json('Fallo en la BBDD');
            return;
        };
        res.status(201).json(datos);
    });
});


//GET PARA OBTENER DATOS DE UNA PREGUNTA, USADO EN EDITAR PREGUNTA
app.get("/api/admin/:id/getPregunta/:IDPregunta", (req,res) => {
    var peticion = `SELECT * FROM Preguntas WHERE IDPregunta = '${req.params.IDPregunta}'`
    baseDatos.query(peticion, (err,datos)=>{
        if(err){
            res.status(502).json('Fallo en la BBDD');
            return;
        };
        res.status(201).json(datos);
    })
})

//EDITADO DE PREGUNTA
app.put("/api/admin/:id/editPregunta/:IDPregunta", (req,res) => {
    let datos = req.body;
    let petPut = `UPDATE Preguntas SET Tipo = '${datos.tipo}', Pregunta = '${datos.pregunta}', FechaCreacion = '${datos.fechaCreacion}', Respuesta1 = '${datos.respuesta1}', Respuesta2 = '${datos.respuesta2}', Respuesta3 = '${datos.respuesta3}', Respuesta4 = '${datos.respuesta4}', RespuestaCorrecta = '${datos.respuestaCorrecta}' WHERE IDPregunta = '${datos.IDPregunta}'`;
    
    baseDatos.query(petPut,(err,respuesta) => {
        if(err){
            res.status(502).json("Fallo en la base de datos");
            return;
        }
        res.status(200).json('Pregunta editada correctamente');
    })
})

//BORRADO DE PREGUNTA
app.delete("/api/admin/:id/deletePregunta/:IDPregunta", (req,res) => {
    let petDelete = `DELETE from Preguntas where IDPregunta = '${req.params.IDPregunta}'`;
    baseDatos.query(petDelete, (err,respuesta) => {
        if(err){
            res.status(502).json(`Fallo con la base de datos. Respuesta: ${res}`);
            return;
        }
        res.status(200).json(`Pregunta ${req.params.IDPregunta} borrada.`)
    })
    // let petAI = `ALTER TABLE Preguntas AUTO_INCREMENT = ${lastID}`;
})

//CREACION DE TEST
app.get("/api/admin/:id/getPreguntas/:modalidad", (req,res) => {
    let petGet = `SELECT * from Preguntas where Tipo ='${req.params.modalidad}'`;
    baseDatos.query(petGet, (err,respuesta) => {
        if(err){
            res.status(502).json('Fallo con la base de datos.'+ err)
            return;
        }
        res.status(200).json(respuesta);
    })
})


app.get("/api/admin/:id/getIdTest", (req,res) => {
    let pet1 = `SELECT * FROM Test`
    baseDatos.query(pet1, (err,respuesta) => {
        if(err){
            res.status(502).json('Fallo con la base de datos.'+ err)
            return;
        }
        let IDtest;
        if(respuesta.length == 0){
            IDtest = 1;
        }else{
            IDtest = respuesta[respuesta.length-1].IDTest + 1;
        }
        res.status(201).json(IDtest);
    })
})

app.post("/api/admin/:id/crearTest", (req,res) => {
    let datosTest = req.body;
    let IDTest = datosTest.idTest;
    console.log(IDTest);
    let tipo = datosTest.tipo; let fechaCreacion = datosTest.fechaCreacion;
    let petPush1 = `INSERT INTO Test (IDTest, Tipo, FechaCreacion) VALUES (${IDTest}, "${tipo}", "${fechaCreacion}")`;
    console.log(petPush1);
    baseDatos.query(petPush1, (err,respuesta) => {
        if(err){
            res.status(502).json('Fallo con la base de datos.'+ err)
            return;
        }
        res.status(201).json(IDTest);
    })
})

app.post("/api/admin/:id/addPreguntas", (req,res) => {
    let datos = req.body;
    let IDTest = datos.IDTest;
    let preguntas = datos.preguntas;
    for(let a = 0; a < preguntas.length; a++){
        //el bucle inserta pregunta a pregunta en la tabla que relaciona el test con las preguntas
        let petPush2 = `INSERT INTO PreguntasTest (IDTest, IDPregunta) VALUES ("${IDTest}", "${preguntas[a]}")`
        console.log(petPush2)
        baseDatos.query(petPush2, (err,respuesta) => {
            if(err){
                console.log('Entrando a error');
                console.log(err);
                res.status(502).json('Fallo con la base de datos');
                return;
            }
        })
    }
    console.log("Test bien creado");
    res.status(201).json(`Test creado con exito, tiene ${preguntas.length} preguntas`);
})

//REGISTRO DE ENFERMERO
app.post("/api/admin/:id/registrarEnfermero", (req,res) => {
    let datos = req.body;
    let petBBDD = `INSERT INTO`
    baseDatos.query()
})

//REGISTRO ADMINISTRADOR
app.post("/api/admin/:id/registrarAdmin", (req,res) => {
    let datos = req.body;
    let petBBDD1 = `INSERT INTO Usuarios ("ID", "Usuario", "Password", "Tipo") VALUES (NULL, 'admin2', 'admin2', 'administrador')`;
    
})

//REGISTRO PACIENTE

app.post("/api/admin/:id/nuevoPaciente", (req,res) =>{
    //crea el paciente y devuelve el ID que le ha generado
    let datos = req.body;
    var info = datos.info; //0-nombre, 1-apellidos, 2-dni/pasaporte, 3-fechaNacimiento, 4-sexo, 5-peso, 6-talla
    var alergias = datos.alergias;
    var patologias = datos.patologias;
    var tratamientos = datos.tratamientos;
    //insert del paciente
    let petBBDDpaciente = `INSERT INTO Pacientes (NIdentidad, Nombre, Apellidos, FechaNacimiento, Sexo, Talla, Peso) VALUES ('${info[2]}', '${info[0]}', '${info[1]}', '${info[3]}', '${info[4]}', '${info[6]}', '${info[5]}');`
    baseDatos.query(petBBDDpaciente, (err) => {
        if(err){
            console.log(err)
            res.status(502).json('Fallo con la base de datos.'+ err);
            return;
        }
    })
    //insert de alergias
    for (let a = 0; a < alergias.length; a++) {
        let alergia = alergias[a];
        let petBBDDalergia = `INSERT INTO Alergias (IDAlergia, IdPaciente, Alergeno) VALUES (NULL, '${info[2]}', '${alergia}');`
        baseDatos.query(petBBDDalergia, (err) =>{
            if(err){
                console.log(err)
                console.log("Error en alergias")
                res.status(502).json('Fallo con la base de datos.'+ err);
                return;
            }
        }) 
    }
    //insert de patologias
    for (let a = 0; a < patologias.length; a++) {
        let patologia = patologias[a];
        let activa;
        let fechaFin;
        let petBBDDpatologia;
        patologia[1] == "ACTIVA" ? (activa = 1):(activa = 0, fechaFin = patologia[3]);
        activa == 1 ? 
        (petBBDDpatologia = `INSERT INTO PatologiasPrevias (IDPatologia, IdPaciente, Nombre, Descripcion, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${patologia[0]}', '${patologia[4]}', '${activa}', '${patologia[2]}', NULL);`):
        (petBBDDpatologia = `INSERT INTO PatologiasPrevias (IDPatologia, IdPaciente, Nombre, Descripcion, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${patologia[0]}', '${patologia[4]}', '${activa}', '${patologia[2]}', '${fechaFin}');`);
        baseDatos.query(petBBDDpatologia,(err)=>{
            if(err){
                console.log(err)
                console.log("Error en patologia")
                res.status(502).json('Fallo con la base de datos.'+err);
                return;
            }
        })
    }
    //insert de tratamientos
    for(let a = 0; a< tratamientos.length; a++){
        let tratamiento = tratamientos[a];
        let petBBDDtratamiento = `INSERT INTO Tratamiento (IDTratamiento, IdPaciente, IDFarmaco,Farmaco, FechaInicio, FechaFin, IntervaloTomas, Cantidad, Anotaciones, EfectosSecundarios, IDCita) VALUES (NULL, '${info[2]}',NULL,'${tratamiento[0]}','${tratamiento[1]}', '${tratamiento[2]}', NULL, NULL, NULL, NULL, NULL);`
        baseDatos.query(petBBDDtratamiento,(err)=>{
            if(err){
                console.log(err)
                console.log("Error en tratamiento")
                res.status(502).json('Fallo con la base de datos.'+err);
                return;
            }
        })
    }
    //insert de embarazo y lactancia
    if(info[4] == "F"){
        let embarazos = datos.embarazos;
        let lactancia;
        // 0 activo 1 fechainicio 2 fechafin
        for (let a = 0; a < embarazos.length; a++) {
            let embarazo = embarazos[a];
            let activo;
            embarazo[0] == "ACTIVO" ? (activo = 1):(activo = 0)
            let petBBDDembarazo = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${activo}', '${embarazo[1]}', '${embarazo[2]}');`;
            baseDatos.query(petBBDDembarazo, (err)=>{
                if(err){
                    console.log(err)
                    console.log("Error en embarazo")
                    res.status(502).json('Fallo con la base de datos.'+err);
                    return;
                }
            })  
        }

        datos.lactancia == "SI" ? (lactancia = 1):(lactancia = 0);
        let petBBDDlactancia = `INSERT INTO Lactancia (IDLactancia, IdPaciente, Activa) VALUES (NULL, '${info[2]}', '${lactancia}');`;
        baseDatos.query(petBBDDlactancia, (err)=>{
            if(err){
                console.log(err)
                console.log("Error en lactancia")
                res.status(502).json('Fallo con la base de datos.'+err);
                return;
            }
        })
    }
    //si llega hasta aqui puedes celebrar
    res.status(201).json('Paciente creado en la BBDD');

})



//RELLENADO MONITOR RENDIMIENTO
//Obtencion de ciclos de test
app.get("/api/enfermero/:id/getCiclos", function(req, res){

})

//INICIO DEL SERVIDOR
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});