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
    asset_typeId INT NOT NULL DEFAULT 7,
    PRIMARY KEY (accountId),
    UNIQUE INDEX idx_accountText (accountText)
);

INSERT INTO
    account (account_groupId, accountText, asset_typeId)
VALUES
  (1, 'ESB - Power Generation', 6),
  (1, 'ESB - Networks', 6),
  (1, 'ESB - 38kV', 6);


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

-- Assets

-- These are referred to as subTypes in the frontend.
CREATE TABLE IF NOT EXISTS asset_type (
  asset_typeId INT UNIQUE NOT NULL,
  asset_typeText VARCHAR(32) UNIQUE NOT NULL,
  asset_typeCode VARCHAR(2) UNIQUE NOT NULL,
  asset_typeIcon VARCHAR(32) NOT NULL,
  PRIMARY KEY (asset_typeId)
);

INSERT INTO
  asset_type (asset_typeId, asset_typeText, asset_typeCode, asset_typeIcon)
VALUES
  (1,  'On-highway motor vehicle', 'RT', 'mdi-truck-cargo-container'),
  (2,  'Aircraft - fixed wing', 'AP', 'mdi-airplane'),
  (3,  'Car', 'RC', 'mdi-car'),
  (4,  'Bus', 'RB', 'mdi-bus'),
  (5,  'Off-highway vehicle', 'OV', 'mdi-excavator'),
  (6,  'Electrical', 'EL', 'mdi-lightning-bolt'),
  (7, 'Industrial', 'IN', 'mdi-robot-industrial'),
  (8, 'Rail', 'LT', 'mdi-train'),
  (9, 'Marine', 'MV', 'mdi-ferry'),
  (10,  'Aircraft - rotary wing', 'AH', 'mdi-helicopter');

CREATE TABLE IF NOT EXISTS asset (
  assetId INT UNIQUE NOT NULL AUTO_INCREMENT,
  parentId INT NOT NULL,
  assetText VARCHAR(32) NOT NULL,
  asset_typeId INT NOT NULL,
  assetActive TINYINT NOT NULL DEFAULT 1,
);


