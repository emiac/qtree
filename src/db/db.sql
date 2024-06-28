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


