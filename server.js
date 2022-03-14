
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
app.post('/api/login',(req,res) => {
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
// app.get('/api/enfermero/:dni/citas', function (req, res){
//     var dniEnfermero = req.params.dni;
//     var idEnfermero;
//     var petId = `SELECT * FROM Enfermero WHERE DNI = "${dniEnfermero}"`;
//     baseDatos.query(petId, (err, datos)=> {
//         if(err){
//             res.status(404).json('Peticion BBDD fallida');
//         }
//         idEnfermero = datos[0].ID;
//         var petDatos = `SELECT * FROM Cita WHERE (IDEnfermero =${idEnfermero}) AND (Realizada = 0)`;
//         baseDatos.query(petDatos, (err,datos)=>{
//             if(err){
//                 res.status(404).json('Peticion BBDD fallida');
//             }
//             res.status(201).json(datos);
//         })
//     })
// })

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
    let petPush1 = `INSERT INTO Test (IDTest, Tipo, FechaCreacion, Periodo) VALUES (${IDTest}, "${tipo}", "${fechaCreacion}", "${datosTest.periodo}")`;
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
        baseDatos.query(petPush2, (err,respuesta) => {
            if(err){
                console.log('Entrando a error');
                console.log(err);
                res.status(502).json('Fallo con la base de datos');
                return;
            }
        })
    }
    res.status(201).json(`Test creado con exito, tiene ${preguntas.length} preguntas`);
})

//REGISTRO DE ENFERMERO
app.post("/api/admin/:id/registrarEnfermero", (req,res) => {
    let datos = req.body;
    console.log(datos);
    let petBBDD = `INSERT INTO Usuarios (ID, Usuario, Password, Tipo) VALUES (NULL, '${datos.dni}','${datos.fechaNacimiento}', 'enfermero')`
    let petBBDDenfermero = `INSERT INTO Enfermero (ID, DNI, Nombre, Apellidos) VALUES (NULL, '${datos.dni}', '${datos.nombre}', '${datos.apellidos}')`
    console.log(petBBDD)
    baseDatos.query(petBBDD, (err,respuesta) => {
        var idCreado;
        err ? (res.status(502).json("Fallo en la base de datos"+err)) :(idCreado = respuesta.insertId);
        let petBBDD2 = `INSERT INTO DatosUsuarios (ID, IDUsuario, Nombre, Apellidos, DNI, IDFoto, FechaNacimiento, EmailContacto) VALUES (NULL, '${idCreado}', '${datos.nombre}', '${datos.apellidos}','${datos.dni}',NULL, '${datos.fechaNacimiento}', '${datos.email}')`
        baseDatos.query(petBBDD2, (err,respuesta2) => {
            let respuesta;
            err ? (res.status(502).json("Fallo en la base de datos"+err)) : (respuesta = respuesta2);
            baseDatos.query(petBBDDenfermero, (err,respuesta3) => {
                err ? (res.status(502).json("Fallo en la base de datos"+err)) : (res.status(201).json("Enfermero creado"));
            })
        })
    })
    
})

//LISTADO ENFERMEROS
app.get("/api/admin/:id/getEnfermeros", (req,res) => {
    let petBBDD = `SELECT * FROM Enfermero`
    baseDatos.query(petBBDD, (err,respuesta) => {
        err ? (res.status(501).json("Error en BBDD" + err)) : (res.status(201).json(respuesta))
    })
})

app.delete("/api/admin/:id/deleteEnfermero/:dniEnfermero", (req,res) => {
    let petBBDD = `DELETE FROM Enfermero WHERE DNI ='${req.params.dniEnfermero}'`
    console.log(petBBDD)
    baseDatos.query(petBBDD, (err,respuesta) =>{
        err ? (res.status(502).json("Error con BBDD"+ err)) : (res.status(201).json(respuesta))
    })
})

app.get("/api/admin/:id/getEnfermero/:dniEnfermero", (req,res) => {
    let petBBDD = `SELECT * FROM DatosUsuarios WHERE DNI='${req.params.dniEnfermero}';`;
    baseDatos.query(petBBDD, (err,respuesta) => {
        
        err ? (res.status(502).json(err)) : (res.status(201).json(respuesta));
    })
})

app.put("/api/admin/:id/editarEnfermero/:dniEnfermero", (req,res) => {
    let dniEnfermero = req.params.dniEnfermero
    let datosEnfermero = req.body
    let petBBDD = `UPDATE DatosUsuarios SET DNI ='${datosEnfermero.dni}', Nombre ='${datosEnfermero.nombre}', Apellidos ='${datosEnfermero.apellidos}', FechaNacimiento='${datosEnfermero.fechaNacimiento}', IDFoto =${datosEnfermero.idFoto}, EmailContacto='${datosEnfermero.email}' WHERE DNI ='${dniEnfermero}'`;
    baseDatos.query(petBBDD, (err,respuesta) => {
        if (err){
            res.status(502).json("Error en BBDD" + err)
        }else{
            let petBBDD2 = `UPDATE Enfermero SET DNI='${datosEnfermero.dni}', Nombre='${datosEnfermero.nombre}', Apellidos='${datosEnfermero.apellidos}' WHERE DNI='${dniEnfermero}'`;
            baseDatos.query(petBBDD2, (err2,respuesta2) => {
                err2 ? (res.status(502).json("Error en BBDD" + err)) : (res.status(201).json(respuesta2))
            })
        }
    })
    
})

//REGISTRO ADMINISTRADOR
app.post("/api/admin/:id/registrarAdmin", (req,res) => {
    let datos = req.body;
    let petBBDD1 = `INSERT INTO Usuarios ("ID", "Usuario", "Password", "Tipo") VALUES (NULL, 'admin2', 'admin2', 'administrador')`;
    
})

//REGISTRO Y EDICION DE PACIENTE

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
        console.log("han llegado embarazos " + embarazos.length)
        for (let a = 0; a < embarazos.length; a++) {
            let embarazo = embarazos[a];
            let activo;
            let petBBDDembarazo;
            embarazo[0] == "ACTIVO" ? (activo = 1):(activo = 0)
            activo == 1 ? (petBBDDembarazo = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${activo}', '${embarazo[1]}', NULL);`):( petBBDDembarazo = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${activo}', '${embarazo[1]}', '${embarazo[2]}');`);
            console.log(petBBDDembarazo);

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

app.get("/api/admin/:id/getPacientes", (req,res) => {
    let petBBDD = "SELECT * FROM Pacientes";
    baseDatos.query(petBBDD, (err,respuesta) => {
        if(err){
            console.log(err)
            res.status(502).json('Fallo con la base de datos.'+err);
            return;
        }
        res.status(201).json(respuesta);
    })
})

app.get("/api/admin/:id/getPaciente/:idPaciente", (req,res) => {
    let petBBDD = `SELECT * FROM Pacientes WHERE NIdentidad = '${req.params.idPaciente}'`
    baseDatos.query(petBBDD, (err,respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})
app.get("/api/admin/:id/getAlergiasPaciente/:idPaciente", (req,res) => {
    let petAlergias = `SELECT * FROM Alergias WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petAlergias, (err,respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})

app.get("/api/admin/:id/getPatPreviasPaciente/:idPaciente", (req,res) => {
    let petPatPrev = `SELECT * FROM PatologiasPrevias WHERE IdPaciente = '${req.params.idPaciente}'` 
    baseDatos.query(petPatPrev, (err,respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})

app.get("/api/admin/:id/getTratamientosPaciente/:idPaciente", (req,res) => {
    let petTratamiento = `SELECT * FROM Tratamiento WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petTratamiento, (err,respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})
app.get("/api/admin/:id/getEmbarazosPaciente/:idPaciente", (req,res) => {
    let petEmbarazos = `SELECT * FROM Embarazo WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petEmbarazos, (err,respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})
app.get("/api/admin/:id/getLactanciaPaciente/:idPaciente", (req,res) => {
    let petLactancia = `SELECT * FROM Lactancia WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petLactancia, (err,respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})

app.delete("/api/admin/:id/deleteAlergia/:idAlergia", (req,res) =>{
    let petBBDD = `DELETE from Alergias where IdAlergia = '${req.params.idAlergia}'`;
    baseDatos.query(petBBDD, (err,respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)):(res.status(200).json("Borrado"))
    })
})

app.delete("/api/admin/:id/deleteEmbarazo/:idEmbarazo", (req,res) =>{
    let petBBDD = `DELETE from Embarazo where IDEmbarazo = '${req.params.idEmbarazo}'`;
    baseDatos.query(petBBDD, (err,respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)):(res.status(200).json("Borrado"))
    })
})


app.delete("/api/admin/:id/borrarPaciente/:idPaciente", (req,res) => {
    let petBBDD = `DELETE from Pacientes where NIdentidad = '${req.params.idPaciente}'`;
    baseDatos.query(petBBDD, (err,respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)):(res.status(200).json("Borrado"))
    })
})
app.delete("/api/admin/:id/deletePatologia/:idPatologia", (req,res) => {
    let petBBDD = `DELETE from PatologiasPrevias where IDPatologia ='${req.params.idPatologia}'`
    baseDatos.query(petBBDD, (err,respuesta) =>{
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})

app.delete("/api/admin/:id/deleteTratamiento/:idTratamiento", (req,res) => {
    let petBBDD = `DELETE from Tratamiento where IDTratamiento ='${req.params.idTratamiento}'`
    baseDatos.query(petBBDD, (err,respuesta) =>{
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})


app.put("/api/admin/:id/editPaciente/:idPaciente", (req,res) => {
    let datos = req.body;
    var info = datos.info; //0-nombre, 1-apellidos, 2-dni/pasaporte, 3-fechaNacimiento, 4-sexo, 5-peso, 6-talla
    var alergias = datos.alergias;
    var patologias = datos.patologias;
    var tratamientos = datos.tratamientos;
    //insert del paciente
    let petBBDDpaciente = `UPDATE Pacientes SET NIdentidad ='${info[2]}', Nombre = '${info[0]}', Apellidos ='${info[1]}', FechaNacimiento = '${info[3]}', Sexo = '${info[4]}', Talla = '${info[6]}', Peso = '${info[5]}'  WHERE NIdentidad = '${req.params.idPaciente}'`;
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
        let petBBDDlactancia = `UPDATE Lactancia SET Activa ='${lactancia}' WHERE IDPaciente='${info[2]}'`
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
    res.status(201).json('Cambios guardados correctamente');
})

// -----FIN DE REGISTRO Y EDICION DE PACIENTE-----

// DAR CITAS
app.get(`/api/admin/:id/getPacientesEnfermeros`,(req,res) =>{
    let petBBDD = `SELECT NIdentidad, Nombre, Apellidos FROM Pacientes`
    let listaPacientes
    let listaEnfermeros
    let petBBDD2 = `SELECT ID, Nombre, Apellidos FROM Enfermero`
    baseDatos.query(petBBDD, (err,response) => {
        if(err){
            res.status(502).json("Error bbdd"+err)
        } else{
            listaPacientes = response 
            baseDatos.query(petBBDD2, (err,respuesta) =>{
                if(err){
                    res.status(502).json("Error bbdd"+err)
                } else {
                    listaEnfermeros = respuesta
                    listas = [listaPacientes,listaEnfermeros]
                    res.status(201).json(listas)
                }
            })
        }
    })
})

app.post(`/api/admin/:id/crearCita`, (req,res) => {
    let paciente = req.body.paciente
    let enfermero = req.body.enfermero
    let tipoRevision = req.body.tipo
    let presencialidad = req.body.presencialidad
    let fechaHora = req.body.fechaHora

    //se procesa la entrada para que pueda usarse en la bbdd
    paciente = paciente.substring(paciente.indexOf("-")+2)
    enfermero = enfermero.substring(enfermero.indexOf("-")+2)
    fechaHora = `${fechaHora.substring(0,10)} ${fechaHora.substring(11)}`

    presencialidad == "presencial" ? (presencialidad = 0) : (presencialidad = 1)
    //se genera la peticion de la bbdd 
    let petBBDD = `INSERT INTO Cita (IDCita, IdPaciente, IDEnfermero, TipoRevision, Online, Sintomas, Signos, FechaHora, Realizada) VALUES (NULL, '${paciente}', '${enfermero}', '${tipoRevision}', '${presencialidad}', '', '', '${fechaHora}', '0');`
    baseDatos.query(petBBDD, (err,respuesta) => {
        err ? (res.status(502).json("Error en BBDD" + err)) : (res.status(201).json("Cita creada"))
    })
})



app.get('/api/enfermero/getIDEnfermero/:dni', (req,res) => {
    let petBBDD = `SELECT ID FROM Enfermero WHERE DNI ='${req.params.dni}'`
    baseDatos.query(petBBDD, (err,idEnfermero)=>{
        if(err){
            res.status(502).json("Error en BBDD"+ err)
        }else{
            res.status(201).json(idEnfermero)
        }
    })
})

//FUNCIONES PARA LA FORMACION DEL ENFERMERO
app.get("/api/enfermero/:id/getTest/:tipo/:periodo", (req,res) => {
    let tipo = req.params.tipo
    let periodo = req.params.periodo
    let idEnfermero = req.params.id
    let petBBDD = `SELECT * FROM Test WHERE (Tipo = '${tipo}') AND (Periodo = '${periodo}')`
    baseDatos.query(petBBDD, (err,respuesta) => {
        if(err){
            res.status(502).json("Fallo en BBDD" + err)
        }else{
            let idTest = respuesta[respuesta.length-1].IDTest
            let petBBDD2 = `SELECT * FROM EnfermeroTest WHERE (IDTest = '${idTest}') AND (IDEnfermero = '${idEnfermero}')`
            baseDatos.query(petBBDD2, (err,testRealizados) => {
                if(err){
                    res.status(502).json(err)
                }else{
                    if(testRealizados.length == 0){
                        res.status(201).json(respuesta[respuesta.length-1]);
                    }else{
                        res.status(201).json("testRealizado")
                    }
                }
            })
        }
    })
})

app.get("/api/enfermero/:id/getPreguntasTest/:idTest", (req,res) => {
    //devuelve al cliente las preguntas relativas al test solicitado
    let idTest = req.params.idTest
    let petBBDD = `SELECT * FROM PreguntasTest WHERE IDTest = '${idTest}'`
    baseDatos.query(petBBDD, (err,preguntas) => {
        if(err){
            res.status(502).json('Error en base de datos'+err)
        }else{
            var idPreguntas = preguntas.map((pregunta) => {return pregunta.IDPregunta})
            let listIDS = idPreguntas.join(",")
            let petBBDDpreguntas = `SELECT * FROM Preguntas WHERE IDPregunta IN (${listIDS})`;
            baseDatos.query(petBBDDpreguntas, (err,datosPreguntas) => {
                if(err){
                    res.status(502).json("Error BBDD" +err)
                }else{
                    res.status(201).json(datosPreguntas)
                }
            })
        }
    })
})

app.post("/api/enfermero/:id/guardarTest", (req,res) => {
    let datosTest = req.body;
    var getIDEnfermero = `SELECT ID FROM Enfermero WHERE DNI ='${datosTest.dniEnfermero}'`
    baseDatos.query(getIDEnfermero,(err, idEnf) => {
        if(err){
            res.status(502).json("Fallo BBDD"+err)
        }
        let idEnfermero = idEnf[0].ID
        var insertEnfTest = `INSERT INTO EnfermeroTest (IDEnfermero, IDTest, FechaRealizado, PorcentajeCompletitud, Puntuacion, TiempoRestante) VALUES ('${idEnfermero}', '${datosTest.idTest}', '${datosTest.fecha}','${datosTest.completado}','${datosTest.puntuacion}','${datosTest.tiempoRestante}')`
        baseDatos.query(insertEnfTest,(err,respuesta) => {
            if(err){
                console.log(err)
                res.status(502).json(err);
            }
            for(let a  = 0; a<datosTest.contestaciones.length; a++){
                var insertContestacion = `INSERT INTO ContestacionEnfermero (IDEnfermero, IDPregunta, Respuesta, FechaContestado) VALUES ('${idEnfermero}', '${datosTest.idPreguntas[a]}', '${datosTest.contestaciones[a]}','${datosTest.fecha}')`
                baseDatos.query(insertContestacion, (err,respuesta) => {
                    if(err){
                        res.status(502).json("Error BBDD"+err)
                    }
                })
            }
        res.status(201).json("test terminado")
        })
    })
})

app.get("/api/enfermero/:id/citas", (req,res) => {
    let petBBDD = `SELECT * FROM Cita WHERE IDEnfermero = '${req.params.id}'`
    baseDatos.query(petBBDD, (err,citas) => {
        if(err){
            res.status(502).json("Error BBDD"+ err);
        }else{
            let petBBDD2 = `SELECT NIdentidad, Nombre, Apellidos FROM Pacientes`
            baseDatos.query(petBBDD2,(err,pacientes) => {
                if(err){
                    res.status(502).json("Error BBDD"+err);
                }else{
                    let listaPacientes = []
                    for (let a = 0; a < pacientes.length; a++) {
                        let paciente = pacientes[a].NIdentidad
                        for (let b = 0; b < citas.length; b++) {
                            let idPaciente = citas[b].IdPaciente
                            if (paciente == idPaciente){
                                listaPacientes.push(pacientes[a])
                            }
                        }
                    }
                    let respuesta = [citas,listaPacientes]
                    res.status(201).json(respuesta)
                }
            })
        }
    })
})


app.get("/api/enfermero/:id/getCita/:idCita", (req,res)=>{
    let idCita = req.params.idCita;
    let petBBDD = `SELECT * FROM Cita WHERE IDCita = '${idCita}'`
    baseDatos.query(petBBDD, (err,cita)=>{
        if(err){
            res.status(502).json("Fallo BBDD"+err)
        }else{
            res.status(201).json(cita)
        }
    })
})

app.post("/api/enfermero/:id/createVariable", (req,res)=>{
    let datos = req.body    
    let petBBDD1 = `INSERT INTO TiposVariables (IDVariable, Nombre) VALUES (NULL, '${datos.nombre}')`
    baseDatos.query(petBBDD1, (err,respuesta) => {
        if(err){
            res.status(502).json("Error en la BBDD"+ err)
        }else{
            console.log(respuesta.insertId);
            for (let a = 0; a < datos.datosVariable[0].length; a++) {
                console.log(datos.datosVariable[0][a])
                petBBDD2 = `INSERT INTO UnidadesVariables (IDUnidad, IDVariable, NombreUnidad, Abreviatura, ValorMax, ValorMin) VALUES (NULL,'${respuesta.insertId}','${datos.datosVariable[0][a]}','${datos.datosVariable[1][a]}','${datos.datosVariable[2][a]}','${datos.datosVariable[3][a]}')`
                baseDatos.query(petBBDD2, (err,respuesta) => {
                    if(err){
                        console.log(err)
                        res.status(502).json("Error BBDD"+err);
                    }
                })
            }
            res.status(201).json("Variable creada")
        }
    })
})

app.get("/api/enfermero/:id/getTiposVariables", (req,res) => {
    let petBBDD = "SELECT * FROM TiposVariables"
    var contestacion = []
    baseDatos.query(petBBDD, (err,tipos) =>  {
        if(err){
            res.status(502).json("Error en BBDD"+err)
        }else{
            contestacion.push(tipos)
            let listaIDS = [];
            for (let a = 0; a < tipos.length; a++) {
                listaIDS.push(tipos[a].IDVariable)
            }
            let listaPeticion = listaIDS.join()
            let petBBDD2 = `SELECT * FROM UnidadesVariables WHERE IDVariable in (${listaPeticion})`
            baseDatos.query(petBBDD2, (err,datos) => {
                if(err){
                    res.status(502).json("Error BBDD"+ err)
                }else{
                    contestacion.push(datos)
                    res.status(201).json(contestacion)
                }
            })
        }
    })
})

app.post('/api/enfermero/:id/guardarMedidasPaciente/:idPaciente', (req,res) => {
    let idPaciente = req.params.idPaciente
    let mediciones = req.body
    let idParametros = mediciones.ids
    let cantidades = mediciones.cantidades
    let unidades = mediciones.unidades
    console.log(idPaciente)
    console.log(mediciones)
    for (let a = 0; a < idParametros.length; a++) {
        let petBBDD = `INSERT INTO VariableFisica (IDVariable, IDPaciente, Tipo, Valor, Unidades, Fecha, IDEnfermero) VALUES (NULL,'${idPaciente}','${idParametros[a]}','${cantidades[a]}','${unidades[a]}','${mediciones.fecha}','${req.params.id}')`
        console.log(petBBDD)
        baseDatos.query(petBBDD, (err,respuesta) => {
            if(err){
                res.status(502).json("Fallo BBDD"+err);
                return;
            }
        })
    }
    res.status(201).json("Mediciones guardadas correctamente")

})

app.put("/api/enfermero/:id/cerrarEmbarazo/:idEmbarazo",(req,res) => {
    let fechaFin = req.body.fechaFin
    let petBBDD = `UPDATE Embarazo SET Activo = '0', FechaFin = '${fechaFin}' WHERE IDEmbarazo = '${req.params.idEmbarazo}'`
    baseDatos.query(petBBDD, (err,respuesta) => {
        if(err){
            res.status(502).json("Error base de datos"+err)
        }else{
            res.status(201).json(respuesta);
        }
    })
})

app.post('/api/enfermero/:id/abrirEmbarazo/:idPaciente', (req,res) => {
    let fecha = req.body.fecha
    let petBBDD = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${req.params.idPaciente}','1','${fecha}',NULL)`
    baseDatos.query(petBBDD, (err,respuesta) => {
        if(err){
            res.status(502).json(err)
        }else{
            res.status(201).json(respuesta);
        }
    })
})


app.put("/api/enfermero/:id/cerrarLactancia/:idLactancia",(req,res) => {
    let petBBDD = `UPDATE Lactancia SET Activa = '0' WHERE IDLactancia = '${req.params.idLactancia}'`
    baseDatos.query(petBBDD, (err,respuesta) => {
        if(err){
            res.status(502).json("Error base de datos"+err)
        }else{
            res.status(201).json(respuesta);
        }
    })
})

app.post('/api/enfermero/:id/abrirLactancia/:idPaciente', (req,res) => {
    let petBBDD = `INSERT INTO Lactancia (IDLactancia, IdPaciente, Activa) VALUES (NULL, '${req.params.idPaciente}','1')`
    baseDatos.query(petBBDD, (err,respuesta) => {
        if(err){
            res.status(502).json(err)
        }else{
            res.status(201).json(respuesta);
        }
    })
})



//RELLENADO MONITOR RENDIMIENTO
//Obtencion de ciclos de test
app.get("/api/enfermero/:id/getCiclos", function(req, res){

})

//INICIO DEL SERVIDOR
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});