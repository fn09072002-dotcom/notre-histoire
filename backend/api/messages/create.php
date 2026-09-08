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

$auteur = trim($input["auteur"] ?? "");
$contenu = trim($input["contenu"] ?? "");

if ($auteur === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Merci de préciser qui écrit le message."
    ]);

    exit;
}

if ($contenu === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Le message ne peut pas être vide."
    ]);

    exit;
}

try {

    $sql = "
        INSERT INTO messages
        (
            auteur,
            contenu
        )
        VALUES
        (
            :auteur,
            :contenu
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "auteur" => $auteur,
        "contenu" => $contenu
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Message envoyé avec succès.",
        "id" => $pdo->lastInsertId()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'envoi du message."
    ]);
}
