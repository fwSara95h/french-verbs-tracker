-- SQL script to create the 'all_verbs' table
USE francais_db;

CREATE TABLE IF NOT EXISTS all_verbs (
    infinitif VARCHAR(255) NOT NULL UNIQUE,
    meaning VARCHAR(255) NOT NULL,
    t_freq INT DEFAULT 0,
    conjugation_link VARCHAR(2048) NOT NULL,
    PRIMARY KEY (infinitif)
);

-- SQL script to create the 'other_links' table
CREATE TABLE IF NOT EXISTS other_links (
    infinitif VARCHAR(255) NOT NULL,
    link_title VARCHAR(255) NOT NULL,
    link_url VARCHAR(2048) NOT NULL,
    PRIMARY KEY (infinitif, link_title),
    FOREIGN KEY (infinitif) REFERENCES all_verbs(infinitif)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
