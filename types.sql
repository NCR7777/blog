/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.14 : Database - blog
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`blog` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `blog`;

/*Table structure for table `types` */

DROP TABLE IF EXISTS `types`;

CREATE TABLE `types` (
  `types_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `types_name` varchar(255) DEFAULT NULL,
  `types_keywords` varchar(255) DEFAULT NULL,
  `types_description` varchar(255) DEFAULT NULL,
  `types_sort` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`types_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `types` */

insert  into `types`(`types_id`,`types_name`,`types_keywords`,`types_description`,`types_sort`) values (1,'前端开发','前端开发，H5开发','前端开发，html，css，js等',100),(2,'后端开发','后端开发，后台开发','后端开发，nodejs，java，php等',99),(3,'服务器运维','服务器运行与维护','Linux:CentOS、Ubuntu、Debian等,Windows:Windows Server等',98),(4,'大数据','数据挖掘，数据分析，数据处理','python,R,SPSS,Excel等',97),(5,'人工智能','机器学习，算法，AI','python,AI等',96);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
