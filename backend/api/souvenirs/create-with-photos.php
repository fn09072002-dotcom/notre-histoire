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


/*
|--------------------------------------------------------------------------
| Récupération des données
|--------------------------------------------------------------------------
*/

$titre = trim($_POST["titre"] ?? "");
$date = $_POST["date"] ?? "";
$lieu = trim($_POST["lieu"] ?? "");
$description = trim($_POST["description"] ?? "");
$favori = !empty($_POST["favori"]) ? 1 : 0;


/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

if ($titre === "" || $date === "") {
    http_response_code(422);

    echo json_encode([
        "success" => false,
        "message" => "Le titre et la date sont obligatoires."
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| Dossiers de stockage
|--------------------------------------------------------------------------
*/

$dossierPhotos = __DIR__ . "/../../uploads/photos/";
$dossierVideos = __DIR__ . "/../../uploads/videos/";
$dossierMusique = __DIR__ . "/../../uploads/musique/";

foreach ([$dossierPhotos, $dossierVideos, $dossierMusique] as $dossier) {
    if (!is_dir($dossier)) {
        mkdir($dossier, 0777, true);
    }
}


/*
|--------------------------------------------------------------------------
| Musique (fichier unique)
|--------------------------------------------------------------------------
*/

$musiqueChemin = null;
$musiqueNom = null;

if (
    isset($_FILES["musique"])
    && $_FILES["musique"]["error"] === UPLOAD_ERR_OK
) {

    $nomOriginalMusique = $_FILES["musique"]["name"];

    $extensionMusique = strtolower(
        pathinfo($nomOriginalMusique, PATHINFO_EXTENSION)
    );

    $extensionsMusiqueAutorisees = ["mp3", "wav", "ogg", "m4a"];

    if (in_array($extensionMusique, $extensionsMusiqueAutorisees, true)) {

        $nomUniqueMusique =
            uniqid("musique_", true) . "." . $extensionMusique;

        if (move_uploaded_file(
            $_FILES["musique"]["tmp_name"],
            $dossierMusique . $nomUniqueMusique
        )) {
            $musiqueChemin = "uploads/musique/" . $nomUniqueMusique;
            $musiqueNom = $nomOriginalMusique;
        }
    }
}


/*
|--------------------------------------------------------------------------
| Enregistrement du souvenir
|--------------------------------------------------------------------------
*/

try {

    $pdo->beginTransaction();

    $sql = "
        INSERT INTO souvenirs
        (
            titre,
            date_souvenir,
            lieu,
            description,
            musique_chemin,
            musique_nom,
            favori
        )
        VALUES
        (
            :titre,
            :date_souvenir,
            :lieu,
            :description,
            :musique_chemin,
            :musique_nom,
            :favori
        )
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        "titre" => $titre,
        "date_souvenir" => $date,
        "lieu" => $lieu !== "" ? $lieu : null,
        "description" => $description !== "" ? $description : null,
        "musique_chemin" => $musiqueChemin,
        "musique_nom" => $musiqueNom,
        "favori" => $favori
    ]);

    $souvenirId = $pdo->lastInsertId();


    /*
    |--------------------------------------------------------------------------
    | Enregistrement des photos
    |--------------------------------------------------------------------------
    */

    if (isset($_FILES["photos"])) {

        $photos = $_FILES["photos"];

        for ($i = 0; $i < count($photos["name"]); $i++) {

            if ($photos["error"][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $nomOriginal = $photos["name"][$i];

            $extension = strtolower(
                pathinfo($nomOriginal, PATHINFO_EXTENSION)
            );

            $extensionsAutorisees = [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "gif"
            ];

            if (!in_array($extension, $extensionsAutorisees, true)) {
                continue;
            }

            $nomUnique =
                uniqid("photo_", true)
                . "."
                . $extension;

            $cheminComplet =
                $dossierPhotos . $nomUnique;

            if (move_uploaded_file(
                $photos["tmp_name"][$i],
                $cheminComplet
            )) {

                $chemin = "uploads/photos/" . $nomUnique;

                $sqlPhoto = "
                    INSERT INTO photos
                    (
                        souvenir_id,
                        chemin,
                        nom_fichier
                    )
                    VALUES
                    (
                        :souvenir_id,
                        :chemin,
                        :nom_fichier
                    )
                ";

                $stmtPhoto = $pdo->prepare($sqlPhoto);

                $stmtPhoto->execute([
                    "souvenir_id" => $souvenirId,
                    "chemin" => $chemin,
                    "nom_fichier" => $nomOriginal
                ]);
            }
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Enregistrement des vidéos
    |--------------------------------------------------------------------------
    */

    if (isset($_FILES["videos"])) {

        $videos = $_FILES["videos"];

        for ($i = 0; $i < count($videos["name"]); $i++) {

            if ($videos["error"][$i] !== UPLOAD_ERR_OK) {
                continue;
            }

            $nomOriginalVideo = $videos["name"][$i];

            $extensionVideo = strtolower(
                pathinfo($nomOriginalVideo, PATHINFO_EXTENSION)
            );

            $extensionsVideoAutorisees = ["mp4", "mov", "webm", "avi"];

            if (!in_array($extensionVideo, $extensionsVideoAutorisees, true)) {
                continue;
            }

            $nomUniqueVideo =
                uniqid("video_", true)
                . "."
                . $extensionVideo;

            $cheminCompletVideo =
                $dossierVideos . $nomUniqueVideo;

            if (move_uploaded_file(
                $videos["tmp_name"][$i],
                $cheminCompletVideo
            )) {

                $cheminVideo = "uploads/videos/" . $nomUniqueVideo;

                $sqlVideo = "
                    INSERT INTO videos
                    (
                        souvenir_id,
                        chemin,
                        nom_fichier
                    )
                    VALUES
                    (
                        :souvenir_id,
                        :chemin,
                        :nom_fichier
                    )
                ";

                $stmtVideo = $pdo->prepare($sqlVideo);

                $stmtVideo->execute([
                    "souvenir_id" => $souvenirId,
                    "chemin" => $cheminVideo,
                    "nom_fichier" => $nomOriginalVideo
                ]);
            }
        }
    }


    $pdo->commit();


    echo json_encode([
        "success" => true,
        "message" => "Souvenir enregistré avec succès.",
        "id" => $souvenirId
    ], JSON_UNESCAPED_UNICODE);


} catch (Exception $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de l'enregistrement."
    ], JSON_UNESCAPED_UNICODE);
}
