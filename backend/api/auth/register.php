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

$input = json_decode(file_get_contents("php://input"), true);

$nom = trim($input["nom"] ?? "");
$email = trim($input["email"] ?? "");
$password = $input["password"] ?? "";

if ($nom === "" || $email === "" || $password === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Tous les champs sont obligatoires."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Email invalide."
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Le mot de passe doit contenir au moins 6 caractères."
    ]);
    exit;
}

try {

    // Vérifier si l'utilisateur existe déjà
    $stmt = $pdo->prepare(
        "SELECT id FROM users WHERE email = :email"
    );

    $stmt->execute([
        "email" => $email
    ]);

    if ($stmt->fetch()) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "message" => "Cet email est déjà utilisé."
        ]);
        exit;
    }

    // Chiffrer le mot de passe
    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // Créer l'utilisateur
    $stmt = $pdo->prepare("
        INSERT INTO users (nom, email, password)
        VALUES (:nom, :email, :password)
    ");

    $stmt->execute([
        "nom" => $nom,
        "email" => $email,
        "password" => $passwordHash
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Compte créé avec succès.",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la création du compte."
    ]);
}
