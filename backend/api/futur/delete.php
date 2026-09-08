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

$id = (int) ($input["id"] ?? 0);

if ($id <= 0) {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Identifiant de projet invalide."
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare("DELETE FROM projets_futurs WHERE id = :id");
    $stmt->execute(["id" => $id]);

    echo json_encode([
        "success" => true,
        "message" => "Projet supprimé."
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la suppression du projet."
    ]);
}
