DROP DATABASE IF EXISTS stockswatch;
CREATE DATABASE stockswatch;
USE stockswatch;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	user_id INT(4) NOT NULL AUTO_INCREMENT,
	username VARCHAR(50),
	firstname VARCHAR(100),
	lastname VARCHAR(100),
	password VARCHAR(200),
	PRIMARY KEY(user_id)
);

DROP TABLE IF EXISTS user_stocks;
CREATE TABLE user_stocks (
	user_stocks_id INT(4) NOT NULL AUTO_INCREMENT,
	symbol VARCHAR(5),
	user_id INT(4) NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	PRIMARY KEY(user_stocks_id)
);

insert into users (username, firstname, lastname, password) values (
	"xinnyliuu", "Xin", "Liu", SHA2("password", 256) 
);