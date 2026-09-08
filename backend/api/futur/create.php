<?php

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Méthode non autorisée."
    ]);

    exit;
}

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$titre = trim($input["titre"] ?? "");
$description = trim($input["description"] ?? "");
$type = trim($input["type"] ?? "autre");

$typesAutorises = ["voyage", "objectif", "reve", "autre"];

if (!in_array($type, $typesAutorises, true)) {
    $type = "autre";
}

if ($titre === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Le titre est obligatoire."
    ]);

    exit;
}

try {

    $sql = "
        INSERT INTO projets_futurs
        (
            titre,
            description,
            type
        )
        VALUES
        (
            :titre,
            :description,
            :type
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "titre" => $titre,
        "description" => $description !== "" ? $description : null,
        "type" => $type
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Projet ajouté avec succès.",
        "id" => $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'enregistrement du projet."
    ]);
}
