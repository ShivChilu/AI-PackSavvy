# AI PackSavvy
**Your Smart AI-Powered Packing Assistant**

AI PackSavvy is a futuristic web application designed to generate personalized packing lists for travelers based on destination, weather, trip duration, activities, and preferences. Built with HTML, Tailwind CSS, JavaScript, and PHP, it offers a seamless and visually appealing experience.

## Features
- ✈️ **Multi-Step Trip Form:** Input personal info, trip details, preferences, and activities.
- 🌦️ **Weather Integration:** Real-time weather forecast using OpenWeather API.
- 🧳 **Smart Packing List:** Customized suggestions based on gender, wear type, and family.
- 💾 **Save List:** Store packing lists as JSON files.
- 📄 **Export PDF:** Download your list with a single click.
- 🔄 **Responsive UI:** Works on all devices with a dark, modern theme.

## Tech Stack
- **Frontend:** HTML, Tailwind CSS (via CDN), JavaScript
- **Backend:** PHP (no database, file-based storage)
- **APIs:** OpenWeather API for weather data
- **Libraries:** html2pdf.js for PDF export

## Setup Instructions
1. **Install XAMPP:** Download and start Apache from [apachefriends.org](https://www.apachefriends.org/).
2. **Clone Project:** Place the `AI_PackSavvy` folder in `htdocs/`.
3. **Get API Key:** Sign up at [OpenWeatherMap](https://openweathermap.org/) and update `load-weather.php` with your key.
4. **Run:** Open `http://localhost/AI_PackSavvy/index.html` in your browser.

## Directory Structure