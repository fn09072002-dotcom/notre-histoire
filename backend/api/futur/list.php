<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");

require_once __DIR__ . "/../../config/database.php";

try {

    $sql = "
        SELECT
            id,
            titre,
            description,
            type,
            realise,
            created_at
        FROM projets_futurs
        ORDER BY realise ASC, created_at DESC
    ";

    $stmt = $pdo->query($sql);

    $projets = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "projets" => $projets
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des projets."
    ]);
}
