<?php
header('Content-Type: application/json');

$destination = $_POST['destination'] ?? 'London'; // Default to London if empty
$start_date = $_POST['start_date'] ?? date('Y-m-d');
$end_date = $_POST['end_date'] ?? date('Y-m-d');
$api_key = 'd5268fa67307a419c001e8d9ef273bf6'; // Replace with your OpenWeather API key

// Get coordinates for the destination using OpenWeather Geocoding API
$geo_url = "http://api.openweathermap.org/geo/1.0/direct?q=" . urlencode($destination) . "&limit=1&appid=$api_key";
$geo_response = file_get_contents($geo_url);
$geo_data = json_decode($geo_response, true);

if (empty($geo_data)) {
  echo json_encode(['error' => 'Could not find destination']);
  exit;
}

$lat = $geo_data[0]['lat'];
$lon = $geo_data[0]['lon'];

// Fetch weather forecast
$weather_url = "http://api.openweathermap.org/data/2.5/forecast?lat=$lat&lon=$lon&appid=$api_key&units=metric";
$weather_response = file_get_contents($weather_url);
$weather_data = json_decode($weather_response, true);

if (empty($weather_data['list'])) {
  echo json_encode(['error' => 'Weather data unavailable']);
  exit;
}

// Filter weather data for the trip duration
$weather_forecast = [];
$start_timestamp = strtotime($start_date);
$end_timestamp = strtotime($end_date);

foreach ($weather_data['list'] as $forecast) {
  $forecast_time = strtotime($forecast['dt_txt']);
  if ($forecast_time >= $start_timestamp && $forecast_time <= $end_timestamp) {
    $weather_forecast[] = [
      'date' => $forecast['dt_txt'],
      'temp' => $forecast['main']['temp'],
      'condition' => $forecast['weather'][0]['main'],
    ];
  }
}

// Summarize weather (average temp and most common condition)
$temps = array_column($weather_forecast, 'temp');
$conditions = array_column($weather_forecast, 'condition');
$avg_temp = count($temps) > 0 ? array_sum($temps) / count($temps) : 20;
$most_common_condition = array_reduce(array_count_values($conditions), function($carry, $item) {
  return $item > ($carry['count'] ?? 0) ? ['condition' => $item, 'count' => $item] : $carry;
}, ['condition' => 'Sunny', 'count' => 0])['condition'];

echo json_encode([
  'forecast' => $weather_forecast,
  'summary' => ['temp' => round($avg_temp), 'condition' => strtolower($most_common_condition)]
]);
?>