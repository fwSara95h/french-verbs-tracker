-- Create the database
CREATE DATABASE IF NOT EXISTS francais_db;
USE francais_db;

-- Create the 'verbs' table
CREATE TABLE IF NOT EXISTS verbs (
    infinitif VARCHAR(255) NOT NULL UNIQUE,
    meaning VARCHAR(255),
    conjugated BOOLEAN DEFAULT FALSE,
    conjugation_link VARCHAR(2048),
    PRIMARY KEY (infinitif)
);
