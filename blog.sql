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

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `admin_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `admin_username` varchar(12) DEFAULT NULL,
  `admin_password` varchar(40) DEFAULT NULL,
  `admin_status` tinyint(4) DEFAULT NULL,
  `admin_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `admin` */

insert  into `admin`(`admin_id`,`admin_username`,`admin_password`,`admin_status`,`admin_time`) values (1,'16069110070','aaaaaaaa',0,NULL),(2,'admin123','3dbe00a167653a1aaee01d93e77e730e',0,1564463030),(4,'nachunrui','67c1f2a7bf168ed1d8df318b98ead5f8',0,1564463451),(5,'admin456','25f9e794323b453885f5181f1b624d0b',0,1564463516),(6,'admin789','25f9e794323b453885f5181f1b624d0b',0,1564463683);

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `news_id` int(11) DEFAULT NULL,
  `comment_text` varchar(255) DEFAULT NULL,
  `comment_time` int(11) DEFAULT NULL,
  `comment_status` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `comment` */

insert  into `comment`(`comment_id`,`user_id`,`news_id`,`comment_text`,`comment_time`,`comment_status`) values (1,1,2,'好呀好呀',44561368,1),(2,2,2,'爱剁手[em_4]',1566308087,1),(3,2,2,'',1566308189,2),(4,2,2,'ssss',1566365339,0);

/*Table structure for table `news` */

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `news_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `news_cid` int(11) DEFAULT NULL,
  `news_title` varchar(255) DEFAULT NULL,
  `news_img` varchar(255) DEFAULT NULL,
  `news_time` int(11) DEFAULT NULL,
  `news_num` int(11) DEFAULT NULL,
  `news_info` varchar(255) DEFAULT NULL,
  `news_author` varchar(100) DEFAULT NULL,
  `news_text` text,
  `news_keywords` varchar(255) DEFAULT NULL,
  `news_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`news_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `news` */

insert  into `news`(`news_id`,`news_cid`,`news_title`,`news_img`,`news_time`,`news_num`,`news_info`,`news_author`,`news_text`,`news_keywords`,`news_description`) values (2,1,'HTML技巧','/uploads/news/15661829493994946.jpg',1566182949,0,'HTML技巧HTML技巧HTML技巧HTML技巧','那纯瑞','<p>贼厉害呢</p><p><img src=\"/images/uEditor/1163281707630202880.jpg\"/></p><p><img src=\"/images/uEditor/1163281707676340224.jpg\"/></p><p><br/></p>','HTML技巧HTML技巧','HTML技巧HTML技巧HTML技巧');

/*Table structure for table `slider` */

DROP TABLE IF EXISTS `slider`;

CREATE TABLE `slider` (
  `slider_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slider_name` varchar(100) DEFAULT NULL,
  `slider_url` varchar(100) DEFAULT NULL,
  `slider_sort` tinyint(4) DEFAULT NULL,
  `slider_img` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`slider_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

/*Data for the table `slider` */

insert  into `slider`(`slider_id`,`slider_name`,`slider_url`,`slider_sort`,`slider_img`) values (19,'首页001','http://www.baidu.com',99,'/uploads/slider/15661824907734864.jpg'),(17,'首页002','http://www.baidu.com',100,'/uploads/slider/15661824525018481.jpg'),(18,'首页003','http://www.baidu.com',98,'/uploads/slider/15661824745987850.jpg'),(20,'首页004','http://www.baidu.com',101,'/uploads/slider/15661825077647936.jpg');

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

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_username` varchar(12) DEFAULT NULL,
  `user_password` varchar(40) DEFAULT NULL,
  `user_status` tinyint(4) DEFAULT NULL,
  `user_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_username` (`user_username`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`user_id`,`user_username`,`user_password`,`user_status`,`user_time`) values (1,'nachunrui','67c1f2a7bf168ed1d8df318b98ead5f8',0,1564539785),(2,'16069110070','3dbe00a167653a1aaee01d93e77e730e',0,1564548763),(3,'160691100701','3dbe00a167653a1aaee01d93e77e730e',0,1564548770),(4,'160691100702','3dbe00a167653a1aaee01d93e77e730e',0,1564548776),(7,'username','5f4dcc3b5aa765d61d8327deb882cf99',0,1566364542),(8,'username1','5f4dcc3b5aa765d61d8327deb882cf99',0,1566364652),(9,'username2','5f4dcc3b5aa765d61d8327deb882cf99',0,1566364717),(10,'rujiexia','894758a0323167cbd6c06771ce1d91ce',0,1566368030);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
