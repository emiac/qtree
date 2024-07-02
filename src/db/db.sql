CREATE DATABASE IF NOT EXISTS qtree;

USE qtree;

-- Note: If a level is top-level node (i.e. its parent is an account),
-- the parent account should be the accountId.

CREATE TABLE IF NOT EXISTS level (
  levelId VARCHAR(6) UNIQUE NOT NULL,
  parentId VARCHAR(6) NOT NULL,
  levelText VARCHAR(50) NOT NULL,
  PRIMARY KEY (levelId),
  INDEX idx_parent_id (parentId),
  CONSTRAINT UNIQUE constraint_level_name (levelId, levelText)
);

SHOW INDEXES FROM level;
DROP INDEX idx_parent_id ON level;

ALTER TABLE level
  DROP CONSTRAINT constraint_level_name;

ALTER TABLE level
  RENAME COLUMN levelName TO levelText;

ALTER TABLE level
  MODIFY COLUMN levelId VARCHAR(6) UNIQUE NOT NULL;
ALTER TABLE level
  MODIFY COLUMN parentlId VARCHAR(6) UNIQUE NOT NULL;

ALTER TABLE level
  DROP COLUMN levelTop;

INSERT INTO
  level (levelId, parentId,  levelText)
VALUES
  ('l1', 'a1', 'Carlow'),
  ('l2', 'a1', 'Tullow'),
  ('l3', 'l1', 'Carlow North'),
  ('l4', 'l1', 'Carlow South'),
  ('l5', 'l2', 'Tullow East'),
  ('l6', 'l2', 'Tullow West'),
  ('l7', 'l6', 'Tullow West Up'),
  ('l8', 'l6', 'Tullow West Down');


SELECT
  levelId, parentId, levelText
FROM
  level
WHERE
  parentId = 2;

CREATE TABLE account (
    accountId VARCHAR(6) UNIQUE NOT NULL,
    accountText VARCHAR(32) UNIQUE NOT NULL,
    PRIMARY KEY (accountId),
    UNIQUE INDEX idx_account_text (accountText)
);

INSERT INTO
  account (accountId, accountText)
VALUES
  ('a1', 'ESB - Power Generation'),
  ('a2', 'ESB - Networks'),
  ('a3', 'ESB - 38kV');

SELECT
    accountId, accountText
FROM
    account
WHERE
    accountId = 'a1';


CREATE TABLE IF NOT EXISTS site (
    siteId INT UNIQUE NOT NULL AUTO_INCREMENT,
    siteNum INT UNIQUE NOT NULL,
    parentKey VARCHAR(8) NOT NULL,
    siteText VARCHAR(32) NOT NULL, 
    PRIMARY KEY (siteId),
    CONSTRAINT UNIQUE  con_unique_parent_site (parentKey, siteText),
    INDEX idx_parent (parentKey)
);

INSERT INTO site (siteNum, parentKey, siteText) VALUES (1, 'a1', 'Carlow North');

SELECT 
    CONCAT('s', siteNum) AS custom_key, 
    siteText
FROM 
    site;


-- import mysql.connector

-- # Establish the connection
-- conn = mysql.connector.connect(
--     host="localhost",
--     user="yourusername",
--     password="yourpassword",
--     database="yourdatabase"
-- )

-- cursor = conn.cursor()

-- # Get the next auto increment value
-- cursor.execute("SHOW TABLE STATUS LIKE 'my_table'")
-- row = cursor.fetchone()
-- next_id = row[10]

-- # Construct the custom key
-- custom_key = f"a{next_id}"

-- # Insert the new row
-- insert_query = "INSERT INTO my_table (custom_key, other_column) VALUES (%s, %s)"
-- cursor.execute(insert_query, (custom_key, 'some value'))

-- # Commit the transaction
-- conn.commit()

-- # Close the connection
-- cursor.close()
-- conn.close()


SELECT Name FROM SHOW TABLE STATUS LIKE 'site';
SELECT * FROM SHOW TABLE STATUS LIKE 'site';





