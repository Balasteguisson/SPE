-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 18-03-2022 a las 11:42:09
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bbddSPE`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Acciones`
--

CREATE TABLE `Acciones` (
  `IDUsuario` int(11) NOT NULL,
  `Accion` varchar(50) NOT NULL,
  `FechaHora` varchar(20) NOT NULL,
  `Dispositivo` varchar(50) DEFAULT NULL COMMENT 'Seria ideal guardar el dispositivo desde el que se hizo.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Alergias`
--

CREATE TABLE `Alergias` (
  `IDAlergia` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Alergeno` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Alergias`
--

INSERT INTO `Alergias` (`IDAlergia`, `IdPaciente`, `Alergeno`) VALUES
(30, '34468343S', 'polvo'),
(31, '34468343S', 'marisco'),
(32, '49213961P', 'Gliclazida'),
(33, '49213961P', 'Lactosa'),
(34, '49213961P', 'Polen');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Cita`
--

CREATE TABLE `Cita` (
  `IDCita` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `IDEnfermero` int(10) NOT NULL,
  `TipoRevision` varchar(20) NOT NULL,
  `Online` tinyint(1) NOT NULL,
  `Sintomas` varchar(300) NOT NULL,
  `Signos` varchar(300) NOT NULL,
  `FechaHora` varchar(20) NOT NULL,
  `Realizada` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Cita`
--

INSERT INTO `Cita` (`IDCita`, `IdPaciente`, `IDEnfermero`, `TipoRevision`, `Online`, `Sintomas`, `Signos`, `FechaHora`, `Realizada`) VALUES
(4, '123487718234', 5, 'Diabetes', 0, '', '', '2022-03-08 12:00', 0),
(7, '34468343S', 4, 'RV', 0, '', '', '2022-03-03 10:00', 0),
(8, '34468343S', 5, 'Diabetes', 0, '', '', '2022-03-08 12:15', 0),
(9, '34468343S', 5, 'RV', 0, '', '', '2022-03-08 13:45', 0),
(10, '34468343S', 5, 'Diabetes', 0, '', '', '2022-03-08 16:00', 0),
(11, '34468343S', 5, 'Diabetes', 0, '', '', '2022-03-08 16:15', 0),
(12, '34468343S', 5, 'Diabetes', 0, '', '', '2022-03-08 16:33', 0),
(13, '34468343S', 5, 'Diabetes', 0, '', '', '2022-03-07 16:48', 0),
(14, '34468343S', 5, 'RV', 1, '', '', '2022-03-09 15:00', 0),
(15, '34468343S', 5, 'RV', 1, '', '', '2022-03-09 15:00', 0),
(16, '6578493', 5, 'Diabetes', 0, '', '', '2022-03-09 16:00', 0),
(17, '675849758493', 5, 'Diabetes', 0, '', '', '2022-03-09 13:34', 0),
(18, '675849758493', 5, 'RV', 1, '', '', '2022-03-09 17:49', 0),
(19, '49213961P', 5, 'Diabetes', 1, '', '', '2022-03-09 15:53', 0),
(20, '34468343S', 5, 'ACOs', 0, '', '', '2022-03-10 13:00', 0),
(21, '34468343S', 5, 'Diabetes', 1, '', '', '2022-03-10 13:15', 0),
(22, '34468343S', 5, 'Diabetes', 1, '', '', '2022-03-10 13:15', 0),
(23, '34468343S', 5, 'RV', 0, '', '', '2022-03-10 13:47', 0),
(24, '49213961P', 5, 'RV', 0, '', '', '2022-03-10 17:47', 0),
(25, '49213961P', 5, 'Diabetes', 0, '', '', '2022-03-11 14:17', 0),
(26, '49213961P', 5, 'Diabetes', 1, '', '', '2022-03-14 16:18', 0),
(28, '34468343S', 5, 'RV', 0, '', '', '2022-03-14 13:45', 0),
(29, '123487718234', 5, 'ACOs', 0, '', '', '2022-03-14 13:30', 0),
(30, '49213961P', 5, 'RV', 0, '', '', '2022-03-16 12:13', 0),
(31, '49213961P', 5, 'Diabetes', 0, '', '', '2022-03-16 16:20', 0),
(32, '34468343S', 5, 'RV', 1, '', '', '2022-03-16 15:04', 0),
(33, '49213961P', 5, 'RV', 0, '', '', '2022-03-17 16:27', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ContestacionEnfermero`
--

CREATE TABLE `ContestacionEnfermero` (
  `IDEnfermero` int(11) NOT NULL,
  `IDPregunta` int(11) NOT NULL,
  `Respuesta` int(1) NOT NULL COMMENT 'Numero de la respuesta',
  `FechaContestado` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ContestacionEnfermero`
--

INSERT INTO `ContestacionEnfermero` (`IDEnfermero`, `IDPregunta`, `Respuesta`, `FechaContestado`) VALUES
(5, 33, 2, '2022-03-04'),
(5, 37, 2, '2022-03-04'),
(5, 38, 3, '2022-03-04'),
(5, 33, 2, '2022-03-04'),
(5, 37, 2, '2022-03-04'),
(5, 38, 3, '2022-03-04'),
(5, 33, 2, '2022-03-04'),
(5, 37, 2, '2022-03-04'),
(5, 38, 3, '2022-03-04'),
(5, 34, 4, '2022-03-04'),
(5, 36, 3, '2022-03-04'),
(5, 42, 1, '2022-03-04'),
(5, 43, 4, '2022-03-04'),
(5, 44, 4, '2022-03-04'),
(5, 32, 4, '2022-03-04'),
(5, 39, 3, '2022-03-04'),
(5, 40, 2, '2022-03-04'),
(5, 41, 4, '2022-03-04'),
(5, 33, 2, '2022-03-07'),
(5, 37, 2, '2022-03-07'),
(5, 38, 3, '2022-03-07'),
(5, 34, 2, '2022-03-09'),
(5, 36, 3, '2022-03-09'),
(5, 42, 1, '2022-03-09'),
(5, 43, 4, '2022-03-09'),
(5, 44, 2, '2022-03-09'),
(5, 32, 1, '2022-03-09'),
(5, 39, 4, '2022-03-09'),
(5, 40, 2, '2022-03-09'),
(5, 41, 4, '2022-03-09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Contraindicaciones`
--

CREATE TABLE `Contraindicaciones` (
  `IDFarmaco` int(11) NOT NULL,
  `Contraindicacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `DatosUsuarios`
--

CREATE TABLE `DatosUsuarios` (
  `ID` int(10) NOT NULL,
  `IDUsuario` int(11) NOT NULL,
  `Nombre` varchar(20) NOT NULL,
  `Apellidos` varchar(40) NOT NULL,
  `DNI` varchar(10) NOT NULL COMMENT 'Poner completo',
  `IDFoto` int(11) DEFAULT NULL,
  `FechaNacimiento` date NOT NULL,
  `EmailContacto` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `DatosUsuarios`
--

INSERT INTO `DatosUsuarios` (`ID`, `IDUsuario`, `Nombre`, `Apellidos`, `DNI`, `IDFoto`, `FechaNacimiento`, `EmailContacto`) VALUES
(1, 1, 'Guillermo', 'Balastegui Garcia', '34468343S', 1, '2000-02-29', 'gbg.balas@gmail.com'),
(2, 2, 'Enfermero1', 'Prueba', '12312312A', 2, '1993-02-05', 'enfermero1@gmail.com'),
(3, 3, 'Administrador1', 'Prueba', '12312312B', 3, '1995-02-16', 'admin1@gmail.com'),
(9, 14, 'Geronimo', 'Stilton', '12312312O', 9, '1996-04-01', 'prueba@hla.com'),
(10, 15, 'Prueba2', 'pr2', '86719243', NULL, '2022-02-01', 'hola@hla.es');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `DosisRecomendada`
--

CREATE TABLE `DosisRecomendada` (
  `IDFarmaco` int(11) NOT NULL,
  `Peso` int(4) DEFAULT NULL,
  `IMC` varchar(5) DEFAULT NULL,
  `IntervaloTomas` varchar(50) NOT NULL,
  `Cantidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Embarazo`
--

CREATE TABLE `Embarazo` (
  `IDEmbarazo` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Activo` tinyint(1) NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Embarazo`
--

INSERT INTO `Embarazo` (`IDEmbarazo`, `IdPaciente`, `Activo`, `FechaInicio`, `FechaFin`) VALUES
(16, '49213961P', 0, '2022-03-11', '2022-03-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Enfermero`
--

CREATE TABLE `Enfermero` (
  `ID` int(11) NOT NULL,
  `DNI` varchar(10) NOT NULL COMMENT 'Poner completo',
  `Nombre` varchar(20) NOT NULL,
  `Apellidos` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Enfermero`
--

INSERT INTO `Enfermero` (`ID`, `DNI`, `Nombre`, `Apellidos`) VALUES
(1, '', 'Paco', 'Gomis'),
(2, '34468343S', 'Guillermo', 'Balastegui García'),
(4, '12312312A', 'Enf1', 'Prueba'),
(5, '12312312O', 'Geronimo', 'Stilton');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `EnfermeroTest`
--

CREATE TABLE `EnfermeroTest` (
  `IDEnfermero` int(11) NOT NULL,
  `IDTest` int(11) NOT NULL,
  `FechaRealizado` date NOT NULL,
  `PorcentajeCompletitud` int(3) NOT NULL,
  `Puntuacion` int(3) NOT NULL COMMENT 'Sobre 100',
  `TiempoRestante` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Farmacos`
--

CREATE TABLE `Farmacos` (
  `IDFarmaco` int(10) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `PrincipioActivo` varchar(40) NOT NULL,
  `Alergenos` varchar(100) NOT NULL,
  `RiesgoEmbarazo` varchar(11) NOT NULL,
  `RiesgoLactancia` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Farmacos`
--

INSERT INTO `Farmacos` (`IDFarmaco`, `Nombre`, `PrincipioActivo`, `Alergenos`, `RiesgoEmbarazo`, `RiesgoLactancia`) VALUES
(1, 'Metformina STADA 850 mg comprimidos recubiertos con película EFG', 'Metformina', 'Povidona. Estereato de magnesio. Hipromelosa/macrogol 400/macrogol 6000.', 'No', 'Medio'),
(2, 'Apixaban Teva 5 mg comprimidos recubiertos con película EFG', 'Apixabán', 'Lactosa', 'No', 'Sí');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Fotos`
--

CREATE TABLE `Fotos` (
  `IDFoto` int(10) NOT NULL,
  `IDDatos` int(11) NOT NULL,
  `RutaFoto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Indicaciones`
--

CREATE TABLE `Indicaciones` (
  `IDFarmaco` int(11) NOT NULL,
  `Indicacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Lactancia`
--

CREATE TABLE `Lactancia` (
  `IDLactancia` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Activa` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Lactancia`
--

INSERT INTO `Lactancia` (`IDLactancia`, `IdPaciente`, `Activa`) VALUES
(12, '49213961P', 0),
(13, '49213961P', 0),
(14, '49213961P', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pacientes`
--

CREATE TABLE `Pacientes` (
  `NIdentidad` varchar(30) NOT NULL,
  `Nombre` text NOT NULL,
  `Apellidos` text NOT NULL,
  `FechaNacimiento` date NOT NULL,
  `Sexo` varchar(1) NOT NULL,
  `Talla` int(3) NOT NULL,
  `Peso` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Pacientes`
--

INSERT INTO `Pacientes` (`NIdentidad`, `Nombre`, `Apellidos`, `FechaNacimiento`, `Sexo`, `Talla`, `Peso`) VALUES
('123487718234', 'Rodrigo', 'Cifuentes', '1991-02-01', 'M', 177, 70),
('34468343S', 'Guillermo', 'BG', '2000-08-29', 'M', 177, 76),
('49213961P', 'Cecilia ', 'Marcus', '1998-02-21', 'F', 165, 67),
('6578493', 'alvaro', 'ejemplo', '1995-01-03', 'M', 160, 70),
('675849758493', 'ejemplo', 'dia1', '1998-02-01', 'M', 190, 80);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PatologiasPrevias`
--

CREATE TABLE `PatologiasPrevias` (
  `IDPatologia` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` varchar(200) NOT NULL,
  `Activo` tinyint(1) NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `PatologiasPrevias`
--

INSERT INTO `PatologiasPrevias` (`IDPatologia`, `IdPaciente`, `Nombre`, `Descripcion`, `Activo`, `FechaInicio`, `FechaFin`) VALUES
(9, '34468343S', 'Neumonia', 'Faringitis mal tratada', 0, '2003-11-01', '2004-01-05'),
(10, '49213961P', 'Hipotensión', 'Es ligeramente hipotensa, no requiere tratamiento por ahora', 1, '2021-07-13', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Preguntas`
--

CREATE TABLE `Preguntas` (
  `IDPregunta` int(11) NOT NULL,
  `Tipo` varchar(20) NOT NULL,
  `Pregunta` varchar(100) NOT NULL,
  `FechaCreacion` date NOT NULL,
  `Respuesta1` varchar(100) NOT NULL,
  `Respuesta2` varchar(100) NOT NULL,
  `Respuesta3` varchar(100) NOT NULL,
  `Respuesta4` varchar(100) NOT NULL,
  `RespuestaCorrecta` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Preguntas`
--

INSERT INTO `Preguntas` (`IDPregunta`, `Tipo`, `Pregunta`, `FechaCreacion`, `Respuesta1`, `Respuesta2`, `Respuesta3`, `Respuesta4`, `RespuestaCorrecta`) VALUES
(32, 'RV', 'Prueba 2 dia 9 edit 2', '2022-02-10', 'Respuesta 1', 'Respuesta 2', 'Respuesta 3', 'Respuesta correcta', 1),
(33, 'Diabetes', 'Prueba 24 dia 9', '2022-02-09', 'Respuesta 1', 'Respuesta 2', 'Respuesta 3', 'Respuesta correcta', 2),
(34, 'ACOs', 'Prueba 24 dia 9', '2022-02-10', 'Respuesta 1', 'Respuesta 2', 'Mala', 'Buena', 4),
(36, 'ACOs', '¿Qué medicamento es un ACO?', '2022-02-14', 'Ibuprofeno', 'Paracetamol', 'Edoxabán', 'Aspirina', 3),
(37, 'Diabetes', 'Prueba', '2022-03-02', 'Hola', 'Que', 'tal', 'estas', 2),
(38, 'Diabetes', 'Prueba dia 3/3', '2022-03-03', 'Esta no', 'Esta no', 'Esta si', 'Esta no', 3),
(39, 'RV', 'Pregunta RV 1', '2022-03-03', 'R1', 'R2', 'RC', 'R4', 3),
(40, 'RV', 'Pregunta RV 2', '2022-03-03', 'R1', 'RC', 'R3', 'R4', 2),
(41, 'RV', 'Pregunta RV 3', '2022-03-03', 'RC', 'R2', 'R3', 'R4', 1),
(42, 'ACOs', 'Pregunta ACOs 1', '2022-03-03', 'RC', 'R2', 'R3', 'R4', 1),
(43, 'ACOs', 'Pregunta ACOs 2', '2022-03-03', 'R1', 'R2', 'R3', 'RC', 4),
(44, 'ACOs', 'Pregunta ACOs 3', '2022-03-03', 'R1', 'RC', 'R3', 'R4', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PreguntasTest`
--

CREATE TABLE `PreguntasTest` (
  `IDTest` int(11) NOT NULL,
  `IDPregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `PreguntasTest`
--

INSERT INTO `PreguntasTest` (`IDTest`, `IDPregunta`) VALUES
(1, 33),
(2, 33),
(2, 37),
(3, 33),
(3, 37),
(3, 38),
(4, 36),
(4, 34),
(4, 42),
(4, 43),
(4, 44),
(5, 32),
(5, 39),
(5, 40),
(5, 41);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RAM`
--

CREATE TABLE `RAM` (
  `IDFarmaco` int(11) NOT NULL,
  `Medicamento` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Test`
--

CREATE TABLE `Test` (
  `IDTest` int(10) NOT NULL,
  `Tipo` varchar(10) NOT NULL COMMENT 'Diabetes, RV o ACOs',
  `FechaCreacion` date NOT NULL,
  `Periodo` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Test`
--

INSERT INTO `Test` (`IDTest`, `Tipo`, `FechaCreacion`, `Periodo`) VALUES
(1, 'Diabetes', '2022-03-01', '2-2022'),
(2, 'Diabetes', '2022-03-02', '2-2022'),
(3, 'Diabetes', '2022-03-03', '2-2022'),
(4, 'ACOs', '2022-03-03', '2-2022'),
(5, 'RV', '2022-03-03', '2-2022');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TiposVariables`
--

CREATE TABLE `TiposVariables` (
  `IDVariable` int(10) NOT NULL,
  `Nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `TiposVariables`
--

INSERT INTO `TiposVariables` (`IDVariable`, `Nombre`) VALUES
(12, 'Pulso'),
(13, 'Tensión Sistólica'),
(14, 'Tensión Diastólica'),
(16, 'Glucemia'),
(23, 'Ácido Láctico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Tratamiento`
--

CREATE TABLE `Tratamiento` (
  `IDTratamiento` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `IDFarmaco` int(11) DEFAULT NULL,
  `Farmaco` varchar(100) DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date NOT NULL,
  `IntervaloTomas` varchar(50) DEFAULT NULL,
  `Cantidad` varchar(50) DEFAULT NULL,
  `Anotaciones` varchar(300) DEFAULT NULL,
  `EfectosSecundarios` varchar(300) DEFAULT NULL,
  `IDCita` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Tratamiento`
--

INSERT INTO `Tratamiento` (`IDTratamiento`, `IdPaciente`, `IDFarmaco`, `Farmaco`, `FechaInicio`, `FechaFin`, `IntervaloTomas`, `Cantidad`, `Anotaciones`, `EfectosSecundarios`, `IDCita`) VALUES
(10, '34468343S', NULL, 'Respir', '2022-02-21', '2022-02-27', NULL, NULL, NULL, NULL, NULL),
(11, '49213961P', NULL, 'Cetirizina Cinfa 10 mg', '2022-02-23', '2022-07-30', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UnidadesVariables`
--

CREATE TABLE `UnidadesVariables` (
  `IDUnidad` int(10) NOT NULL,
  `IDVariable` int(11) NOT NULL,
  `NombreUnidad` varchar(50) NOT NULL,
  `Abreviatura` varchar(10) NOT NULL,
  `ValorMax` float NOT NULL COMMENT 'Se refiere al valor máximo habitual',
  `ValorMin` float NOT NULL COMMENT 'Se refiere al valor mínimo habitual'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `UnidadesVariables`
--

INSERT INTO `UnidadesVariables` (`IDUnidad`, `IDVariable`, `NombreUnidad`, `Abreviatura`, `ValorMax`, `ValorMin`) VALUES
(1, 12, 'Pulsaciones por minuto', 'ppm', 80, 60),
(2, 13, 'Milimetro de mercurio', 'mmHg', 125, 1100),
(3, 14, 'Milimetro de mercurio', 'mmHg', 85, 70),
(4, 16, 'Miligramos por decilitro de sangre', 'mg/dL', 100, 70),
(6, 23, 'Miligramos por decilitro', 'mg/dL', 19.8, 4.5),
(7, 23, 'Milimoles por litro', 'mmol/L', 2.2, 0.5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuarios`
--

CREATE TABLE `Usuarios` (
  `ID` int(10) NOT NULL,
  `Usuario` varchar(20) NOT NULL,
  `Password` varchar(20) NOT NULL,
  `Tipo` varchar(20) NOT NULL COMMENT '''enfermero'' ''admin'' o ''ambos'''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Usuarios`
--

INSERT INTO `Usuarios` (`ID`, `Usuario`, `Password`, `Tipo`) VALUES
(1, 'guillermo', 'guillermo1234', 'ambos'),
(2, 'enfermero1', 'enfermero1', 'enfermero'),
(3, 'admin1', 'admin1', 'administrador'),
(14, 'enf1', 'enf1', 'enfermero'),
(15, '86719243', '2022-02-01', 'enfermero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `VariableFisica`
--

CREATE TABLE `VariableFisica` (
  `IDVariable` int(10) NOT NULL,
  `IDPaciente` varchar(30) NOT NULL,
  `Tipo` int(10) NOT NULL,
  `Valor` float NOT NULL,
  `Unidades` varchar(10) NOT NULL,
  `Fecha` date NOT NULL,
  `IDEnfermero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `VariableFisica`
--

INSERT INTO `VariableFisica` (`IDVariable`, `IDPaciente`, `Tipo`, `Valor`, `Unidades`, `Fecha`, `IDEnfermero`) VALUES
(2, '49213961P', 13, 120, 'mmHg', '2022-03-11', 5),
(3, '49213961P', 14, 80, 'mmHg', '2022-03-11', 5),
(4, '49213961P', 12, 53, 'ppm', '2022-03-11', 5),
(5, '123487718234', 12, 56, 'ppm', '2022-03-14', 5),
(6, '123487718234', 13, 119, 'mmHg', '2022-03-14', 5),
(7, '123487718234', 14, 83, 'mmHg', '2022-03-14', 5),
(8, '123487718234', 16, 110, 'mg/dL', '2022-03-14', 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Acciones`
--
ALTER TABLE `Acciones`
  ADD PRIMARY KEY (`IDUsuario`);

--
-- Indices de la tabla `Alergias`
--
ALTER TABLE `Alergias`
  ADD PRIMARY KEY (`IDAlergia`),
  ADD KEY `SufridaPor` (`IdPaciente`);

--
-- Indices de la tabla `Cita`
--
ALTER TABLE `Cita`
  ADD PRIMARY KEY (`IDCita`),
  ADD KEY `Trata` (`IDEnfermero`),
  ADD KEY `PacienteTratado` (`IdPaciente`);

--
-- Indices de la tabla `ContestacionEnfermero`
--
ALTER TABLE `ContestacionEnfermero`
  ADD KEY `ContestadoPor` (`IDEnfermero`),
  ADD KEY `Interrogacion` (`IDPregunta`);

--
-- Indices de la tabla `Contraindicaciones`
--
ALTER TABLE `Contraindicaciones`
  ADD PRIMARY KEY (`IDFarmaco`);

--
-- Indices de la tabla `DatosUsuarios`
--
ALTER TABLE `DatosUsuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `DNI` (`DNI`),
  ADD KEY `IDUsuario` (`IDUsuario`);

--
-- Indices de la tabla `DosisRecomendada`
--
ALTER TABLE `DosisRecomendada`
  ADD PRIMARY KEY (`IDFarmaco`);

--
-- Indices de la tabla `Embarazo`
--
ALTER TABLE `Embarazo`
  ADD PRIMARY KEY (`IDEmbarazo`),
  ADD KEY `Embarazada` (`IdPaciente`);

--
-- Indices de la tabla `Enfermero`
--
ALTER TABLE `Enfermero`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `DNI` (`DNI`);

--
-- Indices de la tabla `EnfermeroTest`
--
ALTER TABLE `EnfermeroTest`
  ADD KEY `HechoPor` (`IDEnfermero`),
  ADD KEY `ProcedeDe` (`IDTest`);

--
-- Indices de la tabla `Farmacos`
--
ALTER TABLE `Farmacos`
  ADD PRIMARY KEY (`IDFarmaco`);

--
-- Indices de la tabla `Fotos`
--
ALTER TABLE `Fotos`
  ADD PRIMARY KEY (`IDFoto`);

--
-- Indices de la tabla `Indicaciones`
--
ALTER TABLE `Indicaciones`
  ADD PRIMARY KEY (`IDFarmaco`);

--
-- Indices de la tabla `Lactancia`
--
ALTER TABLE `Lactancia`
  ADD PRIMARY KEY (`IDLactancia`),
  ADD KEY `Madre` (`IdPaciente`);

--
-- Indices de la tabla `Pacientes`
--
ALTER TABLE `Pacientes`
  ADD PRIMARY KEY (`NIdentidad`);

--
-- Indices de la tabla `PatologiasPrevias`
--
ALTER TABLE `PatologiasPrevias`
  ADD PRIMARY KEY (`IDPatologia`),
  ADD KEY `PadecidaPor` (`IdPaciente`);

--
-- Indices de la tabla `Preguntas`
--
ALTER TABLE `Preguntas`
  ADD PRIMARY KEY (`IDPregunta`);

--
-- Indices de la tabla `PreguntasTest`
--
ALTER TABLE `PreguntasTest`
  ADD KEY `ApareceEn` (`IDTest`),
  ADD KEY `Cuestion` (`IDPregunta`);

--
-- Indices de la tabla `RAM`
--
ALTER TABLE `RAM`
  ADD KEY `ReaccionaCon` (`IDFarmaco`);

--
-- Indices de la tabla `Test`
--
ALTER TABLE `Test`
  ADD PRIMARY KEY (`IDTest`);

--
-- Indices de la tabla `TiposVariables`
--
ALTER TABLE `TiposVariables`
  ADD PRIMARY KEY (`IDVariable`);

--
-- Indices de la tabla `Tratamiento`
--
ALTER TABLE `Tratamiento`
  ADD PRIMARY KEY (`IDTratamiento`),
  ADD KEY `RecetadoEn` (`IDCita`),
  ADD KEY `Medicamento` (`IDFarmaco`),
  ADD KEY `TomadoPor` (`IdPaciente`);

--
-- Indices de la tabla `UnidadesVariables`
--
ALTER TABLE `UnidadesVariables`
  ADD PRIMARY KEY (`IDUnidad`),
  ADD KEY `CorrespondeA` (`IDVariable`);

--
-- Indices de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `VariableFisica`
--
ALTER TABLE `VariableFisica`
  ADD PRIMARY KEY (`IDVariable`),
  ADD KEY `TomadaPor` (`IDEnfermero`),
  ADD KEY `PerteneceA` (`IDPaciente`),
  ADD KEY `TipoMedida` (`Tipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Alergias`
--
ALTER TABLE `Alergias`
  MODIFY `IDAlergia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `Cita`
--
ALTER TABLE `Cita`
  MODIFY `IDCita` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `DatosUsuarios`
--
ALTER TABLE `DatosUsuarios`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `Embarazo`
--
ALTER TABLE `Embarazo`
  MODIFY `IDEmbarazo` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `Enfermero`
--
ALTER TABLE `Enfermero`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `Farmacos`
--
ALTER TABLE `Farmacos`
  MODIFY `IDFarmaco` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Fotos`
--
ALTER TABLE `Fotos`
  MODIFY `IDFoto` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Lactancia`
--
ALTER TABLE `Lactancia`
  MODIFY `IDLactancia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `PatologiasPrevias`
--
ALTER TABLE `PatologiasPrevias`
  MODIFY `IDPatologia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `Preguntas`
--
ALTER TABLE `Preguntas`
  MODIFY `IDPregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `Test`
--
ALTER TABLE `Test`
  MODIFY `IDTest` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `TiposVariables`
--
ALTER TABLE `TiposVariables`
  MODIFY `IDVariable` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `Tratamiento`
--
ALTER TABLE `Tratamiento`
  MODIFY `IDTratamiento` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `UnidadesVariables`
--
ALTER TABLE `UnidadesVariables`
  MODIFY `IDUnidad` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `VariableFisica`
--
ALTER TABLE `VariableFisica`
  MODIFY `IDVariable` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Acciones`
--
ALTER TABLE `Acciones`
  ADD CONSTRAINT `RealizadoPor` FOREIGN KEY (`IDUsuario`) REFERENCES `Usuarios` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `Alergias`
--
ALTER TABLE `Alergias`
  ADD CONSTRAINT `SufridaPor` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Cita`
--
ALTER TABLE `Cita`
  ADD CONSTRAINT `PacienteTratado` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`),
  ADD CONSTRAINT `Trata` FOREIGN KEY (`IDEnfermero`) REFERENCES `Enfermero` (`ID`);

--
-- Filtros para la tabla `ContestacionEnfermero`
--
ALTER TABLE `ContestacionEnfermero`
  ADD CONSTRAINT `ContestadoPor` FOREIGN KEY (`IDEnfermero`) REFERENCES `Enfermero` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `Interrogacion` FOREIGN KEY (`IDPregunta`) REFERENCES `Preguntas` (`IDPregunta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `Contraindicaciones`
--
ALTER TABLE `Contraindicaciones`
  ADD CONSTRAINT `NoUsar` FOREIGN KEY (`IDFarmaco`) REFERENCES `Farmacos` (`IDFarmaco`);

--
-- Filtros para la tabla `DatosUsuarios`
--
ALTER TABLE `DatosUsuarios`
  ADD CONSTRAINT `IDUsuario` FOREIGN KEY (`IDUsuario`) REFERENCES `Usuarios` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `DosisRecomendada`
--
ALTER TABLE `DosisRecomendada`
  ADD CONSTRAINT `Dosificar` FOREIGN KEY (`IDFarmaco`) REFERENCES `Farmacos` (`IDFarmaco`);

--
-- Filtros para la tabla `Embarazo`
--
ALTER TABLE `Embarazo`
  ADD CONSTRAINT `Embarazada` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `EnfermeroTest`
--
ALTER TABLE `EnfermeroTest`
  ADD CONSTRAINT `HechoPor` FOREIGN KEY (`IDEnfermero`) REFERENCES `Enfermero` (`ID`),
  ADD CONSTRAINT `ProcedeDe` FOREIGN KEY (`IDTest`) REFERENCES `Test` (`IDTest`);

--
-- Filtros para la tabla `Indicaciones`
--
ALTER TABLE `Indicaciones`
  ADD CONSTRAINT `Para` FOREIGN KEY (`IDFarmaco`) REFERENCES `Fármacos` (`IDFarmaco`);

--
-- Filtros para la tabla `Lactancia`
--
ALTER TABLE `Lactancia`
  ADD CONSTRAINT `Madre` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `PatologiasPrevias`
--
ALTER TABLE `PatologiasPrevias`
  ADD CONSTRAINT `PadecidaPor` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `PreguntasTest`
--
ALTER TABLE `PreguntasTest`
  ADD CONSTRAINT `ApareceEn` FOREIGN KEY (`IDTest`) REFERENCES `Test` (`IDTest`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Cuestion` FOREIGN KEY (`IDPregunta`) REFERENCES `Preguntas` (`IDPregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `RAM`
--
ALTER TABLE `RAM`
  ADD CONSTRAINT `ReaccionaCon` FOREIGN KEY (`IDFarmaco`) REFERENCES `Farmacos` (`IDFarmaco`);

--
-- Filtros para la tabla `Tratamiento`
--
ALTER TABLE `Tratamiento`
  ADD CONSTRAINT `Medicamento` FOREIGN KEY (`IDFarmaco`) REFERENCES `Farmacos` (`IDFarmaco`),
  ADD CONSTRAINT `RecetadoEn` FOREIGN KEY (`IDCita`) REFERENCES `Cita` (`IDCita`),
  ADD CONSTRAINT `TomadoPor` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `UnidadesVariables`
--
ALTER TABLE `UnidadesVariables`
  ADD CONSTRAINT `CorrespondeA` FOREIGN KEY (`IDVariable`) REFERENCES `TiposVariables` (`IDVariable`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `VariableFisica`
--
ALTER TABLE `VariableFisica`
  ADD CONSTRAINT `PerteneceA` FOREIGN KEY (`IdPaciente`) REFERENCES `Pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `TipoMedida` FOREIGN KEY (`Tipo`) REFERENCES `TiposVariables` (`IDVariable`),
  ADD CONSTRAINT `TomadaPor` FOREIGN KEY (`IDEnfermero`) REFERENCES `Enfermero` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
