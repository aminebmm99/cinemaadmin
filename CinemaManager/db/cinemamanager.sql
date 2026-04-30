-- XAMPP-Lite
-- version 8.4.1
-- https://xampplite.sf.net/
--
-- mysqldump-php https://github.com/ifsnop/mysqldump-php
--
-- Host: 127.0.0.1	Database: cinemamanager
-- ------------------------------------------------------
-- Server version 	11.4.4-MariaDB-log
-- Date: Tue, 28 Apr 2026 12:58:05 +0000

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `films`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `films` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(180) NOT NULL,
  `genre` varchar(80) NOT NULL,
  `duration_minutes` smallint(5) unsigned NOT NULL,
  `classification` varchar(20) NOT NULL,
  `synopsis` text DEFAULT NULL,
  `poster_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_films_title` (`title`),
  KEY `idx_films_genre` (`genre`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `films`
--

INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (34,'Jumanji: The Next Level','Comedy',123,'PG-13','In Jumanji: The Next Level, the gang is back but the game has changed. As they return to rescue one of their own, the players will have to brave parts unknown from arid deserts to snowy mountains, to escape the world\'s most dangerous game.','/CinemaManager/images/jumanji_the_next_level.jpg',1,'2026-04-17 20:57:48','2026-04-17 20:57:48');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (35,'Peaky Blinders: The Immortal Man','Drama',112,'G','During World War II, Tommy Shelby returns to a bombed Birmingham and becomes involved in secret wartime missions facing new threats as he reckons with his past.','/CinemaManager/images/peaky_blinders_the_immortal_man.jpg',1,'2026-04-17 20:59:55','2026-04-17 20:59:55');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (36,'Home Alone','Comedy',103,'G','An eight-year-old troublemaker, mistakenly left home alone, must defend his home against a pair of burglars on Christmas Eve.','/CinemaManager/images/home_alone.jpg',1,'2026-04-17 21:01:27','2026-04-17 21:01:27');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (37,'Sahbek Rajel 2','Comedy',135,'G','Azouz and Mehdi\'s rivalry flares up again, but over a new conflict. Their hot tempers and provocative ways turn every moment into a comic battle filled with stunts and wild twists.','/CinemaManager/images/sahbek_rajel_2.jpg',1,'2026-04-17 21:02:42','2026-04-17 21:02:42');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (38,'Lakcha Men Essma','Comedy',110,'G','Un loser tunisien attachant, escroc à ses heures perdues, interprété par Bassem El Hamraoui, voit sa vie bouleversée lorsqu’il croise la route d’un extraterrestre métamorphe capable de prendre l’apparence de tout ce qu’il observe.\r\n\r\nEntre quiproquos improbables et situations absurdes, ce duo inattendu se retrouve embarqué dans une aventure aussi délirante que satirique. Derrière l’humour et la comédie se dessine peu à peu une mission inattendue : sauver le monde.','/CinemaManager/images/lakcha_men_essma.jpg',1,'2026-04-17 21:03:59','2026-04-17 21:03:59');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (39,'Dachra','Horror',114,'G','An investigation into witchcraft leads a trio of journalism students to a mysterious town marked by sinister rituals. Inspired by true events.','/CinemaManager/images/dachra.jpg',1,'2026-04-22 19:52:56','2026-04-22 19:57:13');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (40,'Barbie','Comedy',114,'PG-13','Barbie and Ken are having the time of their lives in the seemingly perfect world of Barbie Land. However, when they get a chance to go to the outside world, they soon discover the joys and perils of living among regular humans.','/CinemaManager/images/barbie.jpg',1,'2026-04-22 19:59:50','2026-04-22 19:59:50');
INSERT INTO `films` (`id`, `title`, `genre`, `duration_minutes`, `classification`, `synopsis`, `poster_url`, `is_active`, `created_at`, `updated_at`) VALUES (41,'Oppenheimer','Thriller',180,'G','A dramatization of the life story of J. Robert Oppenheimer, the physicist who had a large hand in the development of the atomic bombs that brought an end to World War II.','/CinemaManager/images/oppenheimer.jpg',1,'2026-04-22 20:02:49','2026-04-22 20:02:49');

-- Dumped table `films` with 8 row(s)
--

--
-- Table structure for table `reservations`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(20) NOT NULL,
  `seance_id` int(10) unsigned NOT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(190) NOT NULL,
  `tickets_count` smallint(5) unsigned NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('Confirmee','Attente','Annulee') NOT NULL DEFAULT 'Confirmee',
  `reserved_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `fk_reservations_seance` (`seance_id`),
  KEY `idx_reservations_status` (`status`),
  KEY `idx_reservations_email` (`customer_email`),
  CONSTRAINT `fk_reservations_seance` FOREIGN KEY (`seance_id`) REFERENCES `seances` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `booking_code`, `seance_id`, `customer_name`, `customer_email`, `tickets_count`, `total_amount`, `status`, `reserved_at`, `updated_at`) VALUES (13,'BK7EDB7D93',114,'user','user@cinema.com',2,30.00,'Confirmee','2026-04-22 20:07:15','2026-04-22 20:07:15');
INSERT INTO `reservations` (`id`, `booking_code`, `seance_id`, `customer_name`, `customer_email`, `tickets_count`, `total_amount`, `status`, `reserved_at`, `updated_at`) VALUES (15,'BK16C22321',113,'user','user@cinema.com',1,15.00,'Confirmee','2026-04-22 20:16:14','2026-04-22 20:16:14');
INSERT INTO `reservations` (`id`, `booking_code`, `seance_id`, `customer_name`, `customer_email`, `tickets_count`, `total_amount`, `status`, `reserved_at`, `updated_at`) VALUES (16,'BK6708FEA0',114,'user','user@cinema.com',1,15.00,'Confirmee','2026-04-22 20:18:10','2026-04-22 20:18:10');
INSERT INTO `reservations` (`id`, `booking_code`, `seance_id`, `customer_name`, `customer_email`, `tickets_count`, `total_amount`, `status`, `reserved_at`, `updated_at`) VALUES (17,'BK0956C68F',113,'user','user@cinema.com',1,15.00,'Confirmee','2026-04-22 20:20:52','2026-04-22 20:20:52');
INSERT INTO `reservations` (`id`, `booking_code`, `seance_id`, `customer_name`, `customer_email`, `tickets_count`, `total_amount`, `status`, `reserved_at`, `updated_at`) VALUES (19,'BKF6976D65',115,'salah','salah@gmail.com',1,15.00,'Confirmee','2026-04-22 20:59:50','2026-04-22 20:59:50');

-- Dumped table `reservations` with 5 row(s)
--

--
-- Table structure for table `salle`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `salle` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `capacity` smallint(5) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salle`
--

INSERT INTO `salle` (`id`, `name`, `capacity`, `created_at`) VALUES (14,'Salle 1',100,'2026-04-17 21:05:28');
INSERT INTO `salle` (`id`, `name`, `capacity`, `created_at`) VALUES (15,'Salle 2',150,'2026-04-17 21:05:37');
INSERT INTO `salle` (`id`, `name`, `capacity`, `created_at`) VALUES (16,'Salle 3',100,'2026-04-22 20:04:55');

-- Dumped table `salle` with 3 row(s)
--

--
-- Table structure for table `seances`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seances` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `film_id` int(10) unsigned NOT NULL,
  `room_id` int(10) unsigned DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `total_seats` smallint(5) unsigned NOT NULL,
  `available_seats` smallint(5) unsigned NOT NULL,
  `base_price` decimal(8,2) NOT NULL,
  `status` enum('Disponible','Complet','Annule') NOT NULL DEFAULT 'Disponible',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_seances_film` (`film_id`),
  KEY `fk_seances_room` (`room_id`),
  KEY `idx_seances_start_time` (`start_time`),
  KEY `idx_seances_status` (`status`),
  CONSTRAINT `fk_seances_film` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`),
  CONSTRAINT `fk_seances_room` FOREIGN KEY (`room_id`) REFERENCES `salle` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seances`
--

INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (110,38,14,'2026-04-24 17:00:00',100,100,12.00,'Disponible','2026-04-17 21:06:10','2026-04-28 12:36:16');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (111,38,14,'2026-04-24 20:00:00',100,100,12.00,'Disponible','2026-04-17 21:06:30','2026-04-28 12:36:35');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (112,35,14,'2026-04-25 16:00:00',100,100,10.00,'Disponible','2026-04-17 21:07:11','2026-04-17 21:07:11');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (113,40,14,'2026-05-02 20:00:00',100,98,15.00,'Disponible','2026-04-22 20:03:27','2026-04-22 20:20:52');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (114,39,15,'2026-05-02 18:00:00',150,147,15.00,'Disponible','2026-04-22 20:04:02','2026-04-28 12:47:20');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (115,41,15,'2026-05-01 20:00:00',150,149,15.00,'Disponible','2026-04-22 20:04:39','2026-04-22 20:59:50');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (116,37,14,'2026-05-02 15:00:00',100,100,15.00,'Disponible','2026-04-22 20:06:09','2026-04-28 12:53:56');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (117,40,16,'2026-05-01 18:30:00',100,100,15.00,'Disponible','2026-04-28 12:37:05','2026-04-28 12:37:05');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (118,38,14,'2026-05-01 16:30:00',100,100,15.00,'Disponible','2026-04-28 12:37:28','2026-04-28 12:37:28');
INSERT INTO `seances` (`id`, `film_id`, `room_id`, `start_time`, `total_seats`, `available_seats`, `base_price`, `status`, `created_at`, `updated_at`) VALUES (119,37,16,'2026-05-02 21:00:00',100,100,15.00,'Disponible','2026-04-28 12:55:34','2026-04-28 12:56:01');

-- Dumped table `seances` with 10 row(s)
--

--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `email` varchar(150) NOT NULL,
  `tel` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `tel`) VALUES (13,'admin','admin','admin','','');
INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `tel`) VALUES (14,'user','user','user','user@cinema.com','00000000');
INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `tel`) VALUES (15,'amine','amine','user','amine@gmail.com','98999000');
INSERT INTO `users` (`id`, `username`, `password`, `role`, `email`, `tel`) VALUES (16,'salah','salah23','user','salah@gmail.com','+21629466893');

-- Dumped table `users` with 4 row(s)
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on: Tue, 28 Apr 2026 12:58:05 +0000
