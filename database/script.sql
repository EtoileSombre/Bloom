-- Base de données Bloom
-- Initialisation du schéma

CREATE DATABASE IF NOT EXISTS bloom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bloom;

-- Table des objectifs
CREATE TABLE IF NOT EXISTS goals (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)  NOT NULL,
  icon        VARCHAR(10)   NOT NULL DEFAULT '🎯',
  color       VARCHAR(20)   NOT NULL DEFAULT '#4caf50',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table des coches journalières
CREATE TABLE IF NOT EXISTS daily_checks (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  goal_id     INT UNSIGNED  NOT NULL,
  checked_on  DATE          NOT NULL,
  UNIQUE KEY  uq_goal_day (goal_id, checked_on),
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- Table des badges débloqués
CREATE TABLE IF NOT EXISTS badges (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  goal_id     INT UNSIGNED  NOT NULL,
  badge_key   VARCHAR(50)   NOT NULL,
  unlocked_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY  uq_goal_badge (goal_id, badge_key),
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);


