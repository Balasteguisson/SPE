-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-05-2022 a las 11:09:02
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
(34, '49213961P', 'Polen'),
(37, '683947298B', 'Polen'),
(38, '123123456N', 'gliclazida'),
(39, '341435123576A', 'metformina'),
(41, '2384298374K', 'gliclazida'),
(42, '13847612H', 'polen');

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
(35, '49213961P', 5, 'Diabetes', 1, '', '', '2022-03-22 16:00', 0),
(36, '49213961P', 5, 'Diabetes', 1, '', '', '2022-03-30 16:34', 0),
(37, '49213961P', 5, 'RV', 0, '', '', '2022-03-30 17:17', 0),
(38, '49213961P', 5, 'ACOs', 1, '', '', '2022-03-30 17:16', 0),
(39, '49213961P', 5, 'Diabetes', 0, '', '', '2022-04-11 15:23', 0),
(40, '49213961P', 5, 'Diabetes', 0, '', '', '2022-04-12 16:00', 0),
(41, '49213961P', 5, 'Diabetes', 0, '', '', '2022-04-26 18:03', 0),
(42, '49213961P', 5, 'Diabetes', 0, '', '', '2022-04-28 21:00', 0),
(43, '49213961P', 5, 'Diabetes', 0, '', '', '2022-04-29 19:46', 0),
(44, '49213961P', 5, 'Diabetes', 0, '', '', '2022-04-30 15:23', 0),
(47, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-01 17:45', 0),
(48, '49213961P', 5, 'RV', 0, '', '', '2022-05-01 18:23', 0),
(49, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-06 13:14', 0),
(50, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-07 14:56', 0),
(51, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-07 19:32', 0),
(52, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-08 13:25', 0),
(53, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-08 15:50', 0),
(54, '49213961P', 5, 'Diabetes', 1, '', '', '2022-05-09 14:00', 0),
(55, '341435123576A', 5, 'Diabetes', 0, '', '', '2022-05-09 14:15', 0),
(56, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-10 13:15', 0),
(57, '341435123576A', 5, 'Diabetes', 0, '', '', '2022-05-10 13:34', 0),
(59, '2836492873K', 5, 'RV', 0, '', '', '2022-05-10 15:05', 0),
(60, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-10 16:35', 0),
(61, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-10 18:00', 0),
(62, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-11 13:42', 0),
(63, '341435123576A', 5, 'Diabetes', 0, '', '', '2022-05-11 13:14', 0),
(64, '49213961P', 5, 'Diabetes', 0, '', '', '2022-05-11 21:50', 0),
(65, '2384298374K', 5, 'Diabetes', 0, '', '', '2022-05-11 21:30', 0),
(66, '2836492873K', 5, 'RV', 0, '', '', '2022-05-12 14:01', 0),
(67, '2836492873K', 5, 'RV', 0, '', '', '2022-05-12 11:00', 0),
(69, '2836492873K', 5, 'RV', 0, '', '', '2022-05-12 11:30', 0),
(70, '2836492873K', 5, 'RV', 0, '', '', '2022-05-12 12:01', 0);

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
(16, '49213961P', 0, '2022-03-11', '2022-03-11'),
(17, '49213961P', 0, '2022-04-12', '2022-04-12'),
(18, '49213961P', 0, '2022-05-08', '2022-05-08'),
(19, '49213961P', 0, '2022-05-08', '2022-05-08'),
(20, '49213961P', 0, '2022-05-08', '2022-05-09'),
(21, '49213961P', 0, '2022-05-09', '2022-05-10'),
(22, '49213961P', 0, '2022-05-10', '2022-05-10'),
(23, '49213961P', 0, '2022-05-10', '2022-05-10'),
(24, '49213961P', 0, '2022-05-10', '2022-05-10'),
(25, '49213961P', 0, '2022-05-10', '2022-05-10'),
(26, '49213961P', 0, '2022-05-10', '2022-05-10'),
(27, '49213961P', 0, '2022-05-10', '2022-05-10'),
(28, '49213961P', 0, '2022-05-10', '2022-05-10'),
(29, '49213961P', 0, '2022-05-11', '2022-05-11'),
(30, '49213961P', 0, '2022-05-11', '2022-05-11'),
(31, '49213961P', 0, '2022-05-11', '2022-05-11'),
(32, '49213961P', 0, '2022-05-11', '2022-05-11'),
(33, '49213961P', 0, '2022-05-11', '2022-05-11'),
(34, '49213961P', 0, '2022-05-11', '2022-05-11'),
(35, '2384298374K', 1, '2022-05-11', NULL);

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
  `Dosis` varchar(30) NOT NULL,
  `ViaAdministracion` varchar(30) NOT NULL,
  `NRegistro` int(10) NOT NULL,
  `RiesgoEmbarazo` tinyint(1) NOT NULL,
  `RiesgoLactancia` tinyint(1) NOT NULL,
  `ImgCaja` varchar(100) DEFAULT NULL,
  `ImgForma` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `farmacos`
--

INSERT INTO `farmacos` (`IDFarmaco`, `Nombre`, `PrincipioActivo`, `FormaFarm`, `Dosis`, `ViaAdministracion`, `NRegistro`, `RiesgoEmbarazo`, `RiesgoLactancia`, `ImgCaja`, `ImgForma`) VALUES
(5, 'FRENADOL DESCONGESTIVO CAPSULAS DURAS', 'paracetamol + clorfenamina + dextrometorfano + pse', 'CAPSULA', '500 mg/30 mg/15 mg/2 mg', 'VÍA ORAL', 56682, 1, 1, 'undefined', 'undefined'),
(6, 'DOLOSTOP 1 G COMPRIMIDOS', 'paracetamol', 'COMPRIMIDO', '1000 mg', 'VÍA ORAL', 77667, 0, 0, 'undefined', 'undefined'),
(8, 'DORMIDINA DOXILAMINA 12,5 mg COMPRIMIDOS RECUBIERTOS CON PELICULA', 'doxilamina', 'COMPRIMIDO', '12,5 mg', 'VÍA ORAL', 60154, 1, 1, 'undefined', 'undefined'),
(9, 'GELOCATIL 1 g COMPRIMIDOS', 'paracetamol', 'COMPRIMIDO', '1 g paracetamol', 'VÍA ORAL', 66204, 0, 0, 'undefined', 'undefined'),
(10, 'DIANBEN 850 mg COMPRIMIDOS RECUBIERTOS CON PELICULA', 'metformina', 'COMPRIMIDO', '850 mg', 'VÍA ORAL', 55211, 1, 1, 'undefined', 'undefined'),
(11, 'GLUCOLON 5 MG COMPRIMIDOS', 'glibenclamida', 'COMPRIMIDO', '5 mg', 'VÍA ORAL', 50337, 1, 1, 'undefined', 'undefined'),
(12, 'ENANTYUM 12,5 mg COMPRIMIDOS', 'dexketoprofeno', 'COMPRIMIDO', '12,5 mg', 'VÍA ORAL', 60927, 0, 0, 'undefined', 'undefined'),
(13, 'AVAMYS 27,5 MICROGRAMOS/PULVERIZACION, SUSPENSION PARA PULVERIZACION NASAL', 'fluticasona', 'PRODUCTO USO NASAL', '27.5 µg', 'VÍA NASAL', 7434003, 0, 0, 'undefined', 'undefined'),
(14, 'FLUTICASONA ALDO-UNION 1 MG/ML SUSPENSION PARA INHALACION POR NEBULIZADOR', 'fluticasona', 'INHALACIÓN PULMONAR', '1 mg/ml', 'VÍA INHALATORIA', 84406, 1, 1, 'undefined', 'undefined'),
(15, 'DIAMICRON 30 mg COMPRIMIDOS DE LIBERACION MODIFICADA', 'gliclazida', 'COMPRIMIDO LIBERACION MODIFICADA', '30 mg', 'VÍA ORAL', 63644, 1, 1, 'undefined', 'undefined'),
(16, 'MINODIAB 5 mg COMPRIMIDOS', 'glipizida', 'COMPRIMIDO', '5 mg', 'VÍA ORAL', 51293, 1, 1, 'undefined', 'undefined'),
(17, 'GLIMEPIRIDA CINFA 2 mg COMPRIMIDOS EFG', 'glimepirida', 'COMPRIMIDO', '2 mg', 'VÍA ORAL', 67512, 1, 1, 'undefined', 'undefined'),
(19, 'EZETIMIBA/SIMVASTATINA CINFAMED 10 MG/20 MG COMPRIMIDOS EFG', 'simvastatina + ezetimiba', 'COMPRIMIDO', '10 MG/20 MG', 'VÍA ORAL', 82799, 1, 1, 'undefined', 'undefined'),
(20, 'ENALAPRIL CINFA 10 mg COMPRIMIDOS', 'enalapril', 'COMPRIMIDO', '10 mg enalapril maleato', 'VÍA ORAL', 73300, 1, 1, 'undefined', 'undefined'),
(21, 'ACTRAPID INNOLET 100 UI/ML SOLUCION INYECTABLE EN UNA PLUMA PRECARGADA', 'insulina regular', 'INYECTABLE', '100 U/ml', 'VÍA INTRAVENOSA', 2230011, 0, 0, 'undefined', 'undefined'),
(22, 'ACTRAPID 100 UI/ML SOLUCION INYECTABLE EN UN VIAL', 'insulina regular', 'INYECTABLE', '100 U/ml', 'VÍA INTRAVENOSA', 2230003, 0, 0, 'undefined', 'undefined'),
(23, 'INSULATARD FLEXPEN 100 UI/ml SUSPENSION INYECTABLE EN PLUMA PRECARGADA', 'insulina isófana (NPH)', 'INYECTABLE', '100 UI/ml', 'VÍA SUBCUTÁNEA', 2233014, 0, 0, 'undefined', 'undefined'),
(24, 'INSULATARD 100 UI/ml SUSPENSION INYECTABLE EN VIAL', 'insulina isófana (NPH)', 'INYECTABLE', '100 UI/ml', 'VÍA SUBCUTÁNEA', 2233003, 0, 0, 'undefined', 'undefined'),
(25, 'FLUMIL 100 MG/ML SOLUCION INYECTABLE', 'acetilcisteína', 'INYECTABLE', '10 % acetilcisteina', 'VÍA ENDOTRAQUEOPULMONAR', 41474, 0, 0, 'undefined', 'undefined'),
(26, 'SIMVASTATINA CINFA 10 mg COMPRIMIDOS RECUBIERTOS CON PELICULA EFG', 'simvastatina', 'COMPRIMIDO', '10 mg simvastatina', 'VÍA ORAL', 64519, 1, 1, 'undefined', 'undefined');

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
(15, '49213961P', 0),
(16, '49213961P', 0),
(17, '49213961P', 0),
(18, '49213961P', 0),
(19, '49213961P', 0),
(20, '49213961P', 0),
(21, '49213961P', 0),
(23, '49213961P', 0),
(24, '49213961P', 0),
(25, '49213961P', 0),
(26, '49213961P', 0),
(27, '49213961P', 1),
(28, '2384298374K', 0),
(29, '13847612H', 0);

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
('123123456N', 'Rodolfo', 'Pérez', '1987-12-19', 'M', 185, 81),
('123487718234', 'Rodrigo', 'Cifuentes', '1991-02-01', 'M', 177, 70),
('13847612H', 'Julia', 'Simvastatina', '1985-04-03', 'F', 150, 65),
('2384298374K', 'Gloria', 'Fuertes Dianben', '1991-01-01', 'F', 170, 60),
('2836492873K', 'Paco', 'Márquez Enalapril', '1997-08-10', 'M', 190, 89),
('341435123576A', 'Roberto', 'Perez Minodiab', '1990-06-05', 'M', 167, 85),
('34468343S', 'Guillermo', 'BG', '2000-08-29', 'M', 177, 76),
('49213961P', 'Cecilia ', 'Marcus', '1998-02-07', 'F', 165, 67),
('6578493', 'alvaro', 'ejemplo', '1995-01-03', 'M', 160, 70),
('675849758493', 'ejemplo', 'dia1', '1998-02-01', 'M', 190, 80),
('683947298B', 'Pepito', 'Ramirez', '1994-02-05', 'M', 183, 78);

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
(10, '49213961P', 'Hipotensión', 'Es ligeramente hipotensa, no requiere tratamiento por ahora', 1, '2021-07-13', NULL),
(11, '00033345t', 'Celíaco', '', 1, '2006-11-22', NULL),
(12, '884763482H', 'Colesterol alto', '', 1, '2022-05-03', NULL),
(13, '2384298374K', 'Diabetes tipo 2', '', 0, '0000-00-00', '0000-00-00'),
(14, '13847612H', 'hipercolesterolemia', '', 1, '2022-04-10', NULL);

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
(5, 41),
(6, 33),
(6, 37),
(6, 38),
(6, 38),
(6, 33),
(6, 37),
(6, 33),
(6, 37),
(6, 38),
(6, 33),
(6, 37),
(6, 38);

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
(5, 'RV', '2022-03-03', '2-2022'),
(6, 'Diabetes', '2022-05-11', '05-2022'),
(7, 'prueba', '2022-05-11', '05-2022');

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
(1, 'Pulso'),
(2, 'Tensión Sistólica'),
(3, 'Tensión Diastólica'),
(4, 'Ácido Láctico'),
(5, 'GBC-glucemia capilar'),
(6, 'HbA1c'),
(7, 'LDL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamiento`
--

CREATE TABLE `tratamiento` (
  `IDTratamiento` int(10) NOT NULL,
  `IdPaciente` varchar(30) NOT NULL,
  `IDFarmaco` int(11) DEFAULT NULL,
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

INSERT INTO `tratamiento` (`IDTratamiento`, `IdPaciente`, `IDFarmaco`, `FechaInicio`, `FechaFin`, `IntervaloTomas`, `Cantidad`, `Anotaciones`, `EfectosSecundarios`, `IDCita`) VALUES
(14, '683947298B', 5, '2022-04-08', '2022-04-15', NULL, NULL, NULL, NULL, NULL),
(16, '49213961P', 6, '2022-04-11', '2022-04-18', NULL, NULL, NULL, NULL, NULL),
(18, '49213961P', 5, '2022-04-04', '2022-04-08', NULL, NULL, NULL, NULL, NULL),
(21, '123123456N', 10, '2022-04-25', '2022-10-21', '24', '425 mg', NULL, NULL, NULL),
(24, '49213961P', 23, '2022-05-11', '2022-05-15', '12 ', '13,4 UI', 'Hay que cambiar el tratamiento y empezar a usar insulina. \nLa siguiente revisión será en cuatro días. \nRemitir a médico para revisión de tratamiento. \nTomar 8.93 UI antes de desayunar y 4.47 UI antes de cenar.', NULL, 62),
(25, '341435123576A', 16, '2022-05-11', '2022-05-18', '24 ', '5 mg', 'Tomar antes del desayuno.', NULL, 63),
(27, '2836492873K', 20, '2022-05-12', '2022-08-12', '24 ', '5 mg', 'Derivación anual a médico de familia. \nMantener dosis y tomar una vez al día. \nSolicitar analíticas y ECG.', NULL, 69),
(28, '2384298374K', 10, '2022-05-11', '2022-05-18', '12 ', '850 mg', 'Tomar dos veces al día, en el desayuno y en la cena.', NULL, 65),
(29, '13847612H', 26, '2022-05-05', '2022-05-19', '24', '20 mg', NULL, NULL, NULL);

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
(1, 1, 'Pulsaciones por minuto', 'ppm', 80, 60),
(2, 2, 'Milimetro de mercurio', 'mmHg', 125, 1100),
(3, 3, 'Milimetro de mercurio', 'mmHg', 85, 70),
(6, 4, 'Miligramos por decilitro', 'mg/dL', 19.8, 4.5),
(7, 4, 'Milimoles por litro', 'mmol/L', 2.2, 0.5),
(8, 5, 'miligramos por decilitro', 'mg/dL', 95, 60),
(11, 6, 'Porcentaje', '%', 7, 4),
(12, 7, 'miligramos/ decilitro', 'mg/dL', 100, 50);

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
  `Cita` int(11) NOT NULL,
  `IDEnfermero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `variablefisica`
--

INSERT INTO `variablefisica` (`IDVariable`, `IDPaciente`, `Tipo`, `Valor`, `Unidades`, `Cita`, `IDEnfermero`) VALUES
(36, '49213961P', 5, 85, 'mg/dL', 52, 12312312),
(37, '49213961P', 5, 95, 'mg/dL', 52, 12312312),
(58, '49213961P', 5, 80, 'mg/dL', 56, 12312312),
(59, '2836492873K', 3, 80, 'mmHg', 59, 12312312),
(60, '2836492873K', 2, 120, 'mmHg', 59, 12312312),
(65, '49213961P', 5, 85, 'mg/dL', 62, 12312312),
(66, '49213961P', 5, 92, 'mg/dL', 62, 12312312),
(71, '2384298374K', 5, 135, 'mg/dL', 65, 12312312),
(72, '2836492873K', 2, 120, 'mmHg', 66, 12312312),
(73, '2836492873K', 3, 80, 'mmHg', 66, 12312312),
(74, '2836492873K', 2, 120, 'mmHg', 67, 12312312),
(75, '2836492873K', 3, 80, 'mmHg', 67, 12312312),
(76, '2836492873K', 2, 120, 'mmHg', 69, 12312312),
(77, '2836492873K', 3, 85, 'mmHg', 69, 12312312),
(78, '2836492873K', 1, 50, 'ppm', 69, 12312312);

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
  MODIFY `IDAlergia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `IDCita` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `datosusuarios`
--
ALTER TABLE `datosusuarios`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `embarazo`
--
ALTER TABLE `embarazo`
  MODIFY `IDEmbarazo` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `enfermero`
--
ALTER TABLE `enfermero`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `farmacos`
--
ALTER TABLE `farmacos`
  MODIFY `IDFarmaco` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `fotos`
--
ALTER TABLE `fotos`
  MODIFY `IDFoto` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lactancia`
--
ALTER TABLE `lactancia`
  MODIFY `IDLactancia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `patologiasprevias`
--
ALTER TABLE `patologiasprevias`
  MODIFY `IDPatologia` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
  MODIFY `IDVariable` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  MODIFY `IDTratamiento` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `unidadesvariables`
--
ALTER TABLE `unidadesvariables`
  MODIFY `IDUnidad` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `variablefisica`
--
ALTER TABLE `variablefisica`
  MODIFY `IDVariable` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

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
  ADD CONSTRAINT `PacienteTratado` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE,
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

--
-- Filtros para la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  ADD CONSTRAINT `Medicacion` FOREIGN KEY (`IDFarmaco`) REFERENCES `farmacos` (`IDFarmaco`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `PacienteMedicado` FOREIGN KEY (`IdPaciente`) REFERENCES `pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `unidadesvariables`
--
ALTER TABLE `unidadesvariables`
  ADD CONSTRAINT `UnidadDe` FOREIGN KEY (`IDVariable`) REFERENCES `tiposvariables` (`IDVariable`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `variablefisica`
--
ALTER TABLE `variablefisica`
  ADD CONSTRAINT `pacCorrespondiente` FOREIGN KEY (`IDPaciente`) REFERENCES `pacientes` (`NIdentidad`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `varMedCorrespondiente` FOREIGN KEY (`Tipo`) REFERENCES `tiposvariables` (`IDVariable`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
