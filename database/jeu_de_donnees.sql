-- ─── Jeu de données d'exemple — Bloom ───────────────────────────────────────
-- À importer manuellement après le démarrage de la base :
--   docker exec -i bloom-db-1 mysql -ubloom -pbloompassword bloom < database/jeu_de_donnees.sql

USE bloom;

INSERT INTO goals (id, title, icon, color) VALUES
  (1, '10 min d''anglais',  '📚', '#4caf50'),
  (2, 'Respiration 3 min',  '🌱', '#2196f3'),
  (3, 'Marcher 30 min',     '🏃', '#ff9800'),
  (4, 'Lire 20 pages',      '📖', '#9c27b0'),
  (5, 'Boire 1,5L d''eau',  '💧', '#00bcd4');

-- Coches des 8 derniers jours (simule des séries)
INSERT IGNORE INTO daily_checks (goal_id, checked_on) VALUES
  -- Objectif 1 : 8 jours consécutifs (streak 8)
  (1, CURDATE()), (1, CURDATE() - INTERVAL 1 DAY), (1, CURDATE() - INTERVAL 2 DAY),
  (1, CURDATE() - INTERVAL 3 DAY), (1, CURDATE() - INTERVAL 4 DAY),
  (1, CURDATE() - INTERVAL 5 DAY), (1, CURDATE() - INTERVAL 6 DAY),
  (1, CURDATE() - INTERVAL 7 DAY),
  -- Objectif 2 : 3 jours consécutifs (streak 3)
  (2, CURDATE()), (2, CURDATE() - INTERVAL 1 DAY), (2, CURDATE() - INTERVAL 2 DAY),
  -- Objectif 3 : coché aujourd'hui seulement (streak 1)
  (3, CURDATE()),
  -- Objectif 4 : 7 jours (streak 7)
  (4, CURDATE()), (4, CURDATE() - INTERVAL 1 DAY), (4, CURDATE() - INTERVAL 2 DAY),
  (4, CURDATE() - INTERVAL 3 DAY), (4, CURDATE() - INTERVAL 4 DAY),
  (4, CURDATE() - INTERVAL 5 DAY), (4, CURDATE() - INTERVAL 6 DAY);
  -- Objectif 5 : aucune coche (streak 0)

-- Badges débloqués
INSERT IGNORE INTO badges (goal_id, badge_key) VALUES
  (1, 'streak_7'),
  (4, 'streak_7');
