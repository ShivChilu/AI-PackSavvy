<?php
header('Content-Type: application/json');

$input = $_POST;
$destination = $input['destination'] ?? 'Unknown';
$gender = $input['gender'] ?? 'other';
$wear_type = $input['wear_type'] ?? 'casual';
$traveler_type = $input['traveler_type'] ?? 'solo';
$activities = $input['activities'] ?? [];
$start_date = $input['start_date'] ?? date('Y-m-d');
$end_date = $input['end_date'] ?? date('Y-m-d');
$duration = (strtotime($end_date) - strtotime($start_date)) / (60 * 60 * 24);
$adults = isset($input['adults']) ? (int)$input['adults'] : 1;
$kids = isset($input['kids']) ? (int)$input['kids'] : 0;

// Fetch weather data from load-weather.php
$weather_post = http_build_query(['destination' => $destination, 'start_date' => $start_date, 'end_date' => $end_date]);
$weather_response = file_get_contents('http://localhost/ai-guide-assistant/php/load-weather.php', false, stream_context_create([
  'http' => ['method' => 'POST', 'header' => 'Content-Type: application/x-www-form-urlencoded', 'content' => $weather_post]
]));
$weather = json_decode($weather_response, true);
$weather_summary = $weather['summary'] ?? ['temp' => 20, 'condition' => 'sunny'];
$weather_forecast = $weather['forecast'] ?? [];

// Base packing list
$packing_list = [
  'clothes' => [],
  'toiletries' => ['toothbrush', 'toothpaste', 'shampoo'],
  'electronics' => ['phone charger'],
  'documents' => ['passport', 'tickets'],
  'health' => ['first aid kit'],
  'kids' => [],
];

// Primary traveler
if ($gender === 'female') {
  $packing_list['clothes'] = array_merge($packing_list['clothes'], [$wear_type === 'traditional' ? 'kurti' : 'dress', 'scarf']);
} else if ($gender === 'male') {
  $packing_list['clothes'] = array_merge($packing_list['clothes'], [$wear_type === 'casual' ? 't-shirt' : 'shirt', 'shorts']);
}
$packing_list['clothes'][] = sprintf("%d pair%s of socks", min($duration, 7), $duration > 1 ? 's' : '');

// Family logic
if ($traveler_type === 'family') {
  for ($i = 1; $i < $adults; $i++) {
    $packing_list['clothes'][] = 'extra shirt';
  }
  for ($i = 0; $i < $kids; $i++) {
    $kid_age = $input["kid_age_$i"] ?? 5;
    $kid_gender = $input["kid_gender_$i"] ?? 'male';
    if ($kid_age <= 3) {
      $packing_list['kids'][] = 'diapers';
      $packing_list['kids'][] = 'baby bottle';
    } else if ($kid_age <= 12) {
      $packing_list['kids'][] = $kid_gender === 'female' ? 'dress' : 't-shirt';
      $packing_list['kids'][] = 'toy';
    } else {
      $packing_list['kids'][] = 'headphones';
    }
  }
}

// Weather-based items
if ($weather_summary['condition'] === 'rainy') {
  $packing_list['clothes'][] = 'raincoat';
  $packing_list['toiletries'][] = 'umbrella';
} else if ($weather_summary['temp'] < 15) {
  $packing_list['clothes'][] = 'jacket';
  $packing_list['clothes'][] = 'thermal wear';
} else if ($weather_summary['temp'] > 25) {
  $packing_list['clothes'][] = 'sunglasses';
  $packing_list['toiletries'][] = 'sunscreen';
}

// Activity-based items
foreach ($activities as $activity) {
  switch ($activity) {
    case 'swimming':
      $packing_list['clothes'][] = 'swimsuit';
      $packing_list['toiletries'][] = 'towel';
      break;
    case 'hiking':
      $packing_list['clothes'][] = 'trekking shoes';
      $packing_list['health'][] = 'bandages';
      break;
    case 'beach':
      $packing_list['clothes'][] = 'flip-flops';
      $packing_list['toiletries'][] = 'sunscreen';
      break;
    case 'business':
      $packing_list['electronics'][] = 'laptop';
      $packing_list['documents'][] = 'business cards';
      break;
  }
}

// Bag suggestion
$bag = $duration > 7 ? 'large suitcase' : 'backpack';
if ($traveler_type === 'family') {
  $bag = $kids > 0 ? '2 suitcases + kids bag' : '2 suitcases';
} else if ($traveler_type === 'couple') {
  $bag = '1 suitcase + backpack';
}

// Tips
$tips = [];
if ($weather_summary['condition'] === 'rainy') $tips[] = 'Pack a raincoat – expect rain!';
if ($duration > 7) $tips[] = 'Consider laundry options for longer trips.';
if ($weather_summary['temp'] > 30) $tips[] = 'Stay hydrated – it’s hot!';

echo json_encode(['list' => $packing_list, 'bag' => $bag, 'tips' => $tips, 'weather' => $weather_forecast]);
?>