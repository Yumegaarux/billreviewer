<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$url = "https://open-congress-api.bettergov.ph/api/documents?limit=20&congress=20&type=SB";

$response = file_get_contents($url);

echo $response;
