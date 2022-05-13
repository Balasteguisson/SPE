
//requires
var express = require("express");
const mysql = require('mysql')
var morgan = require('morgan');
var cors = require('cors');
var moment = require('moment');
const { CLIENT_LONG_FLAG, CLIENT_FOUND_ROWS, CLIENT_PLUGIN_AUTH } = require("mysql/lib/protocol/constants/client");

var app = express();


app.use('/enfermero', express.static('enfermero'));
app.use(express.json());
app.use(morgan('dev'));
const WL = ["http://localhost:8080", "https://cima.aemps.es/cima/rest/medicamento"]
app.use(cors(
    { origin: WL }
));


//Ajustes

app.set('port', 8080);
app.set('portDB', 3306); //ajustar esto mas tarde

//Conexion a BBDD
const database = {
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
app.post('/api/login', (req, res) => {
    var user = req.body.login;
    var password = req.body.password;
    var petUser = 'SELECT * FROM Usuarios';

    baseDatos.query(petUser, (err, users) => {
        if (err) {
            res.status(404).json('La peticion ha fallado');
        }
        for (let i = 0; i < users.length; i++) {
            if (user == users[i].Usuario && password == users[i].Password) {
                let datos = { usuario: users[i].Usuario, pass: users[i].Password, id: users[i].ID, permisos: users[i].Tipo };
                // console.log(datos); debug
                res.status(201).json(datos);
                return;
            }
        }
        console.log("solo se deberia llegar aqui con la pass incorrecta");
        res.status(403).json('Usuario o contraseña incorrectos');
    })
});

//DATOS DEL ENFERMERO
app.get('/api/enfermero/:id', function (req, res) {
    var idEnfermero = req.params.id;
    var petDatos = `SELECT * FROM DatosUsuarios WHERE IDUsuario = '${idEnfermero}'`;
    baseDatos.query(petDatos, (err, datos) => {
        if (err) {
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
app.get('/api/enfermero/:dni/resultados', function (req, res) {
    //tengo que ver como hago para que se muestren solamente los test del ciclo actual
    var dniEnfermero = req.params.dni;
    var idEnfermero;
    var petId = `SELECT * FROM Enfermero WHERE DNI = "${dniEnfermero}"`;
    baseDatos.query(petId, (err, datos) => {
        if (err) {
            res.status(404).json('Peticion BBDD fallida');
        }
        idEnfermero = datos[0].ID;
        var petTest = `SELECT * FROM EnfermeroTest WHERE IDEnfermero = ${idEnfermero}`;
        baseDatos.query(petTest, (err, datos) => {
            if (err) {
                res.status(404).json('Peticion BBDD fallida');
            }
            res.status(201).json(datos);
        })
    })
})

// CREACION DE PREGUNTA
app.post("/api/enfermero/:id/addPregunta", function (req, res) {
    var id = req.params.id;
    var datos = req.body;
    var addPregunta = `INSERT INTO Preguntas (IDPregunta, Tipo, Pregunta, FechaCreacion, Respuesta1, Respuesta2, Respuesta3, Respuesta4, RespuestaCorrecta) VALUES (NULL, "${datos.tipo}", "${datos.pregunta}", "${datos.fechaCreacion}", "${datos.respuesta1}", "${datos.respuesta2}", "${datos.respuesta3}", "${datos.respuesta4}", "${datos.respuestaCorrecta}");`
    // console.log(datos);
    // console.log(addPregunta);
    if (datos.tipo == '' || datos.pregunta == '' || datos.fechaCreacion == '' || datos.respuestaCorrecta == '') {
        res.status(400).json('Introduce bien los datos');
        return;
    }
    baseDatos.query(addPregunta, function (err, respuesta) {
        if (err) {
            res.status(502).json('Fallo en la BBDD');
            return;
        }
        res.status(201).json('Entrada añadida a la BBDD');
    });
});
//RELLENADO BANCO PREGUNTAS
app.get("/api/admin/:id/getPreguntas", (req, res) => {
    var peticion = "SELECT * FROM Preguntas";
    baseDatos.query(peticion, (err, datos) => {
        if (err) {
            res.status(502).json('Fallo en la BBDD');
            return;
        };
        res.status(201).json(datos);
    });
});


//GET PARA OBTENER DATOS DE UNA PREGUNTA, USADO EN EDITAR PREGUNTA
app.get("/api/admin/:id/getPregunta/:IDPregunta", (req, res) => {
    var peticion = `SELECT * FROM Preguntas WHERE IDPregunta = '${req.params.IDPregunta}'`
    baseDatos.query(peticion, (err, datos) => {
        if (err) {
            res.status(502).json('Fallo en la BBDD');
            return;
        };
        res.status(201).json(datos);
    })
})

//EDITADO DE PREGUNTA
app.put("/api/admin/:id/editPregunta/:IDPregunta", (req, res) => {
    let datos = req.body;
    let petPut = `UPDATE Preguntas SET Tipo = '${datos.tipo}', Pregunta = '${datos.pregunta}', FechaCreacion = '${datos.fechaCreacion}', Respuesta1 = '${datos.respuesta1}', Respuesta2 = '${datos.respuesta2}', Respuesta3 = '${datos.respuesta3}', Respuesta4 = '${datos.respuesta4}', RespuestaCorrecta = '${datos.respuestaCorrecta}' WHERE IDPregunta = '${datos.IDPregunta}'`;

    baseDatos.query(petPut, (err, respuesta) => {
        if (err) {
            res.status(502).json("Fallo en la base de datos");
            return;
        }
        res.status(200).json('Pregunta editada correctamente');
    })
})

//BORRADO DE PREGUNTA
app.delete("/api/admin/:id/deletePregunta/:IDPregunta", (req, res) => {
    let petDelete = `DELETE from Preguntas where IDPregunta = '${req.params.IDPregunta}'`;
    baseDatos.query(petDelete, (err, respuesta) => {
        if (err) {
            res.status(502).json(`Fallo con la base de datos. Respuesta: ${res}`);
            return;
        }
        res.status(200).json(`Pregunta ${req.params.IDPregunta} borrada.`)
    })
    // let petAI = `ALTER TABLE Preguntas AUTO_INCREMENT = ${lastID}`;
})

//CREACION DE TEST
app.get("/api/admin/:id/getPreguntas/:modalidad", (req, res) => {
    let petGet = `SELECT * from Preguntas where Tipo ='${req.params.modalidad}'`;
    baseDatos.query(petGet, (err, respuesta) => {
        if (err) {
            res.status(502).json('Fallo con la base de datos.' + err)
            return;
        }
        res.status(200).json(respuesta);
    })
})


app.get("/api/admin/:id/getIdTest", (req, res) => {
    let pet1 = `SELECT * FROM Test`
    baseDatos.query(pet1, (err, respuesta) => {
        if (err) {
            res.status(502).json('Fallo con la base de datos.' + err)
            return;
        }
        let IDtest;
        if (respuesta.length == 0) {
            IDtest = 1;
        } else {
            IDtest = respuesta[respuesta.length - 1].IDTest + 1;
        }
        res.status(201).json(IDtest);
    })
})

app.post("/api/admin/:id/crearTest", (req, res) => {
    let datosTest = req.body;
    let IDTest = datosTest.idTest;
    console.log(IDTest);
    let tipo = datosTest.tipo; let fechaCreacion = datosTest.fechaCreacion;
    let periodo = moment().format('MM-YYYY');
    let petPush1 = `INSERT INTO Test (IDTest, Tipo, FechaCreacion, Periodo) VALUES (${IDTest}, "${tipo}", "${fechaCreacion}", "${periodo}")`;
    console.log(petPush1);
    baseDatos.query(petPush1, (err, respuesta) => {
        if (err) {
            res.status(502).json('Fallo con la base de datos.' + err)
            return;
        }
        res.status(201).json(IDTest);
    })
})

app.post("/api/admin/:id/addPreguntas", (req, res) => {
    let datos = req.body;
    let IDTest = datos.IDTest;
    let preguntas = datos.preguntas;
    for (let a = 0; a < preguntas.length; a++) {
        //el bucle inserta pregunta a pregunta en la tabla que relaciona el test con las preguntas
        let petPush2 = `INSERT INTO PreguntasTest (IDTest, IDPregunta) VALUES ("${IDTest}", "${preguntas[a]}")`
        baseDatos.query(petPush2, (err, respuesta) => {
            if (err) {
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
app.post("/api/admin/:id/registrarEnfermero", (req, res) => {
    let datos = req.body;
    console.log(datos);
    let petBBDD = `INSERT INTO Usuarios (ID, Usuario, Password, Tipo) VALUES (NULL, '${datos.dni}','${datos.fechaNacimiento}', 'enfermero')`
    let petBBDDenfermero = `INSERT INTO Enfermero (ID, DNI, Nombre, Apellidos) VALUES (NULL, '${datos.dni}', '${datos.nombre}', '${datos.apellidos}')`
    console.log(petBBDD)
    baseDatos.query(petBBDD, (err, respuesta) => {
        var idCreado;
        err ? (res.status(502).json("Fallo en la base de datos" + err)) : (idCreado = respuesta.insertId);
        let petBBDD2 = `INSERT INTO DatosUsuarios (ID, IDUsuario, Nombre, Apellidos, DNI, IDFoto, FechaNacimiento, EmailContacto) VALUES (NULL, '${idCreado}', '${datos.nombre}', '${datos.apellidos}','${datos.dni}',NULL, '${datos.fechaNacimiento}', '${datos.email}')`
        baseDatos.query(petBBDD2, (err, respuesta2) => {
            let respuesta;
            err ? (res.status(502).json("Fallo en la base de datos" + err)) : (respuesta = respuesta2);
            baseDatos.query(petBBDDenfermero, (err, respuesta3) => {
                err ? (res.status(502).json("Fallo en la base de datos" + err)) : (res.status(201).json("Enfermero creado"));
            })
        })
    })

})

//LISTADO ENFERMEROS
app.get("/api/admin/:id/getEnfermeros", (req, res) => {
    let petBBDD = `SELECT * FROM Enfermero`
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(501).json("Error en BBDD" + err)) : (res.status(201).json(respuesta))
    })
})

app.delete("/api/admin/:id/deleteEnfermero/:dniEnfermero", (req, res) => {
    let petBBDD = `DELETE FROM Enfermero WHERE DNI ='${req.params.dniEnfermero}'`
    console.log(petBBDD)
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Error con BBDD" + err)) : (res.status(201).json(respuesta))
    })
})

app.get("/api/admin/:id/getEnfermero/:dniEnfermero", (req, res) => {
    let petBBDD = `SELECT * FROM DatosUsuarios WHERE DNI='${req.params.dniEnfermero}';`;
    baseDatos.query(petBBDD, (err, respuesta) => {

        err ? (res.status(502).json(err)) : (res.status(201).json(respuesta));
    })
})

app.put("/api/admin/:id/editarEnfermero/:dniEnfermero", (req, res) => {
    let dniEnfermero = req.params.dniEnfermero
    let datosEnfermero = req.body
    let petBBDD = `UPDATE DatosUsuarios SET DNI ='${datosEnfermero.dni}', Nombre ='${datosEnfermero.nombre}', Apellidos ='${datosEnfermero.apellidos}', FechaNacimiento='${datosEnfermero.fechaNacimiento}', IDFoto =${datosEnfermero.idFoto}, EmailContacto='${datosEnfermero.email}' WHERE DNI ='${dniEnfermero}'`;
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json("Error en BBDD" + err)
        } else {
            let petBBDD2 = `UPDATE Enfermero SET DNI='${datosEnfermero.dni}', Nombre='${datosEnfermero.nombre}', Apellidos='${datosEnfermero.apellidos}' WHERE DNI='${dniEnfermero}'`;
            baseDatos.query(petBBDD2, (err2, respuesta2) => {
                err2 ? (res.status(502).json("Error en BBDD" + err)) : (res.status(201).json(respuesta2))
            })
        }
    })

})

//REGISTRO ADMINISTRADOR
app.post("/api/admin/:id/registrarAdmin", (req, res) => {
    let datos = req.body;
    let petBBDD1 = `INSERT INTO Usuarios ("ID", "Usuario", "Password", "Tipo") VALUES (NULL, 'admin2', 'admin2', 'administrador')`;

})

//REGISTRO Y EDICION DE PACIENTE

app.post("/api/admin/:id/nuevoPaciente", (req, res) => {
    //crea el paciente y devuelve el ID que le ha generado
    let datos = req.body;
    var info = datos.info; //0-nombre, 1-apellidos, 2-dni/pasaporte, 3-fechaNacimiento, 4-sexo, 5-peso, 6-talla
    var alergias = datos.alergias;
    var patologias = datos.patologias;
    var tratamientos = datos.tratamientos;
    //insert del paciente
    let petBBDDpaciente = `INSERT INTO Pacientes (NIdentidad, Nombre, Apellidos, FechaNacimiento, Sexo, Talla, Peso) VALUES ('${info[2]}', '${info[0]}', '${info[1]}', '${info[3]}', '${info[4]}', '${info[6]}', '${info[5]}');`
    baseDatos.query(petBBDDpaciente, (err) => {
        if (err) {
            console.log(err)
            res.status(502).json('Fallo con la base de datos.' + err);
            return;
        }
    })
    //insert de alergias
    for (let a = 0; a < alergias.length; a++) {
        let alergia = alergias[a];
        let petBBDDalergia = `INSERT INTO Alergias (IDAlergia, IdPaciente, Alergeno) VALUES (NULL, '${info[2]}', '${alergia}');`
        baseDatos.query(petBBDDalergia, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en alergias")
                res.status(502).json('Fallo con la base de datos.' + err);
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
        patologia[1] == "ACTIVA" ? (activa = 1) : (activa = 0, fechaFin = patologia[3]);
        activa == 1 ?
            (petBBDDpatologia = `INSERT INTO PatologiasPrevias (IDPatologia, IdPaciente, Nombre, Descripcion, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${patologia[0]}', '${patologia[4]}', '${activa}', '${patologia[2]}', NULL);`) :
            (petBBDDpatologia = `INSERT INTO PatologiasPrevias (IDPatologia, IdPaciente, Nombre, Descripcion, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${patologia[0]}', '${patologia[4]}', '${activa}', '${patologia[2]}', '${fechaFin}');`);
        baseDatos.query(petBBDDpatologia, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en patologia")
                res.status(502).json('Fallo con la base de datos.' + err);
                return;
            }
        })
    }
    //insert de tratamientos
    for (let a = 0; a < tratamientos.length; a++) {
        let tratamiento = tratamientos[a];
        let petBBDDtratamiento = `INSERT INTO Tratamiento (IDTratamiento, IdPaciente, IDFarmaco, FechaInicio, FechaFin, IntervaloTomas, Cantidad, Anotaciones, EfectosSecundarios, IDCita) VALUES (NULL, '${info[2]}','${tratamiento[0].substring(tratamiento[0].indexOf("-") + 2)}','${tratamiento[1]}', '${tratamiento[2]}', '${tratamiento[3]}', '${tratamiento[4]}', NULL, NULL, NULL);`
        baseDatos.query(petBBDDtratamiento, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en tratamiento")
                res.status(502).json('Fallo con la base de datos.' + err);
                return;
            }
        })
    }
    //insert de embarazo y lactancia

    if (info[4] == "F") {
        let embarazos = datos.embarazos;
        let lactancia;
        // 0 activo 1 fechainicio 2 fechafin
        for (let a = 0; a < embarazos.length; a++) {
            let embarazo = embarazos[a];
            let activo;
            let petBBDDembarazo;
            embarazo[0] == "ACTIVO" ? (activo = 1) : (activo = 0)
            activo == 1 ? (petBBDDembarazo = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${activo}', '${embarazo[1]}', NULL);`) : (petBBDDembarazo = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${activo}', '${embarazo[1]}', '${embarazo[2]}');`);
            console.log(petBBDDembarazo);

            baseDatos.query(petBBDDembarazo, (err) => {
                if (err) {
                    console.log(err)
                    console.log("Error en embarazo")
                    res.status(502).json('Fallo con la base de datos.' + err);
                    return;
                }
            })
        }

        datos.lactancia == "SI" ? (lactancia = 1) : (lactancia = 0);
        let petBBDDlactancia = `INSERT INTO Lactancia (IDLactancia, IdPaciente, Activa) VALUES (NULL, '${info[2]}', '${lactancia}');`;
        baseDatos.query(petBBDDlactancia, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en lactancia")
                res.status(502).json('Fallo con la base de datos.' + err);
                return;
            }
        })
    }
    //si llega hasta aqui puedes celebrar
    res.status(201).json('Paciente creado en la BBDD');
})

app.get("/api/admin/:id/getPacientes", (req, res) => {
    let petBBDD = "SELECT * FROM Pacientes";
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            console.log(err)
            res.status(502).json('Fallo con la base de datos.' + err);
            return;
        }
        res.status(201).json(respuesta);
    })
})

app.get("/api/admin/:id/getPaciente/:idPaciente", (req, res) => {
    let petBBDD = `SELECT * FROM Pacientes WHERE NIdentidad = '${req.params.idPaciente}'`
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})
app.get("/api/admin/:id/getAlergiasPaciente/:idPaciente", (req, res) => {
    let petAlergias = `SELECT * FROM Alergias WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petAlergias, (err, respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})

app.get("/api/admin/:id/getPatPreviasPaciente/:idPaciente", (req, res) => {
    let petPatPrev = `SELECT * FROM PatologiasPrevias WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petPatPrev, (err, respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})

app.get("/api/admin/:id/getTratamientosPaciente/:idPaciente", (req, res) => {
    let fechaHoy = new Date();
    fechaHoy = fechaHoy.toISOString().substring(0, 10);
    let petTratamiento = `SELECT * FROM tratamiento WHERE IdPaciente = '${req.params.idPaciente}' AND "${fechaHoy}" BETWEEN FechaInicio AND FechaFin`
    baseDatos.query(petTratamiento, (err, respuesta) => {
        if (err) {
            res.status(502).json('Fallo en la bbdd.' + err);
            return;
        } else {
            let listaTratamientos = [];
            let listaFarmacos = [];
            for (let a = 0; a < respuesta.length; a++) {
                let idFarmaco = respuesta[a].IDFarmaco;
                listaFarmacos.push(idFarmaco);
            }
            listaFarmacos = listaFarmacos.join(",")
            let petFarmaco = `SELECT Nombre, PrincipioActivo FROM farmacos WHERE IDFarmaco IN (${listaFarmacos})`
            baseDatos.query(petFarmaco, (err, nombres) => {
                if (err) {
                    res.status(502).json("Fallo en la bbdd" + err);
                    return;
                }
                else {
                    for (let a = 0; a < respuesta.length; a++) {
                        let tratamiento = {
                            idTratamiento: respuesta[a].IDTratamiento,
                            nombre: nombres[a].Nombre,
                            principioActivo: nombres[a].PrincipioActivo,
                            cantidad: respuesta[a].Cantidad
                        }
                        listaTratamientos.push(tratamiento);
                    }
                    res.status(201).json(listaTratamientos);
                }
            })
        }
    })


})
app.get("/api/admin/:id/getEmbarazosPaciente/:idPaciente", (req, res) => {
    let petEmbarazos = `SELECT * FROM Embarazo WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petEmbarazos, (err, respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})
app.get("/api/admin/:id/getLactanciaPaciente/:idPaciente", (req, res) => {
    let petLactancia = `SELECT * FROM Lactancia WHERE IdPaciente = '${req.params.idPaciente}'`
    baseDatos.query(petLactancia, (err, respuesta) => {
        err ? (res.status(502).json("Fallo en la bbdd" + err)) : (res.status(201).json(respuesta));
    })
})

app.delete("/api/admin/:id/deleteAlergia/:idAlergia", (req, res) => {
    let petBBDD = `DELETE from Alergias where IdAlergia = '${req.params.idAlergia}'`;
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})

app.delete("/api/admin/:id/deleteEmbarazo/:idEmbarazo", (req, res) => {
    let petBBDD = `DELETE from Embarazo where IDEmbarazo = '${req.params.idEmbarazo}'`;
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})


app.delete("/api/admin/:id/borrarPaciente/:idPaciente", (req, res) => {
    let petBBDD = `DELETE from Pacientes where NIdentidad = '${req.params.idPaciente}'`;
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})
app.delete("/api/admin/:id/deletePatologia/:idPatologia", (req, res) => {
    let petBBDD = `DELETE from PatologiasPrevias where IDPatologia ='${req.params.idPatologia}'`
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})

app.delete("/api/admin/:id/deleteTratamiento/:idTratamiento", (req, res) => {
    let petBBDD = `DELETE from Tratamiento where IDTratamiento ='${req.params.idTratamiento}'`
    baseDatos.query(petBBDD, (err, respuesta) => {
        err ? (res.status(502).json("Error en base de datos" + err)) : (res.status(200).json("Borrado"))
    })
})


app.put("/api/admin/:id/editPaciente/:idPaciente", (req, res) => {
    let datos = req.body;
    var info = datos.info; //0-nombre, 1-apellidos, 2-dni/pasaporte, 3-fechaNacimiento, 4-sexo, 5-peso, 6-talla
    var alergias = datos.alergias;
    var patologias = datos.patologias;
    var tratamientos = datos.tratamientos;
    //insert del paciente
    let petBBDDpaciente = `UPDATE Pacientes SET NIdentidad ='${info[2]}', Nombre = '${info[0]}', Apellidos ='${info[1]}', FechaNacimiento = '${info[3]}', Sexo = '${info[4]}', Talla = '${info[6]}', Peso = '${info[5]}'  WHERE NIdentidad = '${req.params.idPaciente}'`;
    baseDatos.query(petBBDDpaciente, (err) => {
        if (err) {
            console.log(err)
            res.status(502).json('Fallo con la base de datos.' + err);
            return;
        }
    })
    //insert de alergias
    for (let a = 0; a < alergias.length; a++) {
        let alergia = alergias[a];
        let petBBDDalergia = `INSERT INTO Alergias (IDAlergia, IdPaciente, Alergeno) VALUES (NULL, '${info[2]}', '${alergia}');`
        baseDatos.query(petBBDDalergia, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en alergias")
                res.status(502).json('Fallo con la base de datos.' + err);
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
        patologia[1] == "ACTIVA" ? (activa = 1) : (activa = 0, fechaFin = patologia[3]);
        activa == 1 ?
            (petBBDDpatologia = `INSERT INTO PatologiasPrevias (IDPatologia, IdPaciente, Nombre, Descripcion, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${patologia[0]}', '${patologia[4]}', '${activa}', '${patologia[2]}', NULL);`) :
            (petBBDDpatologia = `INSERT INTO PatologiasPrevias (IDPatologia, IdPaciente, Nombre, Descripcion, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${patologia[0]}', '${patologia[4]}', '${activa}', '${patologia[2]}', '${fechaFin}');`);
        baseDatos.query(petBBDDpatologia, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en patologia")
                res.status(502).json('Fallo con la base de datos.' + err);
                return;
            }
        })
    }
    //insert de tratamientos
    for (let a = 0; a < tratamientos.length; a++) {
        let tratamiento = tratamientos[a];
        let petBBDDtratamiento = `INSERT INTO tratamiento (IDTratamiento, IdPaciente, IDFarmaco, FechaInicio, FechaFin, IntervaloTomas, Cantidad, Anotaciones, EfectosSecundarios, IDCita) VALUES (NULL, '${info[2]}','${tratamiento[0].substring(tratamiento[0].indexOf("-") + 2)}','${tratamiento[1]}', '${tratamiento[2]}', '${tratamiento[3]}', '${tratamiento[4]}', NULL, NULL, NULL);`
        baseDatos.query(petBBDDtratamiento, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en tratamiento")
                res.status(502).json('Fallo con la base de datos.' + err);
                return;
            }
        })
    }
    //insert de embarazo y lactancia
    if (info[4] == "F") {
        let embarazos = datos.embarazos;
        let lactancia;
        // 0 activo 1 fechainicio 2 fechafin
        for (let a = 0; a < embarazos.length; a++) {
            let embarazo = embarazos[a];
            let activo;
            embarazo[0] == "ACTIVO" ? (activo = 1) : (activo = 0)
            let petBBDDembarazo = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${info[2]}', '${activo}', '${embarazo[1]}', '${embarazo[2]}');`;
            baseDatos.query(petBBDDembarazo, (err) => {
                if (err) {
                    console.log(err)
                    console.log("Error en embarazo")
                    res.status(502).json('Fallo con la base de datos.' + err);
                    return;
                }
            })
        }

        datos.lactancia == "SI" ? (lactancia = 1) : (lactancia = 0);
        let petBBDDlactancia = `UPDATE Lactancia SET Activa ='${lactancia}' WHERE IDPaciente='${info[2]}'`
        baseDatos.query(petBBDDlactancia, (err) => {
            if (err) {
                console.log(err)
                console.log("Error en lactancia")
                res.status(502).json('Fallo con la base de datos.' + err);
                return;
            }
        })
    }
    //si llega hasta aqui puedes celebrar
    res.status(201).json('Cambios guardados correctamente');
})

// -----FIN DE REGISTRO Y EDICION DE PACIENTE-----

// DAR CITAS
app.get(`/api/admin/:id/getPacientesEnfermeros`, (req, res) => {
    let petBBDD = `SELECT NIdentidad, Nombre, Apellidos FROM Pacientes`
    let listaPacientes
    let listaEnfermeros
    let petBBDD2 = `SELECT ID, Nombre, Apellidos FROM Enfermero`
    baseDatos.query(petBBDD, (err, response) => {
        if (err) {
            res.status(502).json("Error bbdd" + err)
        } else {
            listaPacientes = response
            baseDatos.query(petBBDD2, (err, respuesta) => {
                if (err) {
                    res.status(502).json("Error bbdd" + err)
                } else {
                    listaEnfermeros = respuesta
                    listas = [listaPacientes, listaEnfermeros]
                    res.status(201).json(listas)
                }
            })
        }
    })
})

app.post(`/api/admin/:id/crearCita`, (req, res) => {
    let paciente = req.body.paciente
    let enfermero = req.body.enfermero
    let tipoRevision = req.body.tipo
    let presencialidad = req.body.presencialidad
    let fechaHora = req.body.fechaHora

    //se procesa la entrada para que pueda usarse en la bbdd
    paciente = paciente.substring(paciente.indexOf("-") + 2)
    enfermero = enfermero.substring(enfermero.indexOf("-") + 2)
    fechaHora = `${fechaHora.substring(0, 10)} ${fechaHora.substring(11)}`

    presencialidad == "presencial" ? (presencialidad = 0) : (presencialidad = 1)
    //se genera la peticion de la bbdd 
    let petBBDD = `INSERT INTO Cita (IDCita, IdPaciente, IDEnfermero, TipoRevision, Online, Sintomas, Signos, FechaHora, Realizada) VALUES (NULL, '${paciente}', '${enfermero}', '${tipoRevision}', '${presencialidad}', '', '', '${fechaHora}', '0');`
    baseDatos.query(petBBDD, (err, respuesta) => {
        console.log(respuesta);
        err ? (res.status(502).json("Error en BBDD" + err)) : (res.status(201).json("Cita creada"))
        
    })
})



app.get('/api/enfermero/getIDEnfermero/:dni', (req, res) => {
    let petBBDD = `SELECT ID FROM Enfermero WHERE DNI ='${req.params.dni}'`
    baseDatos.query(petBBDD, (err, idEnfermero) => {
        if (err) {
            res.status(502).json("Error en BBDD" + err)
        } else {
            res.status(201).json(idEnfermero)
        }
    })
})

//FUNCIONES PARA LA FORMACION DEL ENFERMERO
app.get("/api/enfermero/:id/getTest/:tipo", (req, res) => {
    let tipo = req.params.tipo
    let idEnfermero = req.params.id
    let periodo = moment().format('MM-YYYY')
    console.log(periodo);
    let petBBDD = `SELECT * FROM Test WHERE (Tipo = '${tipo}') AND (Periodo = '${periodo}')`
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json("Fallo en BBDD" + err)
        } else if (respuesta.length == 0) {
            res.status(404).json("testNotFound")
        } else {
            console.log(respuesta);
            let idTest = respuesta[respuesta.length - 1].IDTest
            let petBBDD2 = `SELECT * FROM EnfermeroTest WHERE (IDTest = '${idTest}') AND (IDEnfermero = '${idEnfermero}')`
            baseDatos.query(petBBDD2, (err, testRealizados) => {
                if (err) {
                    res.status(502).json(err)
                } else {
                    if (testRealizados.length == 0) {
                        res.status(201).json(respuesta[respuesta.length - 1]);
                    } else {
                        res.status(403).json("testRealizado")
                    }
                }
            })
        }
    })
})

app.get("/api/enfermero/:id/getPreguntasTest/:idTest", (req, res) => {
    //devuelve al cliente las preguntas relativas al test solicitado
    let idTest = req.params.idTest
    let petBBDD = `SELECT * FROM PreguntasTest WHERE IDTest = '${idTest}'`
    baseDatos.query(petBBDD, (err, preguntas) => {
        if (err) {
            res.status(502).json('Error en base de datos' + err)
        } else {
            var idPreguntas = preguntas.map((pregunta) => { return pregunta.IDPregunta })
            let listIDS = idPreguntas.join(",")
            let petBBDDpreguntas = `SELECT * FROM Preguntas WHERE IDPregunta IN (${listIDS})`;
            baseDatos.query(petBBDDpreguntas, (err, datosPreguntas) => {
                if (err) {
                    res.status(502).json("Error BBDD" + err)
                } else {
                    res.status(201).json(datosPreguntas)
                }
            })
        }
    })
})

app.post("/api/enfermero/:id/guardarTest", (req, res) => {
    let datosTest = req.body;
    var getIDEnfermero = `SELECT ID FROM Enfermero WHERE DNI ='${datosTest.dniEnfermero}'`
    baseDatos.query(getIDEnfermero, (err, idEnf) => {
        if (err) {
            res.status(502).json("Fallo BBDD" + err)
        }
        let idEnfermero = idEnf[0].ID
        var insertEnfTest = `INSERT INTO EnfermeroTest (IDEnfermero, IDTest, FechaRealizado, PorcentajeCompletitud, Puntuacion, TiempoRestante) VALUES ('${idEnfermero}', '${datosTest.idTest}', '${datosTest.fecha}','${datosTest.completado}','${datosTest.puntuacion}','${datosTest.tiempoRestante}')`
        baseDatos.query(insertEnfTest, (err, respuesta) => {
            if (err) {
                res.status(502).json(err);
            }
            for (let a = 0; a < datosTest.contestaciones.length; a++) {
                var insertContestacion = `INSERT INTO ContestacionEnfermero (IDEnfermero, IDPregunta, Respuesta, FechaContestado) VALUES ('${idEnfermero}', '${datosTest.idPreguntas[a]}', '${datosTest.contestaciones[a]}','${datosTest.fecha}')`
                baseDatos.query(insertContestacion, (err, respuesta) => {
                    if (err) {
                        res.status(502).json("Error BBDD" + err)
                    }
                })
            }
            res.status(201).json("test terminado")
        })
    })
})

app.get("/api/enfermero/:id/citas", (req, res) => {
    let petBBDD = `SELECT * FROM Cita WHERE IDEnfermero = '${req.params.id}'`
    baseDatos.query(petBBDD, (err, citas) => {
        if (err) {
            res.status(502).json("Error BBDD" + err);
        } else {
            let petBBDD2 = `SELECT NIdentidad, Nombre, Apellidos FROM Pacientes`
            baseDatos.query(petBBDD2, (err, pacientes) => {
                if (err) {
                    res.status(502).json("Error BBDD" + err);
                } else {
                    let listaPacientes = []
                    for (let a = 0; a < pacientes.length; a++) {
                        let paciente = pacientes[a].NIdentidad
                        for (let b = 0; b < citas.length; b++) {
                            let idPaciente = citas[b].IdPaciente
                            if (paciente == idPaciente) {
                                listaPacientes.push(pacientes[a])
                            }
                        }
                    }
                    let respuesta = [citas, listaPacientes]
                    res.status(201).json(respuesta)
                }
            })
        }
    })
})


app.get("/api/enfermero/:id/getCita/:idCita", (req, res) => {
    let idCita = req.params.idCita;
    let petBBDD = `SELECT * FROM Cita WHERE IDCita = '${idCita}'`
    baseDatos.query(petBBDD, (err, cita) => {
        if (err) {
            res.status(502).json("Fallo BBDD" + err)
        } else {
            res.status(201).json(cita)
        }
    })
})

app.post("/api/enfermero/:id/createVariable", (req, res) => {
    let datos = req.body
    let petBBDD1 = `INSERT INTO TiposVariables (IDVariable, Nombre) VALUES (NULL, '${datos.nombre}')`
    baseDatos.query(petBBDD1, (err, respuesta) => {
        if (err) {
            res.status(502).json("Error en la BBDD" + err)
        } else {
            for (let a = 0; a < datos.datosVariable[0].length; a++) {
                petBBDD2 = `INSERT INTO UnidadesVariables (IDUnidad, IDVariable, NombreUnidad, Abreviatura, ValorMax, ValorMin) VALUES (NULL,'${respuesta.insertId}','${datos.datosVariable[0][a]}','${datos.datosVariable[1][a]}','${datos.datosVariable[2][a]}','${datos.datosVariable[3][a]}')`
                baseDatos.query(petBBDD2, (err, respuesta) => {
                    if (err) {
                        res.status(502).json("Error BBDD" + err);
                    }
                })
            }
            res.status(201).json("Variable creada")
        }
    })
})

app.get("/api/enfermero/:id/getTiposVariables", (req, res) => {
    let petBBDD = "SELECT * FROM TiposVariables"
    var contestacion = []
    baseDatos.query(petBBDD, (err, tipos) => {
        if (err) {
            res.status(502).json("Error en BBDD" + err)
        } else {
            contestacion.push(tipos)
            let listaIDS = [];
            for (let a = 0; a < tipos.length; a++) {
                listaIDS.push(tipos[a].IDVariable)
            }
            let listaPeticion = listaIDS.join()
            let petBBDD2 = `SELECT * FROM UnidadesVariables WHERE IDVariable in (${listaPeticion})`
            baseDatos.query(petBBDD2, (err, datos) => {
                if (err) {
                    res.status(502).json("Error BBDD" + err)
                } else {
                    contestacion.push(datos)
                    res.status(201).json(contestacion)
                }
            })
        }
    })
})

app.post('/api/enfermero/:id/guardarMedidasPaciente/:idPaciente', (req, res) => {
    let idPaciente = req.params.idPaciente
    let mediciones = req.body
    let idParametros = mediciones.ids
    let cantidades = mediciones.cantidades
    let unidades = mediciones.unidades
    for (let a = 0; a < idParametros.length; a++) {
        let petBBDD = `INSERT INTO VariableFisica (IDVariable, IDPaciente, Tipo, Valor, Unidades, Cita, IDEnfermero) VALUES (NULL,'${idPaciente}',${idParametros[a]},'${cantidades[a]}','${unidades[a]}','${mediciones.cita}','${req.params.id}')`
        baseDatos.query(petBBDD, (err, respuesta) => {
            if (err) {
                console.log(err);
                res.status(502).json("Fallo BBDD" + err);
                return;
            }
        })
    }
    res.status(201).json("Mediciones guardadas correctamente")
})


app.post('/api/enfermero/:id/guardarMedidaPaciente/:idPaciente', async (req, res) => {
    let idPaciente = req.params.idPaciente
    let medicion = req.body
    let petBBDD = `INSERT INTO variablefisica (IDVariable, IDPaciente, Tipo, Valor, Unidades, Cita, IDEnfermero) VALUES (NULL,'${idPaciente}',${medicion.tipo},'${medicion.cantidad}','${medicion.unidades}','${medicion.cita}','${req.params.id}')`
    let respuesta = await medicionesPaciente(petBBDD);
    res.status(201).json(respuesta);
})

app.delete('/api/enfermero/:id/borrarMedidaPaciente/:idMedida', async (req, res) => {
    let idMedida = req.params.idMedida
    let petBBDD = `DELETE FROM VariableFisica WHERE IDVariable = '${idMedida}'`
    let respuesta = await medicionesPaciente(petBBDD);
    res.status(201).json(respuesta);
})

app.put("/api/enfermero/:id/cerrarEmbarazo/:idEmbarazo", (req, res) => {
    let fechaFin = req.body.fechaFin
    let petBBDD = `UPDATE Embarazo SET Activo = '0', FechaFin = '${fechaFin}' WHERE IDEmbarazo = '${req.params.idEmbarazo}'`
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json("Error base de datos" + err)
        } else {
            res.status(201).json(respuesta);
        }
    })
})

app.post('/api/enfermero/:id/abrirEmbarazo/:idPaciente', (req, res) => {
    let fecha = req.body.fecha
    let petBBDD = `INSERT INTO Embarazo (IDEmbarazo, IdPaciente, Activo, FechaInicio, FechaFin) VALUES (NULL, '${req.params.idPaciente}','1','${fecha}',NULL)`
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json(err)
        } else {
            res.status(201).json(respuesta);
        }
    })
})


app.put("/api/enfermero/:id/cerrarLactancia/:idLactancia", (req, res) => {
    let petBBDD = `UPDATE Lactancia SET Activa = '0' WHERE IDLactancia = '${req.params.idLactancia}'`
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json("Error base de datos" + err)
        } else {
            res.status(201).json(respuesta);
        }
    })
})

app.post('/api/enfermero/:id/abrirLactancia/:idPaciente', (req, res) => {
    let petBBDD = `INSERT INTO Lactancia (IDLactancia, IdPaciente, Activa) VALUES (NULL, '${req.params.idPaciente}','1')`
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json(err)
            return;
        } else {
            res.status(201).json(respuesta);
        }
    })
})



app.post('/api/admin/:id/registrarMedicamento', (req, res) => {
    let datosMedicamento = req.body;

    let petBBDD = `INSERT INTO farmacos (IDFarmaco, Nombre, PrincipioActivo, FormaFarm, Dosis, ViaAdministracion, NRegistro, RiesgoEmbarazo, RiesgoLactancia, ImgCaja, ImgForma) VALUES (NULL, '${datosMedicamento.nombre}', '${datosMedicamento.prAct1}', '${datosMedicamento.formFarm}', '${datosMedicamento.dosis}', '${datosMedicamento.viaAdmin}', '${datosMedicamento.nRegistro}', '${datosMedicamento.rEmbarazo}', '${datosMedicamento.rLactancia}', '${datosMedicamento.imgCaja}', '${datosMedicamento.imgForma}')`;
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json("Error en BBDD" + err);
            return;
        }
        res.status(201).json(respuesta);
    });
})


app.get('/api/enfermero/:id/getFarmacos', (req, res) => {
    let petBBDD = "SELECT IDFarmaco, Nombre FROM farmacos";
    baseDatos.query(petBBDD, (err, respuesta) => {
        if (err) {
            res.status(502).json("Error en BBDD" + err);
            return;
        }
        res.status(201).json(respuesta);
    });
})

app.put('/api/enfermero/:id/actualizarTratamiento/:idPaciente/:idFarmaco/:idCita', async (req, res) => {
    let idPaciente = req.params.idPaciente
    let idFarmaco = req.params.idFarmaco
    let idCita = req.params.idCita
    let datos = req.body
    console.log(datos);
    let petBBDD = `UPDATE tratamiento SET IDFarmaco = '${datos.medicamento}', FechaInicio = '${datos.fechaInicio}', FechaFin = '${datos.fechaFin}', IntervaloTomas = '${datos.intervalo}', Cantidad = '${datos.cantidad}', Anotaciones = '${datos.indicaciones}', IDCita ='${idCita}' WHERE IdPaciente = '${idPaciente}' AND IDFarmaco = '${idMedicamentoActual}'`;
    let respuesta = await actualizarTratamiento(petBBDD)

    res.status(201).json(respuesta);
})

actualizarTratamiento = (peticion) => {
    return new Promise((resolve, reject) => {
        baseDatos.query(peticion, (err, respuesta) => {
            if (err) return reject(err);
            return resolve(respuesta);
        })
    })
}

app.get('/api/enfermero/:id/getMedicionesPaciente/:idPaciente/:idCita', async (req, res) => {
    let idPaciente = req.params.idPaciente
    let idCita = req.params.idCita
    let petBBDD = `SELECT * FROM variableFisica WHERE IdPaciente = '${idPaciente}' AND Cita = '${idCita}'`;
    let petBBDD2 = `SELECT * FROM tiposvariables`
    let respuesta = await medicionesPaciente(petBBDD)
    let respuesta2 = await medicionesPaciente(petBBDD2)
    let datos = {
        mediciones: respuesta,
        tipos: respuesta2
    }
    res.status(201).json(datos);
})

medicionesPaciente = (peticion) => {
    return new Promise((resolve, reject) => {
        baseDatos.query(peticion, (err, respuesta) => {
            if (err) return reject(err);
            return resolve(respuesta);
        })
    })
}


//SISTEMA EXPERTO

app.get('/api/enfermero/:id/solicitarPrescripcion/:idCita', async (req, res) => {
    let idCita = req.params.idCita;
    //a partir de idCita se obtiene los datos del paciente, de su enfermedad 
    //y sus variables medicas mediante una llamada a la base de datos
    let idPaciente;
    let enfermedadPrincipal;
    try {
        //Obtenemos toda la informacion que necesita el sistema experto
        let datos = await datosCita(idCita);
        enfermedadPrincipal = datos[0]?.TipoRevision;
        fechaCita = datos[0]?.FechaHora;
        idPaciente = datos[0]?.IdPaciente;

        let infoPaciente = await datosPaciente(idPaciente);
        let tratPac = await tratamientos(idPaciente);
        let lactPac = await lactancia(idPaciente);
        let embPac = await embarazo(idPaciente);
        let alergPac = await alergias(idPaciente);
        let patPac = await patologias(idPaciente);
        let varMed = await variablesMedicas(idPaciente, idCita);

        //Procesado de tratamientos para mandar los principios activos por separado
        let idMedTomados = tratPac.map(trat => trat.IDFarmaco);
        let medPac = await medicamentos(idMedTomados);

        
        //Procesamos la informacion obtenida para enviarla al sistema experto
        let emb = embPac.length > 0 ? 1 : 0;
        let lact = lactPac.length > 0 ? 1 : 0;

        let tratamientoObtenido = await prescripcion({ enfPrin: enfermedadPrincipal, edad: calcularEdad(infoPaciente[0]?.FechaNacimiento), peso: infoPaciente[0]?.Peso, sexo: infoPaciente[0]?.Sexo, emb: emb, lact: lact, tratAct: tratPac, medAct: medPac, enfPrev: patPac, varMed: varMed, aler: alergPac });
        res.status(200).json(tratamientoObtenido);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }






    // sistExperto.prescripcion({ emb: 1, lact: 1, edad: 32 });
})

datosCita = (idCita) => {
    let petCita = `SELECT * FROM cita WHERE IDCita = '${idCita}'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petCita, (err, cita) => {
            if (err) return reject(err);
            return resolve(cita);
        });
    });
}

datosPaciente = (idPaciente) => {
    let petPac = `SELECT * FROM pacientes WHERE NIdentidad = '${idPaciente}'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petPac, (err, paciente) => {
            if (err) return reject(err);
            return resolve(paciente);
        });
    });
}

tratamientos = (idPaciente) => {
    let fechaHoy = new Date();
    fechaHoy = fechaHoy.toISOString().substring(0, 10);
    let petTratamiento = `SELECT * FROM tratamiento WHERE IdPaciente = '${idPaciente}' AND "${fechaHoy}" BETWEEN FechaInicio AND FechaFin`
    return new Promise((resolve, reject) => {
        baseDatos.query(petTratamiento, (err, tratamiento) => {
            if (err) return reject(err);
            return resolve(tratamiento);
        });
    })
}

lactancia = (idPaciente) => {
    let petLactancia = `SELECT * FROM lactancia WHERE IdPaciente = '${idPaciente}' AND Activa = '1'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petLactancia, (err, lactancia) => {
            if (err) return reject(err);
            return resolve(lactancia);
        });
    })
}

embarazo = (idPaciente) => {
    let petEmbarazo = `SELECT * FROM embarazo WHERE IdPaciente = '${idPaciente}' AND Activo = '1'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petEmbarazo, (err, embarazo) => {
            if (err) return reject(err);
            return resolve(embarazo);
        });
    })
}

alergias = (idPaciente) => {
    let petAlergias = `SELECT * FROM alergias WHERE IdPaciente = '${idPaciente}'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petAlergias, (err, alergias) => {
            if (err) return reject(err);
            return resolve(alergias);
        });
    })
}

patologias = (idPaciente) => {
    let petPatologia = `SELECT * FROM patologiasprevias WHERE IdPaciente = '${idPaciente}'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petPatologia, (err, patologia) => {
            if (err) return reject(err);
            return resolve(patologia);
        });
    });
}

variablesMedicas = (idPaciente, idCita) => {
    let petVar = `SELECT * FROM variablefisica WHERE IdPaciente = '${idPaciente}' AND Cita = '${idCita}'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petVar, (err, varMed) => {
            if (err) return reject(err);
            return resolve(varMed);
        })
    })
}
allVarMed = (idPaciente) => {
    let petVar = `SELECT * FROM variablefisica WHERE IdPaciente = '${idPaciente}'`
    return new Promise((resolve, reject) => {
        baseDatos.query(petVar, (err, varMed) => {
            if (err) return reject(err);
            return resolve(varMed);
        })
    })
}


medicamentos = (idMed) => {
    let idMedString = idMed.join(',');
    let petMed = `SELECT IDFarmaco, Nombre, PrincipioActivo, RiesgoEmbarazo, RiesgoLactancia FROM farmacos WHERE IDFarmaco IN (${idMed})`
    return new Promise((resolve, reject) => {
        baseDatos.query(petMed, (err, medicamentos) => {
            if (err) return reject(err);
            return resolve(medicamentos);
        });
    });
}


function calcularEdad(fechaNacimiento) {
    let nacimiento = new Date(fechaNacimiento)
    let hoy = new Date()
    var edad = hoy.getFullYear() - nacimiento.getFullYear()
    var m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad
}





//SISTEMA EXPERTO//
let idMedicamentoActual;
async function prescripcion({ enfPrin, edad, peso, sexo, emb, lact, tratAct, enfPrev, varMed, aler, medAct }) {

    //base de hechos --> toda la informacion pasada a la funcion como params

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
        "ACO INR 2-3": 3,
        "ACO INR 2.5-3.5": 4
    }

    let regla2 = {
        1: ["metformina", "gliclazida", "glipizida", "glimepirida", "insulina"],
        2: ["simvastatina", "enalapril", "ramipril", "clortalidona", "tiazida", "amlodipino"],
        3: ["acenocumarol", "warfarina"]
    }
    let regla3 = {
        metformina: 1, gliclazida: 2, glipizida: 3, glimepirida: 4, insulina: 5,
        simvastatina: 6, enalapril: 7, ramipril: 8, clortalidona: 9, amlodipino: 10,
        acenocumarol: 11, warfarina: 12
    }

    let principiosActivos = regla2[regla1[enfPrin]]; //estos son los posibles principios activos que puede usar el paciente para su enfermedad

    let medicamentoActual;
    let tratamientoPrincipal;
    //el siguiente bucle busca en los tratamientos del paciente el que coincida con uno de los principios activos que puede usar para su enfermedad
    for (let a = 0; a < medAct.length; a++){
        let medicamento = medAct[a];
        let prActs = medicamento.PrincipioActivo.split(' + ');

        // for (let b = 0; b < prActs.length; b++) {
        //     if (principiosActivos.includes(prActs[b])) {
        //         medicamentoActual = medicamento;
        //         break;
        //     }
        // }
        for (let c = 0; c < principiosActivos.length; c++) {
            let principio = principiosActivos[c];
            for (let d = 0; d < prActs.length; d++) {
                if (prActs[d].includes(principio)) {
                    medicamentoActual = medicamento;
                }
            }
        }
    }
    for (let a = 0; a < tratAct.length; a++) {
        let tratamiento = tratAct[a];
        if (tratamiento.IDFarmaco === medicamentoActual.IDFarmaco) {
            tratamientoPrincipal = tratamiento;
        }
    }
    idMedicamentoActual = medicamentoActual.IDFarmaco;
    // una vez se tiene el principio activo y el medicamento, se sigue en la pauta de prescripcion
    let tratamientoRecomendado;

    let riesgos = { //se refiere a los posibles estados del paciente que provoquen el descarte de un tratamiento
        emb: emb,
        lact: lact,
        enfPrev: enfPrev,
        alerg: aler,
        peso: peso
    }
    let resultado = { actualizacionTratamiento: null, salida: false };
    let principioBuscado;
    medicamentoActual.PrincipioActivo.includes("insulina") ? principioBuscado = "insulina" : principioBuscado = medicamentoActual.PrincipioActivo;
    if (regla1[enfPrin] == 1 && regla3[principioBuscado] == 1) { //TRATAMIENTO EN METFORMINA
        resultado = setMetformina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        if (resultado.salida != true) {
            resultado = setGliclazida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }
        if (resultado.salida != true) {
            resultado = setGlipizida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }

        if (resultado.salida != true) {
            resultado = setGlimepirida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }
        if (resultado.salida != true) {
            resultado = await setInsulina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos }); 
            console.log(resultado);
        }
    } else if (regla1[enfPrin] == 1 && regla3[principioBuscado] == 2) { //TRATAMIENTO EN SULFONILUREAS
        resultado = setGliclazida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        if (resultado.salida != true) {
            resultado = setGlipizida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }
        if (resultado.salida != true) {
            resultado = setGlimepirida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        } 
        if (resultado.salida != true) {
            resultado = await setInsulina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
            console.log(resultado);
        }
    } else if (regla1[enfPrin] == 1 && regla3[principioBuscado] == 3) { //TRATAMIENTO EN SULFONILUREAS 2
        resultado = setGlipizida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        if (resultado.salida != true) {
            resultado = setGlimepirida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }
        if (resultado.salida != true) {
            resultado = await setInsulina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
            console.log(resultado);
        }
    } else if (regla1[enfPrin] == 1 && regla3[principioBuscado] == 4) { //TRATAMIENTO EN SULFONILUREAS 3
        resultado = setGlimepirida({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        if (resultado.salida != true) {
            resultado = await setInsulina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }
    } else if (regla1[enfPrin] == 1 && regla3[principioBuscado] == 5) {
        resultado = await setInsulina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
    } else if (regla1[enfPrin] == 2 && regla3[principioBuscado] == 6) { //TRATAMIENTO EN SIMVASTATINA
        resultado = setSimvastatina({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos })
        console.log(resultado);
    } else if (regla1[enfPrin] == 2 && regla3[principioBuscado] == 7) { //TRATAMIENTO EN ENALAPRIL
        resultado = await setEnalapril({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        console.log(resultado);
        if (resultado.salida != true) {
            resultado = setRamipril({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        }
    } else if (regla1[enfPrin] == 2 && regla3[principioBuscado] == 8) { //TRATAMIENTO EN RAMIPRIL
        resultado = await setRamipril({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
    } else if (regla1[enfPrin] == 2 && regla3[principioBuscado] == 9) { //TRATAMIENTO EN CLORTALIDONA
        resultado = await setClortalidona({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
    } else if (regla1[enfPrin] == 2 && regla3[principioBuscado] == 10) { //TRATAMIENTO EN AMLODIPINO
        resultado = await setAmlodipino({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
    } else if (regla1[enfPrin] == 3 && regla3[principioBuscado] == 11) { //TRATAMIENTO EN ACENOCUMAROL ACO 2-3
        resultado = await setACO1({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        console.log(resultado);
    } else if (regla1[enfPrin] == 3 && regla3[principioBuscado] == 12) { //TRATAMIENTO EN WARFARINA ACO 2-3
        resultado = await setACO1({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
    } else if (regla1[enfPrin] == 4 && regla3[principioBuscado] == 11) { //TRATAMIENTO EN ACENOCUMAROL ACO 2.5-3.5
        resultado = await setACO2({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
        console.log(resultado);
    } else if (regla1[enfPrin] == 4 && regla3[principioBuscado] == 12) { //TRATAMIENTO EN WARFARINA ACO 2.5-3.5
        resultado = await setACO2({ dosis: tratamientoPrincipal.Cantidad, varMed: varMed, medicamento: medicamentoActual, riesgos: riesgos });
    }
    tratamientoRecomendado = resultado.actualizarTratamiento;
    //motor de inferencia
    if (resultado.salida == false) {
        throw "ErrorTratamiento";
    }

    let datosTratamiento;
    if (tratamientoRecomendado == null) { //si el sistema experto no hace ningun cambio, se mantiene el tratamiento que ya se tenia
        datosTratamiento = {
            medicamento: [medicamentoActual],
            indicaciones: tratamientoPrincipal.Anotaciones,
            dosis: tratamientoPrincipal.Cantidad,
            frecuencia: tratamientoPrincipal.IntervaloTomas,
            fechaInicio: tratamientoPrincipal.FechaInicio,
            fechaFin: tratamientoPrincipal.FechaFin
        }
    } else {
        datosTratamiento = { //en caso de que el sistema experto haga cambios, se genera el nuevo tratamiento
            medicamento: tratamientoRecomendado.medicamento,
            indicaciones: tratamientoRecomendado.indicaciones,
            dosis: tratamientoRecomendado.dosis,
            frecuencia: tratamientoRecomendado.frecuencia || tratamientoPrincipal.IntervaloTomas,
            fechaInicio: tratamientoRecomendado.fechaInicio,
            fechaFin: tratamientoRecomendado.fechaFin,
        }
    }
    return datosTratamiento;
}


function setMetformina({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) { return { actualizarTratamiento: null, salida: false } }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }
    //ahora se lee las dos medidas de GBC tomadas en el dia de la cita, por lo tanto deberia buscarse
    //en varMed dos medidas de GBC con la fecha del mismo dia de la cita y se saca la media de ambas
    var fecha = new Date();
    let fechaCita = moment(fecha).format("YYYY-MM-DD");


    let GBCsHoy = [];
    let hba1cHoy = varMed.filter(med => med.Tipo == 6 && moment(med.Fecha).format("YYYY-MM-DD") == fechaCita);
    for (let a = 0; a < varMed.length; a++) {
        medida = varMed[a];
        let fechaMedida = moment(medida.Fecha).format("YYYY-MM-DD");
        if (medida.Tipo == 5 && fechaMedida == fechaCita) {
            GBCsHoy.push(medida.Valor);
        }
    }
    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio : "",
        fechaFin: ""
    }
    
    if (GBCsHoy.length == 0 && hba1cHoy.length == 0) return { actualizarTratamiento: null, salida: true } //si no hay tomadas medidas, se devuelve null para que se muestre el tratamiento actual en el cliente
    if (hba1cHoy.length > 0) {
        let valor = hba1cHoy[hba1cHoy.length -1].Valor;
        if (valor < 7.0) {
            dosisReturn = dosis;
            actualizacionTratamiento.dosis = dosisReturn;
            actualizacionTratamiento.medicamento = [ medicamento ];
            actualizacionTratamiento.fechaInicio = new Date (moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date (moment(fecha).add(6, "months").format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "Revisión de HbA1c en 6 meses" // no se modificará nada mas
            return actualizacionTratamiento;
        } else {
            dosisReturn = dosis;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "DERIVAR A MÉDICO DE FAMILIA" // no se modificará nada mas
            return actualizacionTratamiento;
        }
    }


    
    let GBCMedia = (GBCsHoy[0] + GBCsHoy[1]) / 2 || GBCsHoy[0];
    // transformar GBCMedia a entero
    GBCMedia = Math.round(GBCMedia);
    if (GBCMedia < 130) {
        dosisReturn = dosis;
    } else if (GBCMedia > 130) {
        let dosisNueva = dosis.substring(0, dosis.length - 2);
        dosisNueva = parseInt(dosisNueva) + 425;
        dosisNueva = `${dosisNueva} mg`;
        dosisReturn = dosisNueva;
    }

    actualizacionTratamiento.dosis = dosisReturn;
    actualizacionTratamiento.fechaInicio = new Date();
    // en funcion de la dosis se crean las indicaciones del tratamiento
    if (dosisReturn == "850 mg") {
        actualizacionTratamiento.frecuencia = "12"
        actualizacionTratamiento.indicaciones = "Tomar dos veces al día, en el desayuno y en la cena.";
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
    }
    else if (dosisReturn == "1275 mg") {
        actualizacionTratamiento.frecuencia = "8"
        actualizacionTratamiento.indicaciones = "Tomar tres veces al día, 1/2 pastilla en el desayuno, 1/2 pastilla en la comida y 1/2 pastilla en la cena.";
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
    }
    else if (dosisReturn == "1700 mg") {
        actualizacionTratamiento.frecuencia = "12"
        actualizacionTratamiento.indicaciones = "Tomar una pastilla en el desayuno, y otra en la cena";
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
    }
    else if (dosisReturn == "2125 mg") {
        actualizacionTratamiento.frecuencia = "8"
        actualizacionTratamiento.indicaciones = "Tres tomas al día, una pastilla en el desayuno, otra en la comida y 1/2 en la cena. Si se considera necesario, aumentar dosis a 2550 mg/dia, una pastilla cada 8 horas, desayuno, comida y cena.";
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
    } else if (dosisReturn == "425 mg") {
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar una pastilla con la comida.";
    }
    if (dosisReturn == dosis) { //en caso de que no se haya cambiado la dosis, se le da cita dentro de 3 meses
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.indicaciones += " Se debe citar dentro de 3 meses para una revisión de HbA1c.";
    }
    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };

    return salida;


}

function setGliclazida({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }

    var fecha = new Date();
    let fechaCita = moment(fecha).format("YYYY-MM-DD");



    let GBCsHoy = [];
    let hba1cHoy = varMed.filter(med => med.Tipo == 6 && moment(med.Fecha).format("YYYY-MM-DD") == fechaCita);
    for (let a = 0; a < varMed.length; a++) {
        medida = varMed[a];
        let fechaMedida = moment(medida.Fecha).format("YYYY-MM-DD");
        if (medida.Tipo == 5 && fechaMedida == fechaCita) {
            GBCsHoy.push(medida.Valor);
        }
    }
    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    if (GBCsHoy.length == 0 && hba1cHoy.length == 0) return { actualizarTratamiento: null, salida: true };

    if (hba1cHoy.length > 0) {
        let valor = hba1cHoy[hba1cHoy.length - 1].Valor;
        if (valor < 7.0) {
            dosisReturn = dosis;
            actualizacionTratamiento.dosis = dosisReturn;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(6, "months").format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "Revisión de HbA1c en 6 meses" // no se modificará nada mas
            return actualizacionTratamiento;
        } else {
            dosisReturn = dosis;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "DERIVAR A MÉDICO DE FAMILIA" // no se modificará nada mas
            return actualizacionTratamiento;
        }
    }

    let GBCMedia = (GBCsHoy[0] + GBCsHoy[1]) / 2 || GBCsHoy[0];
    // transformar GBCMedia a entero
    GBCMedia = Math.round(GBCMedia);
    if (GBCMedia < 130) {
        dosisReturn = dosis;
    } else if (GBCMedia > 130) {
        let dosisNueva = dosis.substring(0, dosis.length - 2);
        dosisNueva = parseInt(dosisNueva) + 30;
        dosisNueva = `${dosisNueva} mg`;
        dosisReturn = dosisNueva;
    }


    if (dosisReturn != dosis) {
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar antes del desayuno.";
    } else if (dosisReturn > 120) {
        dosisReturn = "120 mg";
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar antes del desayuno, la próxima revisión será de HbA1c dentro de 3 meses, dosis máxima alcanzada.";
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
    }
    if (dosisReturn == dosis) { //en caso de que no se haya cambiado la dosis, se le da cita dentro de 3 meses
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.indicaciones += " Se debe citar dentro de 3 meses para una revisión de HbA1c.";
    }
    actualizacionTratamiento.dosis = dosisReturn;
    actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));

    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    return salida;

}

function setGlipizida({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }
    var fecha = new Date();
    let fechaCita = moment(fecha).format("YYYY-MM-DD");



    let GBCsHoy = [];
    let hba1cHoy = varMed.filter(med => med.Tipo == 6 && moment(med.Fecha).format("YYYY-MM-DD") == fechaCita);
    for (let a = 0; a < varMed.length; a++) {
        medida = varMed[a];
        let fechaMedida = moment(medida.Fecha).format("YYYY-MM-DD");
        if (medida.Tipo == 5 && fechaMedida == fechaCita) {
            GBCsHoy.push(medida.Valor);
        }
    }
    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    if (GBCsHoy.length == 0 && hba1cHoy.length == 0) return { actualizarTratamiento: null, salida: true }

    if (hba1cHoy.length > 0) {
        let valor = hba1cHoy[hba1cHoy.length - 1].Valor;
        if (valor < 7.0) {
            dosisReturn = dosis;
            actualizacionTratamiento.dosis = dosisReturn;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(6, "months").format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "Revisión de HbA1c en 6 meses" // no se modificará nada mas
            return { actualizarTratamiento: actualizacionTratamiento, salida: true };
        } else {
            dosisReturn = dosis;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "DERIVAR A MÉDICO DE FAMILIA" // no se modificará nada mas
            return { actualizarTratamiento: actualizacionTratamiento, salida: true };
        }
    }

    let GBCMedia = (GBCsHoy[0] + GBCsHoy[1]) / 2 || GBCsHoy[0];
    // transformar GBCMedia a entero
    GBCMedia = Math.round(GBCMedia);
    if (GBCMedia < 130) {
        dosisReturn = dosis;
    } else if (GBCMedia > 130) {
        let dosisNueva = dosis.substring(0, dosis.length - 2);
        dosisNueva = parseFloat(dosisNueva.replace(",", "."));
        dosisNueva = dosisNueva + 2.5;
        dosisNueva = `${dosisNueva} mg`;
        dosisReturn = dosisNueva;
    }


    if (dosisReturn != dosis) {
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar antes del desayuno.";
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
    } else if ((dosisReturn.substring(0, dosis.length - 2)) > 15) {
        dosisReturn = "15 mg";
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar antes del desayuno, la próxima revisión será de HbA1c dentro de 3 meses, dosis máxima alcanzada.";
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
    }
    if (dosisReturn == dosis) { //en caso de que no se haya cambiado la dosis, se le da cita dentro de 3 meses
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.indicaciones += " Se debe citar dentro de 3 meses para una revisión de HbA1c.";
    }
    actualizacionTratamiento.dosis = dosisReturn;
    actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));

    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    return salida;
}

function setGlimepirida({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }

    var fecha = new Date();
    let fechaCita = moment(fecha).format("YYYY-MM-DD");



    let GBCsHoy = [];
    let hba1cHoy = varMed.filter(med => med.Tipo == 6 && moment(med.Fecha).format("YYYY-MM-DD") == fechaCita);
    for (let a = 0; a < varMed.length; a++) {
        medida = varMed[a];
        let fechaMedida = moment(medida.Fecha).format("YYYY-MM-DD");
        if (medida.Tipo == 5 && fechaMedida == fechaCita) {
            GBCsHoy.push(medida.Valor);
        }
    }
    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    if (GBCsHoy.length == 0 && hba1cHoy.length == 0) return { actualizarTratamiento: null, salida: true }

    if (hba1cHoy.length > 0) {
        let valor = hba1cHoy[hba1cHoy.length - 1].Valor;
        if (valor < 7.0) {
            dosisReturn = dosis;
            actualizacionTratamiento.dosis = dosisReturn;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(6, "months").format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "Revisión de HbA1c en 6 meses" // no se modificará nada mas
            return actualizacionTratamiento;
        } else {
            dosisReturn = dosis;
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).format("YYYY-MM-DD"));
            actualizacionTratamiento.indicaciones += "DERIVAR A MÉDICO DE FAMILIA" // no se modificará nada mas
            return actualizacionTratamiento;
        }
    }

    let GBCMedia = (GBCsHoy[0] + GBCsHoy[1]) / 2 || GBCsHoy[0];
    // transformar GBCMedia a entero
    GBCMedia = Math.round(GBCMedia);
    if (GBCMedia < 130) {
        dosisReturn = dosis;
    } else if (GBCMedia > 130) {
        let dosisNueva = dosis.substring(0, dosis.length - 2);
        dosisNueva = parseInt(dosisNueva) + 1;
        dosisNueva = `${dosisNueva} mg`;
        dosisReturn = dosisNueva;
    }


    if (dosisReturn != dosis) {
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar antes del desayuno.";
    } else if (dosisReturn > 4) {
        dosisReturn = "4 mg";
        actualizacionTratamiento.frecuencia = "24"
        actualizacionTratamiento.indicaciones = "Tomar antes del desayuno, la próxima revisión será de HbA1c dentro de 3 meses, la dosis máxima se ha alcanzado";
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
    }
    if (dosisReturn == dosis) { //en caso de que no se haya cambiado la dosis, se le da cita dentro de 3 meses
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.indicaciones += " Se debe citar dentro de 3 meses para una revisión de HbA1c.";
    }
    actualizacionTratamiento.dosis = dosisReturn;
    actualizacionTratamiento.fechaInicio = new Date(moment(fecha).format("YYYY-MM-DD"));

    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    return salida;
}

async function setInsulina({ dosis, varMed, medicamento, riesgos }) { 

    let actualizarTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }
    if (!medicamento.PrincipioActivo.includes("insulina")) { //es decir en caso de que su tratamiento actual no sea insulina
        let opciones = await buscarMedicamento("insulina isofana")
        let dosis = riesgos.peso * 0.2;
        // transformar dosis a string y cambiar "." por ","
        let dosisString = dosis.toString();
        dosisString = dosisString.replace(".", ",");
        actualizarTratamiento = {
            medicamento: opciones,
            indicaciones: `Hay que cambiar el tratamiento y empezar a usar insulina. \nLa siguiente revisión será en cuatro días. \nRemitir a médico para revisión de tratamiento. \nTomar ${(dosis*(2/3)).toFixed(2)} UI antes de desayunar y ${(dosis * (1/3)).toFixed(2)} UI antes de cenar.`,
            dosis: `${dosisString} UI`,
            frecuencia: 12,
            fechaInicio: new Date(moment().format("YYYY-MM-DD")),
            fechaFin: new Date(moment().add(4, "days").format("YYYY-MM-DD"))
        }
        salida = true;
        return { actualizarTratamiento, salida };
    }
    return {actualizarTratamiento: null, salida: true}
}



function setSimvastatina({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }

    var fecha = new Date();
    let actualizarTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    let medidas = verPreviasLDL(varMed); //devuelve si las mediciones de LDL son buenas, nulas o malas, 3 es si es demasiado baja
    
    let actual = medidas.actual;
    let previa1 = medidas.previa1;
    if (previa1 === 0) {
        actualizarTratamiento.indicaciones = "No hay mediciones de LDL previas.\nComprobar efectos secundarios en el paciente, si menciona alguno relacionado con el medicamento, se debe derivar a médico de familia. \nRegistrar medidas de LDL de la cita de hoy y dar cita para dentro de 6 meses.";
        actualizarTratamiento.fechaInicio = fecha;
        actualizarTratamiento.fechaFin = new Date(moment(fecha).add(6, "months").format("YYYY-MM-DD"));
        actualizarTratamiento.medicamento = medicamento;
        actualizarTratamiento.dosis = dosis;
        actualizarTratamiento.frecuencia = "24";
    } else if (previa1 != 0 && actual == 2) { //si va bien
        actualizarTratamiento.dosis = dosis;
        actualizarTratamiento.frecuencia = "24";
        actualizarTratamiento.fechaInicio = fecha;
        actualizarTratamiento.fechaFin = new Date(moment(fecha).add(6, "months").format("YYYY-MM-DD"));
        actualizarTratamiento.medicamento = medicamento;
        actualizarTratamiento.indicaciones = "Animar al paciente a mantener su estilo de vida y recordarle la importancia de la dieta. \nSi menciona efectos secundarios se debe derivar al médico de familia."
    } else if (previa1 != 0 && actual == 1) { //si va mal
        actualizarTratamiento.frecuencia = "24";
        actualizarTratamiento.fechaInicio = fecha;
        actualizarTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizarTratamiento.medicamento = medicamento;
        actualizarTratamiento.indicaciones = "Recordar al paciente la importancia de los hábitos de vida saludables y la dieta. \nSi menciona efectos secundarios se debe derivar al médico de familia."
        if (parseInt(dosis.substring(0, dosis.length - 2)) == 20) {
            actualizarTratamiento.dosis = "40 mg";
        } else if (parseInt(dosis.substring(0, dosis.length - 2)) < 20) {
            actualizarTratamiento.dosis = "20 mg";
        }


    } else if (previa1 != 0 && actual == 3) {
        actualizarTratamiento.frecuencia = "24";
        actualizarTratamiento.fechaInicio = fecha;
        actualizarTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizarTratamiento.medicamento = medicamento;
        actualizarTratamiento.indicaciones = "El LDL es demasiado bajo, hay que reducir la dosis. \nSi menciona efectos secundarios se debe derivar al médico de familia."
        dosis = dosis.substring(0, dosis.length - 2);
        if (dosis == "40") {
            actualizarTratamiento.dosis = "40 mg";
        } else if (dosis == 20) { 
            actualizarTratamiento.dosis = "15 mg";
            actualizarTratamiento.indicaciones = "El LDL es demasiado bajo, hay que reducir la dosis, se ha reducido a 15 mg/día, confirmar que es correcto. \nSi menciona efectos secundarios se debe derivar al médico de familia."
        }
    }
    
    return { actualizarTratamiento: actualizarTratamiento, salida: true }
    

}

async function setEnalapril({ dosis, varMed, medicamento, riesgos }) { 
    let idPaciente = varMed[1].IDPaciente;
    let varMedicas = await allVarMed(idPaciente);
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }

    var fecha = new Date();


    
    // en las siguientes variables se almacenan los estados de las medidas para saber si estan bien o mal
    let actual = 0; //0 para no hay datos, 1 para mal, 2 para bien
    let previa1 = 0; 
    let previa2 = 0;
    let previa3 = 0;
    

    // let varMed = await allVarMed()
    let previas = verPreviasTension(varMedicas);
    
    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    actual = previas.actual;
    previa1 = previas.previa1;
    previa2 = previas.previa2;
    previa3 = previas.previa3;
    if (actual === 0) return { actualizarTratamiento: null, salida: true }
    if (actual === 2 && previa1 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
        return { actualizarTratamiento: actualizacionTratamiento, salida: true };
    }
    if (actual === 2 && previa1 === 2 && previa2 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 2) { 
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Derivación anual a médico de familia. \nMantener dosis y tomar una vez al día. \nSolicitar analíticas y ECG.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    };

    if (actual === 1 && previa1 === 0) {
        console.log("entrando aqui");
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta, tiene que mejorar, está fuera de objetivos.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && dosis.substring(0, dosis.length - 2) < "40") { // si lleva dos citas fuera de los objetivos
        dosisReturn = `${parseFloat(dosis.substring(0, dosis.length - 2)) * 2} mg`; // se duplica la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Duplicar la dosis, hablar con el paciente si desea tomar todo en una toma o prefiere dividir la medicamento en una toma cada 12 horas.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && parseInt(dosis.substring(0, dosis.length - 2)) == 40) { // si lleva citas fuera de los objetivos y el tratamiento ha alcanzado el maximo
        dosisReturn = dosis;
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Se ha alcanzado la dosis máxima. \nDerivar a médico de familia para revisar tratamiento y mantener tratamiento mientras tanto.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 3) {
        actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento.";
        let dosis = dosis.substring(0, dosis.length - 2);
        if (dosis == "40") {
            dosisReturn = "20 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 20mg/día, revisar si es correcto.";
        } else if (dosis == "20") {
            dosisReturn = "10 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 10mg/día, revisar si es correcto.";
        }
        else if (dosis == 10) {
            dosisReturn = "5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 5mg/día, revisar si es correcto.";
        }else if (dosis == 5) {
            dosisReturn = "5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión.\nYa no se puede reducir más la dosis. Derivar a médico de familia para revisar el tratamiento.";
        }
        actualizacionTratamiento.medicamento = [medicamento];

        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    

    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    console.log("return");
    return salida;
    
}
async function setRamipril({ dosis, varMed, medicamento, riesgos }) { 
    let idPaciente = varMed[1].IDPaciente;
    let varMedicas = await allVarMed(idPaciente);
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }

    var fecha = new Date();
    let fechaCita = moment(fecha).format("YYYY-MM-DD");



    let tensionSHoy; //medidas de tension diastolica de hoy
    let tensionDHoy; //medidas de tension sistolica
    let tensionSPrevia; //ultima medida
    let tensionDPrevia;
    let tensionSPrevia1; // penultima medida
    let tensionDPrevia1;
    let tensionSPrevia2; // antepenultima medida
    let tensionDPrevia2;


    // en las siguientes variables se almacenan los estados de las medidas para saber si estan bien o mal
    let actual = 0; //0 para no hay datos, 1 para mal, 2 para bien
    let previa1 = 0;
    let previa2 = 0;
    let previa3 = 0;


    // let varMed = await allVarMed()
    let previas = verPrevias(varMedicas);

    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    actual = previas.actual;
    previa1 = previas.previa1;
    previa2 = previas.previa2;
    previa3 = previas.previa3;
    if (actual === 0) return { actualizarTratamiento: null, salida: true }
    if (actual === 2 && previa1 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
        return { actualizarTratamiento: actualizacionTratamiento, salida: true };
    }
    if (actual === 2 && previa1 === 2 && previa2 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 2) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Derivación anual a médico de familia. \nMantener dosis y tomar una vez al día. \nSolicitar analíticas y ECG.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    };

    if (actual === 1 && previa1 === 0) {
        console.log("entrando aqui");
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta, tiene que mejorar, está fuera de objetivos.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && dosis.substring(0, dosis.length - 2) < "10") { // si lleva dos citas fuera de los objetivos
        dosisReturn = `${parseFloat(dosis.substring(0, dosis.length - 2)) * 2} mg`; // se duplica la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Duplicar la dosis, hablar con el paciente si desea tomar todo en una toma o prefiere dividir la medicamento en una toma cada 12 horas.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && dosis.substring(0, dosis.length - 2) == "10") { // si lleva citas fuera de los objetivos y el tratamiento ha alcanzado el maximo
        dosisReturn = dosis;
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Se ha alcanzado la dosis máxima. \nDerivar a médico de familia para revisar tratamiento y mantener tratamiento mientras tanto.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 3) {
        actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento.";
        let dosis = dosis.substring(0, dosis.length - 2);
        if (dosis == "10") {
            dosisReturn = "5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 5mg/día, revisar si es correcto.";
        } else if (dosis == "5") {
            dosisReturn = "2,5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 2,5mg/día, revisar si es correcto.";
        }
        else if (dosis == "2.5") {
            dosisReturn = "2,5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión.\nYa no se puede reducir más la dosis. Derivar a médico de familia para revisar el tratamiento.";
        }
        actualizacionTratamiento.medicamento = [medicamento];

        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }



    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    console.log("return");
    return salida;
}


async function setClortalidona({ dosis, varMed, medicamento, riesgos }) {
    let idPaciente = varMed[1].IDPaciente;
    let varMedicas = await allVarMed(idPaciente);
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }

    var fecha = new Date();



    // en las siguientes variables se almacenan los estados de las medidas para saber si estan bien o mal
    let actual = 0; //0 para no hay datos, 1 para mal, 2 para bien
    let previa1 = 0;
    let previa2 = 0;
    let previa3 = 0;


    // let varMed = await allVarMed()
    let previas = verPreviasTension(varMedicas);

    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    actual = previas.actual;
    previa1 = previas.previa1;
    previa2 = previas.previa2;
    previa3 = previas.previa3;
    if (actual === 0) return { actualizarTratamiento: null, salida: true }
    if (actual === 2 && previa1 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
        return { actualizarTratamiento: actualizacionTratamiento, salida: true };
    }
    if (actual === 2 && previa1 === 2 && previa2 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 2) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Derivación anual a médico de familia. \nMantener dosis y tomar una vez al día. \nSolicitar analíticas y ECG.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    };

    if (actual === 1 && previa1 === 0) {
        console.log("entrando aqui");
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta, tiene que mejorar, está fuera de objetivos.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && parseInt(dosis.substring(0, dosis.length - 2)) == "25") { // si lleva dos citas fuera de los objetivos
        dosisReturn = `${parseInt(dosis.substring(0, dosis.length - 2)) * 2} mg`; // se duplica la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Subir dosis a 50 mg/día, hablar con el paciente si desea tomar todo en una toma o prefiere dividir la medicamento en una toma cada 12 horas.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && parseInt(dosis.substring(0, dosis.length - 2)) == 50) { // si lleva citas fuera de los objetivos y el tratamiento ha alcanzado el maximo
        dosisReturn = dosis;
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Se ha alcanzado la dosis máxima. \nDerivar a médico de familia para revisar tratamiento y mantener tratamiento mientras tanto.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && previa2 === 1) {
        dosisReturn = dosis;
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Se ha alcanzado la dosis máxima. \nDerivar a médico de familia para revisar tratamiento y mantener tratamiento mientras tanto.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 3) {
        let dosis = dosis.substring(0, dosis.length - 2);
        actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento.";
        if (dosis == "50") {
            dosisReturn = "25 mg";
        } else if (dosis == "25") { 
            dosisReturn = "12,5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 12,5mg/día, revisar si es correcto.";
        } else if (dosis == "12,5") {
            dosisReturn = "12,5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión.\nYa no se puede reducir más la dosis. Derivar a médico de familia para revisar el tratamiento.";
        }
        actualizacionTratamiento.medicamento = [medicamento];
        
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }


    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    console.log("return");
    return salida;

}

async function setAmlodipino({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }
    
    var fecha = new Date();
    
    let idPaciente = varMed[1].IDPaciente;
    let varMedicas = await allVarMed(idPaciente);


    // en las siguientes variables se almacenan los estados de las medidas para saber si estan bien o mal
    let actual = 0; //0 para no hay datos, 1 para mal, 2 para bien
    let previa1 = 0;
    let previa2 = 0;
    let previa3 = 0;


    // let varMed = await allVarMed()
    let previas = verPreviasTension(varMedicas);

    let dosisReturn;
    let actualizacionTratamiento = { //este sera el objeto devuelto por la funcion
        medicamento,
        indicaciones: "",
        dosis,
        frecuencia: "",
        fechaInicio: "",
        fechaFin: ""
    }

    actual = previas.actual;
    previa1 = previas.previa1;
    previa2 = previas.previa2;
    previa3 = previas.previa3;
    if (actual === 0) return { actualizarTratamiento: null, salida: true }
    if (actual === 2 && previa1 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
        return { actualizarTratamiento: actualizacionTratamiento, salida: true };
    }
    if (actual === 2 && previa1 === 2 && previa2 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 0) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 3 meses.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    if (actual === 2 && previa1 === 2 && previa2 === 2 && previa3 === 2) {
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Derivación anual a médico de familia. \nMantener dosis y tomar una vez al día. \nSolicitar analíticas y ECG.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(3, "months").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    };

    if (actual === 1 && previa1 === 0) {
        console.log("entrando aqui");
        dosisReturn = dosis; // se mantiene la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Mantener la dosis, tomar una vez al día.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta, tiene que mejorar, está fuera de objetivos.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && parseFloat(dosis.substring(0, dosis.length - 2)) < 10) { // si lleva dos citas fuera de los objetivos
        dosisReturn = `${parseFloat(dosis.substring(0, dosis.length - 2)) * 2} mg`; // se duplica la dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = `Subir dosis a ${dosisReturn}mg/día, hablar con el paciente si desea tomar todo en una toma o prefiere dividir la medicamento en una toma cada 12 horas.\nDar cita para revisión en 15 días. \nRecordar al paciente la importancia de sus hábitos de vida y la dieta.`;
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && parseFloat(dosis.substring(0, dosis.length - 2)) == 10) { // si lleva citas fuera de los objetivos y el tratamiento ha alcanzado el maximo
        dosisReturn = dosis;
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Se ha alcanzado la dosis máxima. \nDerivar a médico de familia para revisar tratamiento y mantener tratamiento mientras tanto.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 1 && previa1 === 1 && previa2 === 1) {
        dosisReturn = dosis;
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "Se ha alcanzado la dosis máxima. \nDerivar a médico de familia para revisar tratamiento y mantener tratamiento mientras tanto.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    } else if (actual === 3) {
        actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento.";
        let dosis = parseFloat(dosis.substring(0, dosis.length - 2));
        dosis = dosis.replace(",", ".");
        if (dosis == 10) {
            dosisReturn = "5 mg";
        } else if (dosis == 5) {
            dosisReturn = "2,5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión, reducir la dosis o derivar a médico de familia para revisar el tratamiento. \nSe ha ajustado la dosis a 12,5mg/día, revisar si es correcto.";
        } else if (dosis == "2,5") {
            dosisReturn = "2,5 mg";
            actualizacionTratamiento.indicaciones = "Se ha detectado hipotensión.\nYa no se puede reducir más la dosis. Derivar a médico de familia para revisar el tratamiento.";
        }
        actualizacionTratamiento.medicamento = [medicamento];

        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(15, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosisReturn;
    }
    
    
    let salida = { actualizarTratamiento: actualizacionTratamiento, salida: true };
    console.log("return");
    return salida;
}
async function setACO1({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }


    if (varMed.length === 0) return { actualizarTratamiento: null, salida: true } // si no hay medidas tomadas, no se sigue

    let actualizacionTratamiento = {
        medicamento: [],
        indicaciones: "",
        fechaInicio: null,
        fechaFin: null,
        frecuencia: "",
        dosis: ""
    };

    let idPaciente = varMed[0].IDPaciente;
    let varMedicas = await allVarMed(idPaciente);
    var fecha = new Date();

    let medidas = verPreviasINR(varMedicas);
    console.log("hola");
    console.log(medidas);
    let actual = 1.8 < medidas.actuales < 3.2 ? 1 : 0;
    let previa1 = 1.8 < medidas.previa1 < 3.2 ? 1 : 0;
    let previa2 = 1.8 < medidas.previa2 < 3.2 ? 1 : 0;
    let previa3 = 1.8 < medidas.previa3 < 3.2 ? 1 : 0;

    let dosisFloat = parseFloat(dosis.substring(0, dosis.length - 2));
    let DTS = dosisFloat * 7; // la dosis se ajusta en funcion de la dosis terapeutica semanal
    if (actual === 1 && previa1 === 1) { // mantener dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "El paciente va bien, mantener la dosis y dar cita para dentro de 4-6 semanas.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(5, "weeks").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosis;
    } else if (actual === 1 && previa1 !== 1) { // mantener dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "El paciente se ha estabilizado, mantener la dosis y dar cita para dentro de 4-6 semanas.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosis;
    } else if (actual !== 1) {
        if (previa1 !== 1) {
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.indicaciones = "El paciente no se estabiliza, se debe desviar al médico.";
            actualizacionTratamiento.fechaInicio = fecha;
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
            actualizacionTratamiento.frecuencia = "24";
            actualizacionTratamiento.dosis = dosis;
        } else if (previa1 === 1 || previa1 === undefined) {
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.indicaciones = "Preguntar a cerca de las causas, si son puntuales se debe mantener la dosis. \nSi no es puntual, cambiar la dosis a la sugerida, si no, mantener la que se muestra en sus tratamientos en curso.";
            actualizacionTratamiento.fechaInicio = fecha;
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
            actualizacionTratamiento.frecuencia = "24";
            if (1.6<=medidas.actuales < 1.7) {
                dts = dts * 1.1;
                dosisFloat = dts / 7;
                actualizacionTratamiento.dosis = `${dosisFloat} mg`;
            } else if (3.3 <= medidas.actuales <= 3.9) {
                dts = dts * 0.9;
                dosisFloat = dts / 7;
                actualizacionTratamiento.dosis = `${dosisFloat} mg`;
            } else if (4<=medidas.actuales <= 4.9) {
                dts = dts * 0.85;
                dosisFloat = dts / 7;
                actualizacionTratamiento.dosis = `${dosisFloat} mg`;
            } else if (medidas.actuales <= 2) {
                actualizacionTratamiento.indicaciones = "Desviar al médico, el INR es muy bajo.";
                actualizacionTratamiento.dosis = dosis;
            } else if (medidas.actuales >= 5) {
                actualizacionTratamiento.indicaciones = "Desviar al médico, el INR es muy alto. Recomendar al paciente no tomar la medicación durante ese día.";
            }

        }
    }



    return { actualizarTratamiento: actualizacionTratamiento, salida: true }
}

async function setACO2({ dosis, varMed, medicamento, riesgos }) {
    if (riesgos.emb === 1 || riesgos.lact === 1) return { actualizarTratamiento: null, salida: false }
    let alergias = (riesgos.alerg).map(alergia => alergia.Alergeno.toLowerCase())
    if (alergias.includes(medicamento.PrincipioActivo.toLowerCase())) return { actualizarTratamiento: null, salida: false }


    if (varMed.length === 0) return { actualizarTratamiento: null, salida: true } // si no hay medidas tomadas, no se sigue
    
    let actualizacionTratamiento = {
        medicamento: [],
        indicaciones: "",
        fechaInicio: null,
        fechaFin: null,
        frecuencia: "",
        dosis: ""
    };

    let idPaciente = varMed[0].IDPaciente;
    let varMedicas = await allVarMed(idPaciente);
    var fecha = new Date();

    let medidas = verPreviasINR(varMedicas);
    console.log("hola");
    console.log(medidas);
    let actual = 2.3 < medidas.actuales < 3.7 ? 1 : 0;
    let previa1 = 2.3 < medidas.previa1 < 3.7 ? 1 : 0;
    let previa2 = 2.3 < medidas.previa2 < 3.7 ? 1 : 0;
    let previa3 = 2.3 < medidas.previa3 < 3.7 ? 1 : 0;

    let dosisFloat = parseFloat(dosis.substring(0, dosis.length - 2));
    let DTS = dosisFloat * 7; // la dosis se ajusta en funcion de la dosis terapeutica semanal
    if (actual === 1 && previa1 === 1) { // mantener dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "El paciente va bien, mantener la dosis y dar cita para dentro de 4-6 semanas.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(5, "weeks").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosis;
    } else if (actual === 1 && previa1 !== 1) { // mantener dosis
        actualizacionTratamiento.medicamento = [medicamento];
        actualizacionTratamiento.indicaciones = "El paciente se ha estabilizado, mantener la dosis y dar cita para dentro de 4-6 semanas.";
        actualizacionTratamiento.fechaInicio = fecha;
        actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
        actualizacionTratamiento.frecuencia = "24";
        actualizacionTratamiento.dosis = dosis;
    } else if (actual !== 1) {
        if (previa1 !== 1) {
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.indicaciones = "El paciente no se estabiliza, se debe desviar al médico.";
            actualizacionTratamiento.fechaInicio = fecha;
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
            actualizacionTratamiento.frecuencia = "24";
            actualizacionTratamiento.dosis = dosis;
        } else if (previa1 === 1 || previa1 === undefined) {
            actualizacionTratamiento.medicamento = [medicamento];
            actualizacionTratamiento.indicaciones = "Preguntar a cerca de las causas, si son puntuales se debe mantener la dosis. \nSi no es puntual, cambiar la dosis a la sugerida, si no, mantener la que se muestra en sus tratamientos en curso.";
            actualizacionTratamiento.fechaInicio = fecha;
            actualizacionTratamiento.fechaFin = new Date(moment(fecha).add(7, "days").format("YYYY-MM-DD"));
            actualizacionTratamiento.frecuencia = "24";
            if (2.1<=medidas.actuales <= 2.2) {
                dts = dts * 1.1;
                dosisFloat = dts / 7;
                actualizacionTratamiento.dosis = `${dosisFloat} mg`;
            } else if (3.8 <= medidas.actuales <= 3.9) {
                dts = dts * 0.9;
                dosisFloat = dts / 7;
                actualizacionTratamiento.dosis = `${dosisFloat} mg`;
            } else if (medidas.actuales > 3.9) { 
                dts = dts * 0.85;
                dosisFloat = dts / 7;
                actualizacionTratamiento.dosis = `${dosisFloat} mg`;
            } else if (medidas.actuales <= 2) {
                actualizacionTratamiento.indicaciones = "Desviar al médico, el INR es muy bajo.";
                actualizacionTratamiento.dosis = dosis;
            } else if (medidas.actuales >= 5) {
                actualizacionTratamiento.indicaciones = "Desviar al médico, el INR es muy alto. Recomendar al paciente no tomar la medicación durante ese día.";
            }
            
        }
    }



    return { actualizarTratamiento: actualizacionTratamiento, salida: true }
}



function verPreviasTension(varMed) {
    let citas = [];
    let actual = 2;
    let previa1 = 2; // aqui se asignan los valores para ver si estaba bien o no en las semanas anteriores
    let previa2 = 2;
    let previa3 = 2;
    let actualS; let actualD;
    let previas1S; let previas2S; let previas3S;
    let previas1D; let previas2D; let previas3D;
    let citaActual;
    let citaPrevia1;
    let citaPrevia2;
    let citaPrevia3;
    varMed.sort(function (a, b) { //se ordenan las var med de mayor a menor por su cita
        return b.Cita - a.Cita;
    });
    
    for (let a = 0; a < varMed.length; a++) { //se guardan las citas
        if (varMed[a].Tipo === 2 || varMed[a].Tipo === 3) {
            citas.push(varMed[a].Cita);
        }
    }
    let citasUnicas = citas.filter(function (value, index, self) { // se obtienen las citas unicas
        return self.indexOf(value) === index;
    });
    citaActual = citasUnicas[0];
    citaPrevia1 = citasUnicas[1];
    citaPrevia2 = citasUnicas[2];
    citaPrevia3 = citasUnicas[3];
    for (let a = 0; a < varMed.length; a++) { 
        if (varMed[a].Cita === citaActual) { 
            if (varMed[a].Tipo === 2) {
                actualS = varMed[a].Valor;
            } else if (varMed[a].Tipo === 3) {
                actualD = varMed[a].Valor;
            }
        }
        if (varMed[a].Cita === citaPrevia1 ) {
            if (varMed[a].Tipo === 2) {
                previas1S =varMed[a].Valor;
            } else if (varMed[a].Tipo === 3) {
                previas1D = varMed[a].Valor;
            }
        }
        if (varMed[a].Cita === citaPrevia2) { 
            if (varMed[a].Tipo === 2) {
                previas2S = varMed[a].Valor;
            } else if (varMed[a].Tipo === 3) {
                previas2D = varMed[a].Valor;
            }
        }
        if (varMed[a].Cita === citaPrevia3) { 
            if (varMed[a].Tipo === 2) {
                previas3S = varMed[a].Valor;
            } else if (varMed[a].Tipo === 3) {
                previas3D = varMed[a].Valor;
            }
        }
    }
    if (actualS > 140 && actualD > 90) {
        actual = 1;
    } else if (actualS < 140 && actualD < 90) {
        actual = 2;
    } else if (actualS == undefined && actualD == undefined) {
        actual = 0;
    } else if (actualS < 90 && actualD < 60) { 
        actual = 3;
    }

    if (previas1S < 140 && previas1D < 90) {
        previa1 = 2;
    } else if (previas1S > 140 || previas1D > 90) {
        previa1 = 1;
    } else if (previas1S === undefined && previas1D === undefined) {
        previa1 = 0;
    } else if (previas1S < 90 && previas1D < 60) {
        previa1 = 3;
    }
    if (previas2S < 140 && previas2D < 90) {
        previa2 = 2;
    } else if (previas2S > 140 || previas2D > 90) {
        previa2 = 1;
    } else if (previas2S === undefined && previas2D === undefined) {
        previa2 = 0;
    } else if (previas2S < 90 && previas2D < 60) {
        previa2 = 3;
    }
    if (previas3S < 140 && previas3D < 90) {
        previa3 = 2;
    } else if (previas3S > 140 || previas3D > 90) {
        previa3 = 1;
    } else if (previas3S === undefined && previas3D === undefined) {
        previa3 = 0;
    } else if (previas3S < 90 && previas3D < 60) {
        previa3 = 3;
    }

    return { actual, previa1, previa2, previa3 };
}

function verPreviasLDL(varMed) {
    let citas = [];
    let actual;
    let previa1; // aqui se asignan los valores para ver si estaba bien o no en las semanas anteriores
    let previa2;
    let previa3;
    let citaActual;
    let citaPrevia1;
    let citaPrevia2;
    let citaPrevia3;
    varMed.sort(function (a, b) { //se ordenan las var med de mayor a menor por su cita
        return b.Cita - a.Cita;
    });

    for (let a = 0; a < varMed.length; a++) { //se guardan las citas
        if (varMed[a].Tipo === 7) {
            citas.push(varMed[a].Cita);
        }
    }
    let citasUnicas = citas.filter(function (value, index, self) { // se obtienen las citas unicas
        return self.indexOf(value) === index;
    });
    citaActual = citasUnicas[0];
    citaPrevia1 = citasUnicas[1];
    citaPrevia2 = citasUnicas[2];
    citaPrevia3 = citasUnicas[3];

    let actuales; let previas1; let previas2; let previas3;

    for (let a = 0; a < varMed.length; a++) {
        if (varMed[a].Cita === citaActual) {
            actuales = varMed[a].Valor;
        }
        if (varMed[a].Cita === citaPrevia1) {
            previas1 = varMed[a].Valor;
        }
        if (varMed[a].Cita === citaPrevia2) {
            previas2 = varMed[a].Valor;
        }
        if (varMed[a].Cita === citaPrevia3) {
            previas3 = varMed[a].Valor;
        }
    }

    if (actuales > 160) {
        actual = 1;
    } else if (actuales < 160) {
        actual = 2;
    } else if (actuales == null) {
        actual = 0;
    } else if (actuales < 50) {
        actual = 3; //esto es que es demasiado bajo
    }
    if (previas1 < 160) {
        previa1 = 2;
    } else if (previas1 > 160) {
        previa1 = 1;
    } else if (previas1 === undefined) {
        previa1 = 0;
    } else if (previas1 < 50) {
        previa1 = 3;
    }

    if (previas2 < 160 ) {
        previa2 = 2;
    } else if (previas2 > 160) {
        previa2 = 1;
    } else if (previas2 === undefined) {
        previa2 = 0;
    } else if (previas2 < 50) {
        previa2 = 3;
    }

    if (previas3 < 160 ) {
        previa3 = 2;
    } else if (previas3 > 160 ) {
        previa3 = 1;
    } else if (previas3 === undefined ) {
        previa3 = 0;
    } else if (previas3 < 50) {
        previa3 = 3;
    }

    return { actual, previa1, previa2, previa3 };
}

function verPreviasINR(varMed) {
    let citas = [];
    let actual;
    let previa1; // aqui se asignan los valores para ver si estaba bien o no en las semanas anteriores
    let previa2;
    let previa3;
    let citaActual;
    let citaPrevia1;
    let citaPrevia2;
    let citaPrevia3;
    varMed.sort(function (a, b) { //se ordenan las var med de mayor a menor por su cita
        return b.Cita - a.Cita;
    });

    for (let a = 0; a < varMed.length; a++) { //se guardan las citas
        if (varMed[a].Tipo === 8) {
            citas.push(varMed[a].Cita);
        }
    }
    let citasUnicas = citas.filter(function (value, index, self) { // se obtienen las citas unicas
        return self.indexOf(value) === index;
    });
    citaActual = citasUnicas[0];
    citaPrevia1 = citasUnicas[1];
    citaPrevia2 = citasUnicas[2];
    citaPrevia3 = citasUnicas[3];

    let actuales; let previas1; let previas2; let previas3;

    for (let a = 0; a < varMed.length; a++) {
        if (varMed[a].Cita === citaActual) {
            actuales = varMed[a].Valor;
        }
        if (varMed[a].Cita === citaPrevia1) {
            previas1 = varMed[a].Valor;
        }
        if (varMed[a].Cita === citaPrevia2) {
            previas2 = varMed[a].Valor;
        }
        if (varMed[a].Cita === citaPrevia3) {
            previas3 = varMed[a].Valor;
        }
    }


    return { actuales, previas1, previas2, previas3 };
}




function buscarMedicamento(prAct) {
    let petBBDD = `SELECT * FROM farmacos where PrincipioActivo like '%${prAct}%'`;
    return new Promise((resolve, reject) => {
        baseDatos.query(petBBDD, (err, medicamentos) => {
            if (err) reject(err);
            if (medicamentos.length > 0) {
                resolve(medicamentos);
            } else {
                resolve(null);
            }
        })
    })
}

//INICIO DEL SERVIDOR
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});