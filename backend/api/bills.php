<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$limit = $_GET['limit'] ?? 20;
$congress = $_GET['congress'] ?? 20;
$type = $_GET['type'] ?? 'SB';
$offset = $_GET['offset'] ?? 0;

$url = "https://open-congress-api.bettergov.ph/api/documents";
$params = [
    "limit" => $limit,
    "congress" => $congress,
    "type" => $type,
    "offset" => $offset
];

$fullUrl = $url . "?" . http_build_query($params);
$response = file_get_contents($fullUrl);

echo $response;
