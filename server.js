
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

async function getIDTest(){
    let pet1 = `SELECT * FROM Test`
    baseDatos.query(pet1, (err,respuesta) => {
        if(err){
            res.status(502).json('Fallo con la base de datos.'+ err)
            return;
        }
        let IDPush;
        if(respuesta.length == 0){
            IDPush = 1;
        }else{
            IDPush = respuesta[respuesta.length-1].IDTest + 1;
        }
        return IDPush;
    })
}


app.post("/api/admin/:id/crearTest", (req,res) => {
    let datosTest = req.body;
    let tipo = datosTest.tipo; let fechaCreacion = datosTest.fechaCreacion; let preguntas = datosTest.preguntas;
    let IDPush = await getIDTest();
    console.log(IDPush);
    // let petPush1 = `INSERT INTO Test (IDTest, Tipo, FechaCreacion) VALUES (${IDPush}, ${tipo}, ${fechaCreacion})`;
    // baseDatos.query(petPush1, (err,respuesta) => {
    //     if(err){
    //         res.status(502).json('Fallo con la base de datos.'+ err)
    //         return;
    //     }
    //     console.log('Test insertado');
    // })
    // console.log('Se van a insertar las preguntas');
    // for(let a = 0; a < preguntas.length; a++){
    //     let petPush2 = `INSERT INTO PreguntasTest (IDTest, IDPregunta) VALUES (${IDPush},${preguntas[a]})`
    //     baseDatos.query(petPush2, (err,respuesta) => {
    //         if(err){
    //             res.status(502).json('Fallo con la base de datos');
    //             return;
    //         }else{
    //             console.log('Pregunta asignada al test');
    //         }
    //     })
    // }
    // res.status(200).json('Test creado con exito');
})


//RELLENADO MONITOR RENDIMIENTO
//Obtencion de ciclos de test
app.get("/api/enfermero/:id/getCiclos", function(req, res){

})

//INICIO DEL SERVIDOR
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});