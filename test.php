<?php
$post_data = [
  'destination' => 'Paris',
  'start_date' => '2025-04-10',
  'end_date' => '2025-04-15',
  'gender' => 'male',
  'wear_type' => 'casual',
  'traveler_type' => 'solo',
  'activities' => ['hiking']
];

$ch = curl_init('http://localhost/ai-guide-assistant/php/generate-list.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>