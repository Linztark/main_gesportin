




-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: database:3306
-- Tiempo de generación: 08-01-2026 a las 07:53:16
-- Versión del servidor: 8.4.6
-- Versión de PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `esportin`
--

-- --------------------------------------------------------


CREATE TABLE `equipo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf32_unicode_ci NOT NULL,
  `id_club` bigint NOT NULL,
  `id_entrenador` bigint NOT NULL,
  `id_categoria` bigint NOT NULL,
  `id_liga` bigint NOT NULL,
  `id_temporada` bigint NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;


CREATE TABLE jugador (
  id BIGINT NOT NULL AUTO_INCREMENT,
  dorsal INT NOT NULL,
  posicion VARCHAR(50) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  capitan TINYINT(1) NOT NULL DEFAULT 0,
  imagen VARCHAR(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci DEFAULT NULL,
  id_usuario BIGINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;


--Tabla tipo usuario Marcos
CREATE TABLE `tipo_usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

COMMIT;



