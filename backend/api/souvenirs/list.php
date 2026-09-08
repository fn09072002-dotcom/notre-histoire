<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");

require_once __DIR__ . "/../../config/database.php";

try {

    $sql = "
        SELECT
            id,
            titre,
            date_souvenir,
            lieu,
            description,
            musique_chemin,
            musique_nom,
            favori,
            created_at
        FROM souvenirs
        ORDER BY date_souvenir DESC
    ";

    $stmt = $pdo->query($sql);

    $souvenirs = $stmt->fetchAll();

    if (count($souvenirs) > 0) {

        $ids = array_column($souvenirs, "id");

        $placeholders = implode(
            ",",
            array_fill(0, count($ids), "?")
        );

        // Photos de chaque souvenir
        $sqlPhotos = "
            SELECT id, souvenir_id, chemin, nom_fichier
            FROM photos
            WHERE souvenir_id IN ($placeholders)
            ORDER BY id ASC
        ";

        $stmtPhotos = $pdo->prepare($sqlPhotos);
        $stmtPhotos->execute($ids);

        $photosParSouvenir = [];

        foreach ($stmtPhotos->fetchAll() as $photo) {
            $photosParSouvenir[$photo["souvenir_id"]][] = $photo;
        }

        // Vidéos de chaque souvenir
        $sqlVideos = "
            SELECT id, souvenir_id, chemin, nom_fichier
            FROM videos
            WHERE souvenir_id IN ($placeholders)
            ORDER BY id ASC
        ";

        $stmtVideos = $pdo->prepare($sqlVideos);
        $stmtVideos->execute($ids);

        $videosParSouvenir = [];

        foreach ($stmtVideos->fetchAll() as $video) {
            $videosParSouvenir[$video["souvenir_id"]][] = $video;
        }

        foreach ($souvenirs as &$souvenir) {
            $souvenir["photos"] = $photosParSouvenir[$souvenir["id"]] ?? [];
            $souvenir["videos"] = $videosParSouvenir[$souvenir["id"]] ?? [];
        }

        unset($souvenir);
    }

    echo json_encode([
        "success" => true,
        "souvenirs" => $souvenirs
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des souvenirs."
    ]);
}
