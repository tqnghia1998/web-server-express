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
INSERT INTO `editors` VALUES (45,1),(30,2),(55,2),(35,3),(46,3),(30,4),(44,5),(52,5);
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
  `DayPublish` datetime DEFAULT NULL,
  `Description` varchar(200) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,3,'Khởi động dự án xử lý dioxin ở sân bay Biên Hòa','2020-05-05 00:00:00','Khởi động dự án xử lý dioxin ở sân bay Biên Hòa Khởi động dự án xử lý dioxin ở sân bay Biên Hòa','Khởi động dự án xử lý dioxin ở sân bay Biên Hòa',29,1,5,1,'',1,NULL),(2,1,'Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ','2019-09-05 00:00:00','Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ','Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ',29,0,6,1,NULL,1,NULL),(3,2,'Trịnh Quan Nghĩa đẹp trai nhất lịch sử nhân loại từ trước đến nay','2019-06-18 00:00:00','Trịnh Quan Nghĩa đẹp trai nhất lịch sử nhân loại từ trước đến nay Trịnh Quan Nghĩa đẹp trai nhất','Trịnh Quan Nghĩa đẹp trai nhất lịch sử nhân loại từ trước đến nay',29,0,6,1,NULL,1,NULL),(4,4,'Nguyễn Xuân Nghiêm xung phong ra biển đảo','2019-06-12 00:00:00','Nguyễn Xuân Nghiêm xung phong ra biển đảo đánh giặc Trung Quốc để cống hiến cho tổ quốc thân yêu','Nguyễn Xuân Nghiêm xung phong ra biển đảo đánh giặc Trung Quốc',29,1,3,1,NULL,1,NULL);
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
INSERT INTO `postsandtags` VALUES (1,1),(2,1),(1,2),(2,2),(3,2),(4,2),(1,3);
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
INSERT INTO `securities` VALUES (28,'97504348096676985325048310263200','2019-06-15 12:57:02'),(31,'76595104272615068256093071030772','2019-06-14 17:06:52'),(57,'44556185955137953590256713919576','2019-06-16 21:29:04');
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
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribers`
--

LOCK TABLES `subscribers` WRITE;
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
INSERT INTO `subscribers` VALUES (28,'2019-06-15','2019-06-22'),(31,'2019-06-15','2019-06-22'),(42,'2019-06-16','2019-06-23'),(49,'2019-06-16','2019-06-23'),(57,'2019-06-16','2019-06-23'),(78,'2019-06-17','2019-06-17'),(81,'2000-01-01','2000-01-01');
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
  `FacebookID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`),
  UNIQUE KEY `FacebookID_UNIQUE` (`FacebookID`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (28,'Trịnh Quang Nghĩa','nghiatq','$2b$10$wUox//pLnqWL7PQO1atW1uvLwduJH1cypQBmmq66Ss.4dKDNyY63u',0,'tonystrinh@gmail.com','1998-07-08 00:00:00',1,NULL),(29,'Trần Bá Ngọc','ngoctb','$2b$10$Zzo7H2QzG97OXsSGekKMQ.tBIqzEITh4Oyyk0vFtLpQcYcoChbFuC',2,'tranbangoc@gmail.com','1998-07-08 00:00:00',1,NULL),(30,'Nguyễn Xuân Nghiêm','nghiemnx','$2b$10$aNRw.FMpREjf0KVFBYIxkOmKvYCBQ8SpnpVV8uGDv1Mb6iY7UCKnm',3,'nguyenxuannghiem@gmail.com','1998-08-08 00:00:00',1,NULL),(31,'Đặng Hoài Nam','namdh3','$2b$10$6C4pjmHWLMXBRN5K.jHtbeUHO9nkJFVuBA8HeD8bArMWolggU8UIa',4,'danghoainam@gmail.com','2019-06-25 00:00:00',1,NULL),(32,'Trịnh Nghĩa','nghiatrinh','$2b$10$gU8oq.djdmh8zb1axMCvXOb6ax83OgikB5ULDuY3X9AvCagkwzbai',3,'tonystrinh@gmail.com','2019-06-13 00:00:00',1,NULL),(34,'Trịnh Nghĩa','nghiatq2','$2b$10$SJrB23eKFtGdRHL.L69TD.33IgGWQVLVTMwiisAX8FDf9SMPME92G',2,'tonystrinh@gmail.com','2019-06-20 00:00:00',1,NULL),(35,'Trịnh Quang Nghĩa','ngoctb1','$2b$10$yqN6nl.znzZIHtCpjlTkxO1y5KtL3by3IlytIOKv8qjTso.yrLTr6',3,'tonystrinh@gmail.com','2019-06-07 00:00:00',1,NULL),(36,'Trịnh Quang Nghĩa','ngoctb2','$2b$10$6OL98n/KnFsFRBtGfQETfeXcZljv1ihgGsHiYIGkGe./wxgMW0Jli',2,'tonystrinh@gmail.com','2019-06-13 00:00:00',1,NULL),(38,'Trịnh Nghĩa','ngoctb4','$2b$10$jxGl91ZuwSxEAUGlnK/QpOmwvYbOgkiWxFdvL9reolf8MygxX8bUm',2,'tonystrinh@gmail.com','2019-06-28 00:00:00',1,NULL),(39,'Trịnh Quang Nghĩa','ngoctb5','$2b$10$gIVUkZZsgDp5HfdWI2EgW.Qt7kfVNSIoTO0SDghzxg4ZU/hjz3rPa',2,'tonystrinh@gmail.com','2019-06-12 00:00:00',1,NULL),(40,'Trịnh Quang Nghĩa','ngoctb6','$2b$10$jM5VQtG9/vUk6qrKB7ZXbOZ/6xEvxR90ijHz4diNrF4E.nnc4p0Ay',2,'tonystrinh@gmail.coms','2019-06-14 00:00:00',1,NULL),(41,'Trịnh Quang Nghĩa','ngoctb9','$2b$10$r6/bR6I6Aipkc49zeEUMue8QspcY1EXwQe5UqeDrOzk64O5ng2som',2,'tonystrinh@gmail.comd','2019-06-01 00:00:00',1,NULL),(42,'Trịnh Nghĩa','ngoctb12','$2b$10$MMge5UyCYMeLu0bKUWtek.NZs7TmXPMpMwK2FSRDNsu/aI1rMb5gi',4,'tonystrinh@gmail.com','2019-06-07 00:00:00',1,NULL),(43,'Trịnh Quang Nghĩa','ngoctb43','$2b$10$uvowz04iRaFwESMYmXjoFu8/wJ3ySf./Wmn58kKyn/RrIBhDRvrre',2,'tonystrinh@gmail.com','2019-06-13 00:00:00',1,NULL),(44,'Trịnh Quang Nghĩad','ngoctbk','$2b$10$vbuPhjfKQHFP3XeYuputgeCLBZTpm1TRtQeEkuP9n4C/PMrpsUz.u',3,'tonystrinh@gmail.com1','2019-06-12 00:00:00',1,NULL),(45,'Trịnh Quang Nghĩa','ngoctb234','$2b$10$Z4b9fRYnIm298147zQa4funUZr.R2fB3E8R.k.vhrI31ytppKOdPO',3,'tonystrinh@gmail.com','2019-06-19 00:00:00',1,NULL),(46,'Trịnh Quang Nghĩa','namdh31','$2b$10$BA05ttVWhQe37DhQzKtGIee21yJF0lHUb/yuI3ro.zyQWWXx9WLgG',3,'tonystrinh@gmail.com','2019-05-31 00:00:00',1,NULL),(47,'Trịnh Quang Nghĩas','nghiatq11','$2b$10$7XrjIpmNrVsXeqZfq.vLyOLZ1vLV.s2YIwdomrTIh6j96DunkHdVm',2,'tonystrinh@gmail.coms','2019-06-01 00:00:00',1,NULL),(48,'Trịnh Quang Nghĩa','ngoctb54','$2b$10$o0nhoaCj0r9N/f4LTDjA4OSDXpW1XJ6yKuYq/MiKY2IjwpvsUv4Pm',2,'tonystrinh@gmail.com','2019-06-20 00:00:00',1,NULL),(49,'Trịnh Quang Nghĩa','ngoctb111','$2b$10$0j0BnCsdi85cH0XkcjnqAujL0N7R0v.dhOyIaUe1qkR6.sMZdj5mW',4,'tonystrinh@gmail.com','2019-06-10 00:00:00',1,NULL),(50,'Trịnh Quang Nghĩa','ngoctb222','$2b$10$EXj2F9rFHgHZpMvaluVjt.4ER6u.a7CR24O2u2TnM77y7OpxTiWpS',2,'tonystrinh@gmail.com','2019-06-20 00:00:00',1,NULL),(51,'Trịnh Quang Nghĩa','ngoctb333','$2b$10$C/NAGtQXDKQ2X8iu0yMMaOlIR1L8Q1AZJL0S744QnBYSVpBi6kRDG',2,'tonystrinh@gmail.com','2019-06-19 00:00:00',1,NULL),(52,'Trịnh Quang Nghĩa','ngoctb444','$2b$10$XFkgeHA3OYNT8iY.YDE8yuteSXG2OsANvkfGs0NRjJv5w5mWUJ9Rq',3,'tonystrinh@gmail.com','2019-05-30 00:00:00',1,NULL),(53,'Trịnh Quang Nghĩa','ngoctb555','$2b$10$xdX1I4ig.n8cmgLzqPuKNeU24tSskw3gmxMMfkAc42XJKrHId9pfW',2,'tonystrinh@gmail.com','2019-06-01 00:00:00',1,NULL),(54,'Trịnh Quang Nghĩad','3424234','$2b$10$wXY4O0BPrtiJrCX/4AKl..eVz8eASFK2WRrCT7iH4rEav2c.aDX.G',2,'tonystrinh@gmail.com','2019-06-07 00:00:00',1,NULL),(55,'Trịnh Quang Nghĩa','ngoctber','$2b$10$89iith2zxVgnr.FCyRqVeueHlo6SI2YLTOTNIGLZQW1pAakmwCEn6',3,'tonystrinh@gmail.com','2019-06-20 00:00:00',1,NULL),(56,'Trịnh Quang Nghĩa','ngoctb22','$2b$10$r/EC8zB8G1ER4.pbYjsvM.H653HrQnt7Sk06mb0ztRuHvE/2qmMF2',2,'tonystrinh@gmail.com','2019-06-06 00:00:00',1,NULL),(57,'123123123123','quangnghia2','$2b$10$5.7p8d6xVIK3sZ8N/vt9muJO/aVTfX3N3cLs6gKjVt2YiK68T3MLW',4,'tonystrinh@gmail.com','2019-06-05 00:00:00',1,NULL),(77,'Quang Nghĩa','887159858283441','$2b$10$7IAj9WMH06lg1V9cusBu0eCFrQV/won9nfz04df3.CAmaolny3xJi',2,'tonys_trinh@outlook.com',NULL,1,'887159858283441'),(78,'Trần Bá Ngọc','105432907403686','$2b$10$NDyRSjjYPUzOTt9vLvcHUOClrnXb8PmP0nX0Wst0aTxAd5BQcxu2a',4,'tran_tvglaeo_ngoc@tfbnw.net',NULL,1,'105432907403686'),(81,'Nghia Trinh','1266684613490924','$2b$10$eA0pFUBsnvLrztj/Lr/HFOob1EyrOsrJXnDYo0miXodkbbXQStIiy',4,'tonystrinh@gmail.com',NULL,1,'1266684613490924');
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
INSERT INTO `writers` VALUES (77,'887159858283441'),(48,'Bút danh'),(56,'Bút danh cu'),(53,'Bút danh nè'),(51,'Con cu nè'),(34,'Nghĩa đẹp trai'),(40,'Nghiêm xung phong'),(43,'Ngọc giả nai'),(29,'Ngọc đỉnh kout'),(50,'Team 3NG');
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

-- Dump completed on 2019-06-17  1:53:44
