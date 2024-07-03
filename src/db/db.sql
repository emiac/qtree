CREATE DATABASE IF NOT EXISTS qtree;
USE qtree

CREATE TABLE account_group (
  account_groupId INT UNIQUE NOT NULL AUTO_INCREMENT,
  account_groupText  VARCHAR(32) UNIQUE NOT NULL,
  PRIMARY KEY (account_groupId)
);

INSERT INTO
  account_group (account_groupText)
VALUES
  ('ESB');


CREATE TABLE account (
    accountId INT UNIQUE NOT NULL AUTO_INCREMENT,
    account_groupId INT NOT NULL,
    accountText VARCHAR(32) UNIQUE NOT NULL,
    accountActive TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (accountId),
    UNIQUE INDEX idx_accountText (accountText)
);

INSERT INTO
    account (account_groupId, accountText)
VALUES
    (1, 'ESB - Power Generation'),
    (1, 'ESB - Networks'),
    (1, 'ESB - 38kV');


-- Sites have an extra classification as 'root' (boolean). 
-- Root sites have an account as a parent, non-route sites have a site
-- as a parent. 
-- Assets may be attached to any site.

CREATE TABLE IF NOT EXISTS site (
    siteId INT UNIQUE NOT NULL AUTO_INCREMENT,
    parentId INT NOT NULL,
    siteRoot TINYINT NOT NULL DEFAULT 0,
    siteText VARCHAR(50) NOT NULL,
    siteActive TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (siteId),
    INDEX idx_parent_id (parentId),
    CONSTRAINT UNIQUE constraint_site_name (siteId, siteText)
);

INSERT INTO
  site (parentId, siteRoot, siteText)
VALUES
  (1, 1, 'Carlow'),
  (1, 1, 'Tullow'),
  (1, 0, 'Carlow North'),
  (1, 0, 'Carlow South'),
  (2, 0, 'Tullow East'),
  (2, 0, 'Tullow West'),
  (6, 0, 'Tullow West Up'),
  (6, 0, 'Tullow West Down');




