-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-04-2022 a las 10:12:29
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 7.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bbddspe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acciones`
--

CREATE TABLE `acciones` (
  `IDUsuario` int(11) NOT NULL,
  `Accion` varchar(50) NOT NULL,
  `FechaHora` varchar(20) NOT NULL,
  `Dispositivo` varchar(50) DEFAULT NULL COMMENT 'Seria ideal guardar el dispositivo desde el que se hizo.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alergias`
--

CREATE TABLE `alergias` (
  `IDAlergia` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Alergeno` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `alergias`
--

INSERT INTO `alergias` (`IDAlergia`, `IdPaciente`, `Alergeno`) VALUES
(30, '34468343S', 'polvo'),
(31, '34468343S', 'marisco'),
(32, '49213961P', 'Gliclazida'),
(33, '49213961P', 'Lactosa'),
(34, '49213961P', 'Polen');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
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
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`IDCita`, `IdPaciente`, `IDEnfermero`, `TipoRevision`, `Online`, `Sintomas`, `Signos`, `FechaHora`, `Realizada`) VALUES
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
(33, '49213961P', 5, 'RV', 0, '', '', '2022-03-17 16:27', 0),
(34, '49213961P', 5, 'Diabetes', 1, '', '', ' ', 0),
(35, '49213961P', 5, 'Diabetes', 1, '', '', '2022-03-22 16:00', 0),
(36, '49213961P', 5, 'Diabetes', 1, '', '', '2022-03-30 16:34', 0),
(37, '49213961P', 5, 'RV', 0, '', '', '2022-03-30 17:17', 0),
(38, '49213961P', 5, 'ACOs', 1, '', '', '2022-03-30 17:16', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contestacionenfermero`
--

CREATE TABLE `contestacionenfermero` (
  `IDEnfermero` int(11) NOT NULL,
  `IDPregunta` int(11) NOT NULL,
  `Respuesta` int(1) NOT NULL COMMENT 'Numero de la respuesta',
  `FechaContestado` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `contestacionenfermero`
--

INSERT INTO `contestacionenfermero` (`IDEnfermero`, `IDPregunta`, `Respuesta`, `FechaContestado`) VALUES
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
-- Estructura de tabla para la tabla `contraindicaciones`
--

CREATE TABLE `contraindicaciones` (
  `IDFarmaco` int(11) NOT NULL,
  `Contraindicacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datosusuarios`
--

CREATE TABLE `datosusuarios` (
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
-- Volcado de datos para la tabla `datosusuarios`
--

INSERT INTO `datosusuarios` (`ID`, `IDUsuario`, `Nombre`, `Apellidos`, `DNI`, `IDFoto`, `FechaNacimiento`, `EmailContacto`) VALUES
(1, 1, 'Guillermo', 'Balastegui Garcia', '34468343S', 1, '2000-02-29', 'gbg.balas@gmail.com'),
(2, 2, 'Enfermero1', 'Prueba', '12312312A', 2, '1993-02-05', 'enfermero1@gmail.com'),
(3, 3, 'Administrador1', 'Prueba', '12312312B', 3, '1995-02-16', 'admin1@gmail.com'),
(9, 14, 'Geronimo', 'Stilton', '12312312O', 9, '1996-04-01', 'prueba@hla.com'),
(10, 15, 'Prueba2', 'pr2', '86719243', NULL, '2022-02-01', 'hola@hla.es');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dosisrecomendada`
--

CREATE TABLE `dosisrecomendada` (
  `IDFarmaco` int(11) NOT NULL,
  `Peso` int(4) DEFAULT NULL,
  `IMC` varchar(5) DEFAULT NULL,
  `IntervaloTomas` varchar(50) NOT NULL,
  `Cantidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `embarazo`
--

CREATE TABLE `embarazo` (
  `IDEmbarazo` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Activo` tinyint(1) NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `embarazo`
--

INSERT INTO `embarazo` (`IDEmbarazo`, `IdPaciente`, `Activo`, `FechaInicio`, `FechaFin`) VALUES
(16, '49213961P', 0, '2022-03-11', '2022-03-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermero`
--

CREATE TABLE `enfermero` (
  `ID` int(11) NOT NULL,
  `DNI` varchar(10) NOT NULL COMMENT 'Poner completo',
  `Nombre` varchar(20) NOT NULL,
  `Apellidos` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `enfermero`
--

INSERT INTO `enfermero` (`ID`, `DNI`, `Nombre`, `Apellidos`) VALUES
(1, '', 'Paco', 'Gomis'),
(2, '34468343S', 'Guillermo', 'Balastegui García'),
(4, '12312312A', 'Enf1', 'Prueba'),
(5, '12312312O', 'Geronimo', 'Stilton');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermerotest`
--

CREATE TABLE `enfermerotest` (
  `IDEnfermero` int(11) NOT NULL,
  `IDTest` int(11) NOT NULL,
  `FechaRealizado` date NOT NULL,
  `PorcentajeCompletitud` int(3) NOT NULL,
  `Puntuacion` int(3) NOT NULL COMMENT 'Sobre 100',
  `TiempoRestante` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `farmacos`
--

CREATE TABLE `farmacos` (
  `IDFarmaco` int(10) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `PrincipioActivo` varchar(50) NOT NULL,
  `FormaFarm` text NOT NULL,
  `Dosis` varchar(25) NOT NULL,
  `ViaAdministracion` varchar(30) NOT NULL,
  `NRegistro` int(10) NOT NULL,
  `RiesgoEmbarazo` varchar(11) NOT NULL,
  `RiesgoLactancia` varchar(10) NOT NULL,
  `ImgCaja` varchar(100) DEFAULT NULL,
  `ImgForma` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

CREATE TABLE `fotos` (
  `IDFoto` int(10) NOT NULL,
  `IDDatos` int(11) NOT NULL,
  `RutaFoto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lactancia`
--

CREATE TABLE `lactancia` (
  `IDLactancia` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Activa` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `lactancia`
--

INSERT INTO `lactancia` (`IDLactancia`, `IdPaciente`, `Activa`) VALUES
(12, '49213961P', 0),
(13, '49213961P', 0),
(14, '49213961P', 0),
(15, '49213961P', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `NIdentidad` varchar(30) NOT NULL,
  `Nombre` text NOT NULL,
  `Apellidos` text NOT NULL,
  `FechaNacimiento` date NOT NULL,
  `Sexo` varchar(1) NOT NULL,
  `Talla` int(3) NOT NULL,
  `Peso` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`NIdentidad`, `Nombre`, `Apellidos`, `FechaNacimiento`, `Sexo`, `Talla`, `Peso`) VALUES
('123487718234', 'Rodrigo', 'Cifuentes', '1991-02-01', 'M', 177, 70),
('34468343S', 'Guillermo', 'BG', '2000-08-29', 'M', 177, 76),
('49213961P', 'Cecilia ', 'Marcus', '1998-02-21', 'F', 165, 67),
('6578493', 'alvaro', 'ejemplo', '1995-01-03', 'M', 160, 70),
('675849758493', 'ejemplo', 'dia1', '1998-02-01', 'M', 190, 80);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patologiasprevias`
--

CREATE TABLE `patologiasprevias` (
  `IDPatologia` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` varchar(200) NOT NULL,
  `Activo` tinyint(1) NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `patologiasprevias`
--

INSERT INTO `patologiasprevias` (`IDPatologia`, `IdPaciente`, `Nombre`, `Descripcion`, `Activo`, `FechaInicio`, `FechaFin`) VALUES
(9, '34468343S', 'Neumonia', 'Faringitis mal tratada', 0, '2003-11-01', '2004-01-05'),
(10, '49213961P', 'Hipotensión', 'Es ligeramente hipotensa, no requiere tratamiento por ahora', 1, '2021-07-13', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
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
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`IDPregunta`, `Tipo`, `Pregunta`, `FechaCreacion`, `Respuesta1`, `Respuesta2`, `Respuesta3`, `Respuesta4`, `RespuestaCorrecta`) VALUES
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
-- Estructura de tabla para la tabla `preguntastest`
--

CREATE TABLE `preguntastest` (
  `IDTest` int(11) NOT NULL,
  `IDPregunta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preguntastest`
--

INSERT INTO `preguntastest` (`IDTest`, `IDPregunta`) VALUES
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
-- Estructura de tabla para la tabla `ram`
--

CREATE TABLE `ram` (
  `IDFarmaco` int(11) NOT NULL,
  `Medicamento` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `test`
--

CREATE TABLE `test` (
  `IDTest` int(10) NOT NULL,
  `Tipo` varchar(10) NOT NULL COMMENT 'Diabetes, RV o ACOs',
  `FechaCreacion` date NOT NULL,
  `Periodo` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `test`
--

INSERT INTO `test` (`IDTest`, `Tipo`, `FechaCreacion`, `Periodo`) VALUES
(1, 'Diabetes', '2022-03-01', '2-2022'),
(2, 'Diabetes', '2022-03-02', '2-2022'),
(3, 'Diabetes', '2022-03-03', '2-2022'),
(4, 'ACOs', '2022-03-03', '2-2022'),
(5, 'RV', '2022-03-03', '2-2022');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposvariables`
--

CREATE TABLE `tiposvariables` (
  `IDVariable` int(10) NOT NULL,
  `Nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tiposvariables`
--

INSERT INTO `tiposvariables` (`IDVariable`, `Nombre`) VALUES
(12, 'Pulso'),
(13, 'Tensión Sistólica'),
(14, 'Tensión Diastólica'),
(16, 'Glucemia'),
(23, 'Ácido Láctico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamiento`
--

CREATE TABLE `tratamiento` (
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
-- Volcado de datos para la tabla `tratamiento`
--

INSERT INTO `tratamiento` (`IDTratamiento`, `IdPaciente`, `IDFarmaco`, `Farmaco`, `FechaInicio`, `FechaFin`, `IntervaloTomas`, `Cantidad`, `Anotaciones`, `EfectosSecundarios`, `IDCita`) VALUES
(10, '34468343S', NULL, 'Respir', '2022-02-21', '2022-02-27', NULL, NULL, NULL, NULL, NULL),
(11, '49213961P', NULL, 'Cetirizina Cinfa 10 mg', '2022-02-23', '2022-07-30', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidadesvariables`
--

CREATE TABLE `unidadesvariables` (
  `IDUnidad` int(10) NOT NULL,
  `IDVariable` int(11) NOT NULL,
  `NombreUnidad` varchar(50) NOT NULL,
  `Abreviatura` varchar(10) NOT NULL,
  `ValorMax` float NOT NULL COMMENT 'Se refiere al valor máximo habitual',
  `ValorMin` float NOT NULL COMMENT 'Se refiere al valor mínimo habitual'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `unidadesvariables`
--

INSERT INTO `unidadesvariables` (`IDUnidad`, `IDVariable`, `NombreUnidad`, `Abreviatura`, `ValorMax`, `ValorMin`) VALUES
(1, 12, 'Pulsaciones por minuto', 'ppm', 80, 60),
(2, 13, 'Milimetro de mercurio', 'mmHg', 125, 1100),
(3, 14, 'Milimetro de mercurio', 'mmHg', 85, 70),
(4, 16, 'Miligramos por decilitro de sangre', 'mg/dL', 100, 70),
(6, 23, 'Miligramos por decilitro', 'mg/dL', 19.8, 4.5),
(7, 23, 'Milimoles por litro', 'mmol/L', 2.2, 0.5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(10) NOT NULL,
  `Usuario` varchar(20) NOT NULL,
  `Password` varchar(20) NOT NULL,
  `Tipo` varchar(20) NOT NULL COMMENT '''enfermero'' ''admin'' o ''ambos'''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID`, `Usuario`, `Password`, `Tipo`) VALUES
(1, 'guillermo', 'guillermo1234', 'ambos'),
(2, 'enfermero1', 'enfermero1', 'enfermero'),
(3, 'admin1', 'admin1', 'administrador'),
(14, 'enf1', 'enf1', 'enfermero'),
(15, '86719243', '2022-02-01', 'enfermero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variablefisica`
--

CREATE TABLE `variablefisica` (
  `IDVariable` int(10) NOT NULL,
  `IDPaciente` varchar(30) NOT NULL,
  `Tipo` int(10) NOT NULL,
  `Valor` float NOT NULL,
  `Unidades` varchar(10) NOT NULL,
  `Fecha` date NOT NULL,
  `IDEnfermero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `variablefisica`
--

INSERT INTO `variablefisica` (`IDVariable`, `IDPaciente`, `Tipo`, `Valor`, `Unidades`, `Fecha`, `IDEnfermero`) VALUES
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
-- Indices de la tabla `acciones`
--
ALTER TABLE `acciones`
  ADD PRIMARY KEY (`IDUsuario`);

--
-- Indices de la tabla `alergias`
--
ALTER TABLE `alergias`
  ADD PRIMARY KEY (`IDAlergia`),
  ADD KEY `SufridaPor` (`IdPaciente`);

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`IDCita`),
  ADD KEY `Trata` (`IDEnfermero`),
  ADD KEY `PacienteTratado` (`IdPaciente`);

--
-- Indices de la tabla `contestacionenfermero`
--
ALTER TABLE `contestacionenfermero`
  ADD KEY `ContestadoPor` (`IDEnfermero`),
  ADD KEY `Interrogacion` (`IDPregunta`);

--
-- Indices de la tabla `contraindicaciones`
--
ALTER TABLE `contraindicaciones`
  ADD PRIMARY KEY (`IDFarmaco`);

--
-- Indices de la tabla `datosusuarios`
--
ALTER TABLE `datosusuarios`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `DNI` (`DNI`),
  ADD KEY `IDUsuario` (`IDUsuario`);

--
-- Indices de la tabla `dosisrecomendada`
--
ALTER TABLE `dosisrecomendada`
  ADD PRIMARY KEY (`IDFarmaco`);

--
-- Indices de la tabla `embarazo`
--
ALTER TABLE `embarazo`
  ADD PRIMARY KEY (`IDEmbarazo`),
  ADD KEY `Embarazada` (`IdPaciente`);

--
-- Indices de la tabla `enfermero`
--
ALTER TABLE `enfermero`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `DNI` (`DNI`);

--
-- Indices de la tabla `enfermerotest`
--
ALTER TABLE `enfermerotest`
  ADD KEY `HechoPor` (`IDEnfermero`),
  ADD KEY `ProcedeDe` (`IDTest`);

--
-- Indices de la tabla `farmacos`
--
ALTER TABLE `farmacos`
  ADD PRIMARY KEY (`IDFarmaco`),
  ADD UNIQUE KEY `NRegistro` (`NRegistro`);

--
-- Indices de la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`IDFoto`);

--
-- Indices de la tabla `lactancia`
--
ALTER TABLE `lactancia`
  ADD PRIMARY KEY (`IDLactancia`),
  ADD KEY `Madre` (`IdPaciente`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`NIdentidad`);

--
-- Indices de la tabla `patologiasprevias`
--
ALTER TABLE `patologiasprevias`
  ADD PRIMARY KEY (`IDPatologia`),
  ADD KEY `PadecidaPor` (`IdPaciente`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`IDPregunta`);

--
-- Indices de la tabla `preguntastest`
--
ALTER TABLE `preguntastest`
  ADD KEY `ApareceEn` (`IDTest`),
  ADD KEY `Cuestion` (`IDPregunta`);

--
-- Indices de la tabla `ram`
--
ALTER TABLE `ram`
  ADD KEY `ReaccionaCon` (`IDFarmaco`);

--
-- Indices de la tabla `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`IDTest`);

--
-- Indices de la tabla `tiposvariables`
--
ALTER TABLE `tiposvariables`
  ADD PRIMARY KEY (`IDVariable`);

--
-- Indices de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  ADD PRIMARY KEY (`IDTratamiento`),
  ADD KEY `RecetadoEn` (`IDCita`),
  ADD KEY `Medicamento` (`IDFarmaco`),
  ADD KEY `TomadoPor` (`IdPaciente`);

--
-- Indices de la tabla `unidadesvariables`
--
ALTER TABLE `unidadesvariables`
  ADD PRIMARY KEY (`IDUnidad`),
  ADD KEY `CorrespondeA` (`IDVariable`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `variablefisica`
--
ALTER TABLE `variablefisica`
  ADD PRIMARY KEY (`IDVariable`),
  ADD KEY `TomadaPor` (`IDEnfermero`),
  ADD KEY `PerteneceA` (`IDPaciente`),
  ADD KEY `TipoMedida` (`Tipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alergias`
--
ALTER TABLE `alergias`
  MODIFY `IDAlergia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `IDCita` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `datosusuarios`
--
ALTER TABLE `datosusuarios`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `embarazo`
--
ALTER TABLE `embarazo`
  MODIFY `IDEmbarazo` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `enfermero`
--
ALTER TABLE `enfermero`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `farmacos`
--
ALTER TABLE `farmacos`
  MODIFY `IDFarmaco` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `fotos`
--
ALTER TABLE `fotos`
  MODIFY `IDFoto` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lactancia`
--
ALTER TABLE `lactancia`
  MODIFY `IDLactancia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `patologiasprevias`
--
ALTER TABLE `patologiasprevias`
  MODIFY `IDPatologia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `IDPregunta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `test`
--
ALTER TABLE `test`
  MODIFY `IDTest` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `tiposvariables`
--
ALTER TABLE `tiposvariables`
  MODIFY `IDVariable` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  MODIFY `IDTratamiento` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `unidadesvariables`
--
ALTER TABLE `unidadesvariables`
  MODIFY `IDUnidad` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `variablefisica`
--
ALTER TABLE `variablefisica`
  MODIFY `IDVariable` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acciones`
--
ALTER TABLE `acciones`
  ADD CONSTRAINT `RealizadoPor` FOREIGN KEY (`IDUsuario`) REFERENCES `usuarios` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `alergias`
--
ALTER TABLE `alergias`
  ADD CONSTRAINT `SufridaPor` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `PacienteTratado` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`NIdentidad`),
  ADD CONSTRAINT `Trata` FOREIGN KEY (`IDEnfermero`) REFERENCES `enfermero` (`ID`);

--
-- Filtros para la tabla `contestacionenfermero`
--
ALTER TABLE `contestacionenfermero`
  ADD CONSTRAINT `ContestadoPor` FOREIGN KEY (`IDEnfermero`) REFERENCES `enfermero` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `Interrogacion` FOREIGN KEY (`IDPregunta`) REFERENCES `preguntas` (`IDPregunta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `contraindicaciones`
--
ALTER TABLE `contraindicaciones`
  ADD CONSTRAINT `NoUsar` FOREIGN KEY (`IDFarmaco`) REFERENCES `farmacos` (`IDFarmaco`);

--
-- Filtros para la tabla `datosusuarios`
--
ALTER TABLE `datosusuarios`
  ADD CONSTRAINT `IDUsuario` FOREIGN KEY (`IDUsuario`) REFERENCES `usuarios` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `dosisrecomendada`
--
ALTER TABLE `dosisrecomendada`
  ADD CONSTRAINT `Dosificar` FOREIGN KEY (`IDFarmaco`) REFERENCES `farmacos` (`IDFarmaco`);

--
-- Filtros para la tabla `embarazo`
--
ALTER TABLE `embarazo`
  ADD CONSTRAINT `Embarazada` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `enfermerotest`
--
ALTER TABLE `enfermerotest`
  ADD CONSTRAINT `HechoPor` FOREIGN KEY (`IDEnfermero`) REFERENCES `enfermero` (`ID`),
  ADD CONSTRAINT `ProcedeDe` FOREIGN KEY (`IDTest`) REFERENCES `test` (`IDTest`);

--
-- Filtros para la tabla `lactancia`
--
ALTER TABLE `lactancia`
  ADD CONSTRAINT `Madre` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
