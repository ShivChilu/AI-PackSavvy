<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
  echo json_encode(['error' => 'Invalid data']);
  exit;
}

// Ensure the directory exists
$dir = '../data/saved_lists/';
if (!is_dir($dir)) mkdir($dir, 0777, true);

// Save with a unique filename
$filename = 'trip_' . time() . '.json';
file_put_contents($dir . $filename, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'filename' => $filename]);
?>