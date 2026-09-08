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
$date = $input["date"] ?? "";
$lieu = trim($input["lieu"] ?? "");
$description = trim($input["description"] ?? "");
$favori = !empty($input["favori"]) ? 1 : 0;

if ($titre === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Le titre est obligatoire."
    ]);

    exit;
}

if ($date === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "La date est obligatoire."
    ]);

    exit;
}

try {

    $sql = "
        INSERT INTO souvenirs
        (
            titre,
            date_souvenir,
            lieu,
            description,
            favori
        )
        VALUES
        (
            :titre,
            :date_souvenir,
            :lieu,
            :description,
            :favori
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "titre" => $titre,
        "date_souvenir" => $date,
        "lieu" => $lieu !== "" ? $lieu : null,
        "description" => $description !== "" ? $description : null,
        "favori" => $favori
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Souvenir enregistré avec succès.",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'enregistrement du souvenir."
    ]);
}
