<?php

session_set_cookie_params([
    "httponly" => true,
    "secure" => false, // passera à true en HTTPS lors du déploiement
    "samesite" => "Lax"
]);

session_start();

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
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

$email = trim($input["email"] ?? "");
$password = $input["password"] ?? "";

if ($email === "" || $password === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Email et mot de passe obligatoires."
    ]);
    exit;
}

try {

    $stmt = $pdo->prepare("
        SELECT id, nom, email, password
        FROM users
        WHERE email = :email
    ");

    $stmt->execute([
        "email" => $email
    ]);

    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Email ou mot de passe incorrect."
        ]);

        exit;
    }

    // Régénérer l'identifiant de session après connexion
    session_regenerate_id(true);

    // Stocker uniquement les informations nécessaires
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["user_nom"] = $user["nom"];
    $_SESSION["user_email"] = $user["email"];

    unset($user["password"]);

    echo json_encode([
        "success" => true,
        "message" => "Connexion réussie.",
        "user" => $user
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la connexion."
    ]);
}