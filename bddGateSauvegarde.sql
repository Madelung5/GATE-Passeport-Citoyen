-- MySQL dump 10.17  Distrib 10.3.12-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: passeportCitoyen
-- ------------------------------------------------------
-- Server version	10.3.12-MariaDB-2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ateliersDisponibles`
--

DROP TABLE IF EXISTS `ateliersDisponibles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ateliersDisponibles` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `annee` smallint(6) DEFAULT NULL,
  `college` smallint(6) DEFAULT NULL,
  `atelier` smallint(6) DEFAULT NULL,
  `professeur` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_college_id` (`college`),
  KEY `fk_atelier_id` (`atelier`),
  KEY `fk_professeur_id` (`professeur`),
  CONSTRAINT `fk_atelier_id` FOREIGN KEY (`atelier`) REFERENCES `listeAteliers` (`id`),
  CONSTRAINT `fk_college_id` FOREIGN KEY (`college`) REFERENCES `listeColleges` (`id`),
  CONSTRAINT `fk_professeur_id` FOREIGN KEY (`professeur`) REFERENCES `loginProfesseur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ateliersDisponibles`
--

LOCK TABLES `ateliersDisponibles` WRITE;
/*!40000 ALTER TABLE `ateliersDisponibles` DISABLE KEYS */;
/*!40000 ALTER TABLE `ateliersDisponibles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ateliersSuivis`
--

DROP TABLE IF EXISTS `ateliersSuivis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ateliersSuivis` (
  `eleve` smallint(6) DEFAULT NULL,
  `atelier` smallint(6) DEFAULT NULL,
  KEY `fk_eleve_id` (`eleve`),
  KEY `fk_atelier_id2` (`atelier`),
  CONSTRAINT `fk_atelier_id2` FOREIGN KEY (`atelier`) REFERENCES `ateliersDisponibles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_eleve_id` FOREIGN KEY (`eleve`) REFERENCES `loginEleve` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ateliersSuivis`
--

LOCK TABLES `ateliersSuivis` WRITE;
/*!40000 ALTER TABLE `ateliersSuivis` DISABLE KEYS */;
/*!40000 ALTER TABLE `ateliersSuivis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donneesEleves`
--

DROP TABLE IF EXISTS `donneesEleves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donneesEleves` (
  `eleve` smallint(6) NOT NULL,
  `nom` varchar(30) DEFAULT NULL,
  `prenom` varchar(30) DEFAULT NULL,
  `college` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`eleve`),
  KEY `fk_college_id2` (`college`),
  CONSTRAINT `fk_college_id2` FOREIGN KEY (`college`) REFERENCES `listeColleges` (`id`),
  CONSTRAINT `fk_eleve_id2` FOREIGN KEY (`eleve`) REFERENCES `loginEleve` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donneesEleves`
--

LOCK TABLES `donneesEleves` WRITE;
/*!40000 ALTER TABLE `donneesEleves` DISABLE KEYS */;
/*!40000 ALTER TABLE `donneesEleves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donneesProfesseurs`
--

DROP TABLE IF EXISTS `donneesProfesseurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donneesProfesseurs` (
  `professeur` smallint(6) NOT NULL,
  `nom` varchar(30) DEFAULT NULL,
  `prenom` varchar(30) DEFAULT NULL,
  `college` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`professeur`),
  KEY `fk_college_id3` (`college`),
  CONSTRAINT `fk_college_id3` FOREIGN KEY (`college`) REFERENCES `listeColleges` (`id`),
  CONSTRAINT `fk_professeur_id2` FOREIGN KEY (`professeur`) REFERENCES `loginProfesseur` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donneesProfesseurs`
--

LOCK TABLES `donneesProfesseurs` WRITE;
/*!40000 ALTER TABLE `donneesProfesseurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `donneesProfesseurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listeAteliers`
--

DROP TABLE IF EXISTS `listeAteliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listeAteliers` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `nomAtelier` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listeAteliers`
--

LOCK TABLES `listeAteliers` WRITE;
/*!40000 ALTER TABLE `listeAteliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `listeAteliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listeColleges`
--

DROP TABLE IF EXISTS `listeColleges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listeColleges` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `nomCollege` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listeColleges`
--

LOCK TABLES `listeColleges` WRITE;
/*!40000 ALTER TABLE `listeColleges` DISABLE KEYS */;
/*!40000 ALTER TABLE `listeColleges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginEleve`
--

DROP TABLE IF EXISTS `loginEleve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loginEleve` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginEleve`
--

LOCK TABLES `loginEleve` WRITE;
/*!40000 ALTER TABLE `loginEleve` DISABLE KEYS */;
INSERT INTO `loginEleve` VALUES (1,'firstUser','firstPassword'),(2,'justAnotherUser','aPassword'),(3,'anotherUser','anotherPassword'),(4,'lastUser','lastPassword');
/*!40000 ALTER TABLE `loginEleve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginProfesseur`
--

DROP TABLE IF EXISTS `loginProfesseur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loginProfesseur` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `user` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginProfesseur`
--

LOCK TABLES `loginProfesseur` WRITE;
/*!40000 ALTER TABLE `loginProfesseur` DISABLE KEYS */;
INSERT INTO `loginProfesseur` VALUES (1,'firstUser','firstPassword'),(2,'aUser','aPassword'),(3,'anotherUser','anotherPassword'),(4,'lastUser','lastPassword');
/*!40000 ALTER TABLE `loginProfesseur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-27 14:18:54
