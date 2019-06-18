CREATE DATABASE  IF NOT EXISTS `baodientu16th` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
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
  `cateID` int(11) NOT NULL AUTO_INCREMENT,
  `cateName` varchar(45) DEFAULT NULL,
  `parentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`cateID`),
  UNIQUE KEY `cateName_UNIQUE` (`cateName`),
  KEY `FK_Cate_Cate_idx` (`parentID`),
  CONSTRAINT `FK_Cate_Cate` FOREIGN KEY (`parentID`) REFERENCES `categories` (`cateID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
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
  `commentID` int(11) NOT NULL AUTO_INCREMENT,
  `posID` int(11) DEFAULT NULL,
  `userID` int(11) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `datePost` datetime DEFAULT NULL,
  PRIMARY KEY (`commentID`),
  KEY `FK_Comment_User_idx` (`userID`),
  KEY `FK_Comment_Post` (`posID`),
  CONSTRAINT `FK_Comment_Post` FOREIGN KEY (`posID`) REFERENCES `posts` (`posID`),
  CONSTRAINT `FK_Comment_User` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,5,29,'Dăm ba thằng Ecuador','2019-06-17 13:48:06'),(2,5,30,'Uruguay quá may mắn','2019-06-17 12:17:00'),(3,5,34,'Chúc mừng Uruguay','2019-06-17 12:17:00'),(4,5,29,'Test comment ','2019-06-17 13:52:52'),(5,5,30,'đá như vậy ai chơi','2019-06-17 18:31:29');
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
INSERT INTO `editors` VALUES (32,1),(30,2),(30,4),(32,5);
/*!40000 ALTER TABLE `editors` ENABLE KEYS */;
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
  `Title` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `DayPublish` datetime DEFAULT NULL,
  `Description` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Content` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Writer` int(11) DEFAULT NULL,
  `Premium` tinyint(4) DEFAULT NULL,
  `Views` int(10) DEFAULT NULL,
  `Approved` tinyint(4) DEFAULT NULL,
  `Additional` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Published` tinyint(4) DEFAULT NULL,
  `DayWritten` date DEFAULT NULL,
  `Url` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `Editor` int(11) DEFAULT NULL,
  PRIMARY KEY (`posID`),
  KEY `FK_Post_User_idx` (`Writer`),
  KEY `FK_Post_Cate_idx` (`cateID`),
  KEY `FK_Post_User_2_idx` (`Editor`),
  FULLTEXT KEY `Title` (`Title`,`Description`,`Content`),
  CONSTRAINT `FK_Post_Cate` FOREIGN KEY (`cateID`) REFERENCES `categories` (`cateID`),
  CONSTRAINT `FK_Post_User` FOREIGN KEY (`Writer`) REFERENCES `writers` (`userID`),
  CONSTRAINT `FK_Post_User_2` FOREIGN KEY (`Editor`) REFERENCES `editors` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,3,'Khởi động dự án xử lý dioxin ở sân bay Biên Hòa','2020-05-05 00:00:00','Khởi động dự án xử lý dioxin ở sân bay Biên Hòa Khởi động dự án xử lý dioxin ở sân bay Biên Hòa','Khởi động dự án xử lý dioxin ở sân bay Biên Hòa',29,1,5,1,'',0,NULL,'/uploads/1560746447596d.jpg',NULL),(2,4,'Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ','2019-09-05 00:00:00','Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ','Nghệ An: Tàu hỏa đâm văng xe tải chở đất, tài xế tử vong tại chỗ',29,0,6,1,NULL,0,NULL,'/uploads/1560746447596d.jpg',NULL),(3,1,'Trịnh Quan Nghĩa đẹp trai nhất lịch sử nhân loại từ trước đến nay','2019-06-18 00:00:00','Trịnh Quan Nghĩa đẹp trai nhất lịch sử nhân loại từ trước đến nay Trịnh Quan Nghĩa đẹp trai nhất','Trịnh Quan Nghĩa đẹp trai nhất lịch sử nhân loại từ trước đến nay',29,0,6,1,NULL,0,NULL,'/uploads/1560746447596d.jpg',NULL),(4,2,'Nguyễn Xuân Nghiêm xung phong ra biển đảo','2019-06-12 00:00:00','Nguyễn Xuân Nghiêm xung phong ra biển đảo đánh giặc Trung Quốc để cống hiến cho tổ quốc thân yêu','Nguyễn Xuân Nghiêm xung phong ra biển đảo đánh giặc Trung Quốc',29,1,3,1,NULL,0,NULL,'/uploads/1560746447596d.jpg',NULL),(5,1,'Uruguay - Ecuador: Khởi đầu rực rỡ, Suarez - Cavani tung hoành','2019-06-12 00:00:00','Suarez và Cavani cho thấy đẳng cấp chói sáng của họ trong màn đại tiệc','<p><strong>ĐT Uruguay </strong>ra sân trận mở màn chiến dịch Copa America 2019 khi đối đầu ĐT Ecuador trên sân Mineirao (sân đấu ở Belo Horizonte mà Brazil từng thua thảm Đức 1-7 ở bán kết World Cup 2014 khi \"Selecao\" cũng là đội chủ nhà). Ngay phút thứ 6, sau đường chuyền từ cánh phải của <a class=\"TextlinkBaiviet\" title=\"Luis Suarez\" href=\"https://www.24h.com.vn/luis-suarez-c48e4385.html\">Luis Suarez</a>, Nicolas Lodeiro có 2 nhịp xử lý khéo léo trước khi sút chân trái tuyệt vời mở tỷ số rất sớm cho <em>Uruguay</em>.</p>\r\n<div>\r\n<div><img class=\"news-image initial loading\" src=\"https://cdn.24h.com.vn/upload/2-2019/images/2019-06-17/Video-ket-qua-bong-da-Uruguay---Ecuador-Khoi-dau-ruc-ro-noi-oan-hon-VAR-ur-1-1560726664-753-width660height439.jpg\" alt=\"Uruguay - Ecuador: Khởi đầu rực rỡ, Suarez - Cavani tung hoành - 1\" data-was-processed=\"true\" /></div>\r\n</div>\r\n<p>Uruguay đã chơi tấn công vũ bão ngay từ đầu lấn lướt Ecuador</p>\r\n<p>Tưởng chừng Ecuador đã gặp may mắn khi trọng tài chính người Brazil - Anderson Daronco không công nhận bàn thắng từ cú đánh đầu của Nahitan Nandez từ quả tạt của Lodeiro sau đường căng ngang bên cánh trái mắc lỗi việt vị khi di chuyển của Edinson Cavani phút 11 thì đội bóng áo vàng lại nhận thêm tổn thất.</p>\r\n<p>Phút 23, họ chỉ còn chơi với 10 người sau khi trọng tài chính của nước chủ nhà \"bẻ còi\" sau khi tham khảo VAR (công nghệ video trợ giúp trọng tài) để rút thẻ đỏ trực tiếp thay vì thẻ vàng trước đó từng dành cho Jose Quinteros khi hậu vệ phải của Ecuador có tình huống vung tay thô bạo vào mặt của Loreiro khi cả hai nhảy lên tranh bóng nhau.</p>\r\n<p>Chơi hơn người và có lợi thế dẫn bàn, <u>Uruguay</u> chơi thoải mái. Cavani \"ngả bàn đèn\" móc vô-lê ngẫu hứng phút 33 trước khi đối tác trên hàng công Suarez cũng không chịu kém cạnh khi ra chân cận thành giúp Uruguay có lợi thế dẫn 3 bàn quá lớn trước Ecuador khi hiệp đầu tiên khép lại.</p>\r\n<p>Sang hiệp 2, Uruguay vẫn kiểm soát hoàn toàn thế trận tại Mineirao. Phút 78, đoàn quân áo xanh dương có bàn thắng thứ tư đầy bất ngờ sau pha \"đốt lưới nhà\" rất khó từ chân của trung vệ Arturo Mina. Thời gian còn lại, Suarez suýt chút nữa hoàn tất cú đúp nếu dứt điểm chính xác hơn.</p>\r\n<p>Dẫu vậy, đại thắng 4 bàn không gỡ trước Ecuador đã giúp Uruguay tạm chiếm ngôi đầu bảng C Copa America năm nay trước khi cặp đấu còn lại ở bảng này diễn ra giữa đội bóng khách mời Nhật Bản và ĐKVĐ Chile diễn ra lúc 6h00 sáng ngày 18/6 (giờ Việt Nam).</p>',29,0,0,0,'',0,'2019-06-17','/uploads/1560746447596d.jpg',NULL);
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
INSERT INTO `postsandtags` VALUES (1,1),(2,1),(1,2),(2,2),(3,2),(1,3),(3,4),(5,5);
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
INSERT INTO `subscribers` VALUES (28,'2019-06-15','2019-07-06'),(31,'2019-06-15','2019-06-22');
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
  PRIMARY KEY (`tagID`),
  UNIQUE KEY `tagName_UNIQUE` (`tagName`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (5,'Copa America 2019'),(2,'danhnhau'),(1,'nghia'),(4,'nghiencuu'),(3,'sinhvien');
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (28,'Trịnh Quang Nghĩa','nghiatq','$2b$10$wUox//pLnqWL7PQO1atW1uvLwduJH1cypQBmmq66Ss.4dKDNyY63u',4,'tonystrinh@gmail.com','1998-07-08 00:00:00',1),(29,'Trần Bá Ngọc','ngoctb','$2b$10$Zzo7H2QzG97OXsSGekKMQ.tBIqzEITh4Oyyk0vFtLpQcYcoChbFuC',2,'tranbangoc@gmail.com','1998-07-08 00:00:00',1),(30,'Nguyễn Xuân Nghiêm','nghiemnx','$2b$10$aNRw.FMpREjf0KVFBYIxkOmKvYCBQ8SpnpVV8uGDv1Mb6iY7UCKnm',4,'nguyenxuannghiem@gmail.com','1998-08-08 00:00:00',1),(31,'Đặng Hoài Nam','namdh3','$2b$10$6C4pjmHWLMXBRN5K.jHtbeUHO9nkJFVuBA8HeD8bArMWolggU8UIa',4,'danghoainam@gmail.com','2019-06-25 00:00:00',1),(32,'Trịnh Nghĩa','nghiatrinh','$2b$10$gU8oq.djdmh8zb1axMCvXOb6ax83OgikB5ULDuY3X9AvCagkwzbai',3,'tonystrinh@gmail.com','2019-06-13 00:00:00',1),(34,'Trịnh Nghĩa','nghiatq2','$2b$10$SJrB23eKFtGdRHL.L69TD.33IgGWQVLVTMwiisAX8FDf9SMPME92G',2,'tonystrinh@gmail.com','2019-06-20 00:00:00',1),(35,'Nguyễn Xuân Nghiêm','admin','$2b$10$pgD4DMMGOFgD7wJHAEn9hOOgLa1s3B9RGs.yaKxOfnv48WAAURfei',1,'admin@gmail.com','1998-10-21 00:00:00',1);
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
INSERT INTO `writers` VALUES (34,'Nghĩa đẹp trai'),(29,'Ngọc đỉnh kout'),(35,'ssss');
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

-- Dump completed on 2019-06-18 22:07:17
