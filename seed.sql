CREATE DATABASE  IF NOT EXISTS `employee_tracker`;
USE `employee_tracker`;

DROP TABLE IF EXISTS `department`;

CREATE TABLE `department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
); 

INSERT INTO `department` VALUES (2,'Accounting'),(3,'Sales'),(4,'Corporate'),(6,'Fiction');

DROP TABLE IF EXISTS `employee`;

CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `role_id` int NOT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `employee` VALUES (1,'Sam','Smith',1,4),(2,'Danielle','Foster',2,3),(3,'Oprah','Winfrey',2,6),(4,'Josiah','Washington',1,2),(6,'Theodore','Rustybelt',2,3),(8,'John','Smith',1,3),(11,'Jose','Cuervo',1,NULL),(12,'Ginny','Potter',1,NULL);

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT NULL,
  `salary` decimal(7,2) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `role` VALUES (1,'Sales Associate',60000.00,2),(2,'Manager',70000.00,3),(4,'Cat Wrangler',1000.00,2);