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

SELECT
  levelId, parentId, levelText
FROM
  level
WHERE
  parentId = 2;

SELECT
    accountId, accountText
FROM
    account
WHERE
    accountId = 'a1';

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









