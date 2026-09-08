-- Schéma de la base de données "notre_histoire"
--
-- Comment l'utiliser :
--   1. Démarrer MySQL : docker compose up -d
--   2. Importer ce fichier :
--      docker exec -i notre-histoire-mysql mysql -uroot -proot notre_histoire < backend/database/schema.sql

CREATE TABLE IF NOT EXISTS souvenirs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    date_souvenir DATE NOT NULL,
    lieu VARCHAR(150) NULL,
    description TEXT NULL,
    musique_chemin VARCHAR(255) NULL,
    musique_nom VARCHAR(255) NULL,
    favori TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    souvenir_id INT NOT NULL,
    chemin VARCHAR(255) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_photos_souvenir
        FOREIGN KEY (souvenir_id) REFERENCES souvenirs (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    souvenir_id INT NOT NULL,
    chemin VARCHAR(255) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_videos_souvenir
        FOREIGN KEY (souvenir_id) REFERENCES souvenirs (id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auteur VARCHAR(50) NOT NULL,
    contenu TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projets_futurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'autre',
    realise TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
