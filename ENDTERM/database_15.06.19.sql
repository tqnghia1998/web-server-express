CREATE DATABASE  IF NOT EXISTS `baodientu16th` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `baodientu16th`;
-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: localhost    Database: baodientu16th
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `categories` (
  `cateID` int(11) NOT NULL,
  `cateName` varchar(45) DEFAULT NULL,
  `parentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`cateID`),
  KEY `FK_Cate_Cate_idx` (`parentID`),
  CONSTRAINT `FK_Cate_Cate` FOREIGN KEY (`parentID`) REFERENCES `categories` (`cateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Thời sự',NULL),(2,'Văn hóa - Chính trị',NULL),(3,'Du lịch',1),(4,'Kinh tế',1),(5,'Giáo dục',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comments` (
  `posID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `content` varchar(500) DEFAULT NULL,
  `datePost` datetime DEFAULT NULL,
  PRIMARY KEY (`posID`,`userID`),
  KEY `FK_Comment_User_idx` (`userID`),
  CONSTRAINT `FK_Comment_Post` FOREIGN KEY (`posID`) REFERENCES `posts` (`posID`),
  CONSTRAINT `FK_Comment_User` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `editors`
--

DROP TABLE IF EXISTS `editors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `editors` (
  `userID` int(11) NOT NULL,
  `cateID` int(11) NOT NULL,
  PRIMARY KEY (`userID`,`cateID`),
  KEY `FK_Editor_Cate_idx` (`cateID`),
  CONSTRAINT `FK_Editor_Cate` FOREIGN KEY (`cateID`) REFERENCES `categories` (`cateID`),
  CONSTRAINT `FK_Editor_User` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `editors`
--

LOCK TABLES `editors` WRITE;
/*!40000 ALTER TABLE `editors` DISABLE KEYS */;
INSERT INTO `editors` VALUES (30,2),(30,4);
/*!40000 ALTER TABLE `editors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `images` (
  `posID` int(11) NOT NULL AUTO_INCREMENT,
  `Url` varchar(1000) NOT NULL,
  PRIMARY KEY (`posID`,`Url`),
  CONSTRAINT `FK_Image_Post` FOREIGN KEY (`posID`) REFERENCES `posts` (`posID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `posts` (
  `posID` int(11) NOT NULL AUTO_INCREMENT,
  `cateID` int(11) DEFAULT NULL,
  `Title` varchar(500) DEFAULT NULL,
  `DayPublish` date DEFAULT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `Content` varchar(5000) DEFAULT NULL,
  `Writer` int(11) DEFAULT NULL,
  `Premium` tinyint(4) DEFAULT NULL,
  `Views` int(10) DEFAULT NULL,
  `Approved` tinyint(4) DEFAULT NULL,
  `Additional` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Published` tinyint(4) DEFAULT NULL,
  `DayWritten` date DEFAULT NULL,
  PRIMARY KEY (`posID`),
  KEY `FK_Post_User_idx` (`Writer`),
  KEY `FK_Post_Cate_idx` (`cateID`),
  CONSTRAINT `FK_Post_Cate` FOREIGN KEY (`cateID`) REFERENCES `categories` (`cateID`),
  CONSTRAINT `FK_Post_User` FOREIGN KEY (`Writer`) REFERENCES `writers` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'Khởi động dự án xử lý dioxin ở sân bay Biên Hòa','2019-05-05','Khởi động dự án xử lý dioxin ở sân bay Biên Hòa','Khởi động dự án xử lý dioxin ở sân bay Biên Hòa',29,1,5,1,'',1,NULL),(2,1,'Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ','2019-03-05','Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ','Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ',29,0,6,0,NULL,1,NULL),(3,1,'Trịnh Quan Nghĩa Chơi Bê Đê và cái kết','2019-06-08','Trịnh Quan Nghĩa Chơi Bê Đê và cái kết','Trịnh Quan Nghĩa Chơi Bê Đê và cái kết',29,0,6,1,NULL,0,NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postsandtags`
--

DROP TABLE IF EXISTS `postsandtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `postsandtags` (
  `posID` int(11) NOT NULL,
  `tagID` int(11) NOT NULL,
  PRIMARY KEY (`posID`,`tagID`),
  KEY `FK_PostTag_Tag_idx` (`tagID`),
  CONSTRAINT `FK_PostTag_Post` FOREIGN KEY (`posID`) REFERENCES `posts` (`posID`),
  CONSTRAINT `FK_PostTag_Tag` FOREIGN KEY (`tagID`) REFERENCES `tags` (`tagID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postsandtags`
--

LOCK TABLES `postsandtags` WRITE;
/*!40000 ALTER TABLE `postsandtags` DISABLE KEYS */;
INSERT INTO `postsandtags` VALUES (1,1),(2,1),(1,2),(2,2),(3,2),(1,3),(3,4);
/*!40000 ALTER TABLE `postsandtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `securities`
--

DROP TABLE IF EXISTS `securities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `securities` (
  `userID` int(11) NOT NULL,
  `password_reset_token` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `password_reset_expire` datetime DEFAULT NULL,
  PRIMARY KEY (`userID`),
  CONSTRAINT `FK_Security_User` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `securities`
--

LOCK TABLES `securities` WRITE;
/*!40000 ALTER TABLE `securities` DISABLE KEYS */;
INSERT INTO `securities` VALUES (28,'97504348096676985325048310263200','2019-06-15 12:57:02'),(31,'76595104272615068256093071030772','2019-06-14 17:06:52');
/*!40000 ALTER TABLE `securities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscribers`
--

DROP TABLE IF EXISTS `subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `subscribers` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `dateSubBegin` date DEFAULT NULL,
  `dateSubEnd` date DEFAULT NULL,
  PRIMARY KEY (`userID`),
  CONSTRAINT `FK_Sub_User` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribers`
--

LOCK TABLES `subscribers` WRITE;
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
INSERT INTO `subscribers` VALUES (28,'2019-06-11','2019-06-15'),(31,'2019-06-14','2019-06-21');
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tags` (
  `tagID` int(11) NOT NULL AUTO_INCREMENT,
  `tagName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`tagID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'nghia'),(2,'danhnhau'),(3,'sinhvien'),(4,'nghiencuu');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `uName` varchar(45) DEFAULT NULL,
  `Username` varchar(20) DEFAULT NULL,
  `Password` varchar(250) DEFAULT NULL,
  `Role` int(11) NOT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `Birthday` datetime DEFAULT NULL,
  `Actived` tinyint(4) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (28,'Trịnh Quang Nghĩa','nghiatq','$2b$10$gmohocIBqi6rWN1lXTi6R.a6x8RTK/bEi9wc4b0sn.4KXcv6A0rau',4,'tonystrinh@gmail.com','1998-07-08 00:00:00',1),(29,'Trần Bá Ngọc','ngoctb','$2b$10$Zzo7H2QzG97OXsSGekKMQ.tBIqzEITh4Oyyk0vFtLpQcYcoChbFuC',2,'tranbangoc@gmail.com','1998-07-08 00:00:00',1),(30,'Nguyễn Xuân Nghiêm','nghiemnx','$2b$10$aNRw.FMpREjf0KVFBYIxkOmKvYCBQ8SpnpVV8uGDv1Mb6iY7UCKnm',3,'nguyenxuannghiem@gmail.com','1998-08-08 00:00:00',1),(31,'Đặng Hoài Nam','namdh3','$2b$10$6C4pjmHWLMXBRN5K.jHtbeUHO9nkJFVuBA8HeD8bArMWolggU8UIa',4,'danghoainam@gmail.com','2019-06-25 00:00:00',1),(32,'Trịnh Nghĩa','nghiatrinh','$2b$10$gU8oq.djdmh8zb1axMCvXOb6ax83OgikB5ULDuY3X9AvCagkwzbai',3,'tonystrinh@gmail.com','2019-06-13 00:00:00',1),(34,'Trịnh Nghĩa','nghiatq2','$2b$10$SJrB23eKFtGdRHL.L69TD.33IgGWQVLVTMwiisAX8FDf9SMPME92G',2,'tonystrinh@gmail.com','2019-06-20 00:00:00',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writers`
--

DROP TABLE IF EXISTS `writers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `writers` (
  `userID` int(11) NOT NULL,
  `Pseudonym` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `Pseudonym_UNIQUE` (`Pseudonym`),
  CONSTRAINT `FK_Writter_User` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writers`
--

LOCK TABLES `writers` WRITE;
/*!40000 ALTER TABLE `writers` DISABLE KEYS */;
INSERT INTO `writers` VALUES (34,'Nghĩa đẹp trai'),(29,'Ngọc đỉnh kout');
/*!40000 ALTER TABLE `writers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-15 13:39:17
