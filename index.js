// Cache DOM Elements
const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const secondHand = document.getElementById("second");
const digitalClock = document.getElementById("digitalClock");
const dateDisplay = document.getElementById("dateDisplay");
const themeToggle = document.getElementById("themeToggle");
const weatherInfo = document.getElementById("weatherInfo");
const themeSelect = document.getElementById("themeSelect");
const alarmMessage = document.getElementById("alarmMessage");
const alarmInput = document.getElementById("alarmTime");
const setAlarmButton = document.getElementById("setAlarm");
const alarmSound = document.getElementById("alarmSound");
const currentTimeDisplay = document.getElementById("currentTime");
const stopwatchTime = document.getElementById("stopwatchTime");
const startStopwatch = document.getElementById("startStopwatch");
const resetStopwatch = document.getElementById("resetStopwatch");

// Function to Update the Analog Clock
function updateAnalogClock() {
    const d = new Date();
    const htime = d.getHours() % 12; // Convert 24-hour format to 12-hour format
    const mtime = d.getMinutes();
    const stime = d.getSeconds();

    const hrotation = 30 * htime + mtime / 2; // 30° per hour + 0.5° per minute
    const mrotation = 6 * mtime;             // 6° per minute
    const srotation = 6 * stime;             // 6° per second

    // Apply rotations to clock hands
    hourHand.style.transform = `rotate(${hrotation}deg)`;
    minuteHand.style.transform = `rotate(${mrotation}deg)`;
    secondHand.style.transform = `rotate(${srotation}deg)`;
}

// Function to Update the Digital Clock
function updateDigitalClock() {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Function to Update the Date Display
function updateDate() {
    const d = new Date();
    const date = d.toDateString(); // Format: "Wed Dec 13 2024"
    dateDisplay.textContent = date;
}

// Function to Toggle Theme (Dark/Light Mode)
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode")
        ? "Switch to Light Mode"
        : "Switch to Dark Mode";
}

// Function to Update Background Based on Time of Day
function updateBackground() {
    const hour = new Date().getHours();
    const body = document.body;

    if (hour >= 6 && hour < 18) {
        body.style.background = 'linear-gradient(to bottom, #87CEEB, #FFFFFF)'; // Day
    } else {
        body.style.background = 'linear-gradient(to bottom, #2C3E50, #EFDECD)'; // Night
    }
}

// Stopwatch Functions
let stopwatchInterval, stopwatchSeconds = 0;

function formatStopwatchTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

startStopwatch.addEventListener('click', () => {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            stopwatchSeconds++;
            stopwatchTime.textContent = formatStopwatchTime(stopwatchSeconds);
        }, 1000);
    } else {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
});

resetStopwatch.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchSeconds = 0;
    stopwatchTime.textContent = '00:00:00';
});

// Alarm Functionality
let alarmTime = null;
let alarmCheckInterval = null;

// Function to set the alarm time
setAlarmButton.addEventListener("click", () => {
    const alarmTimeString = alarmInput.value;  // Get the time input from the user
    const [hour, minute] = alarmTimeString.split(":").map(Number);
    alarmTime = { hour, minute };

    // Notify user that the alarm is set
    alert("Alarm set for " + alarmTimeString);  
});

// Function to check if it's time for the alarm
function checkAlarm() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (alarmTime && currentHour === alarmTime.hour && currentMinute === alarmTime.minute) {
        alarmSound.play();  // Play the alarm sound
        alarmMessage.textContent = "Alarm ringing!";
        alert("Time's up!"); // Show alert to the user
        clearInterval(alarmCheckInterval);  // Stop checking once the alarm is triggered
    }
}

// Start checking the alarm every minute
alarmCheckInterval = setInterval(checkAlarm, 60000);

// Weather Fetch and Display
fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=your_api_key')
    .then(response => response.json())
    .then(data => {
        const temperature = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
        weatherInfo.textContent = `London: ${temperature}°C, ${data.weather[0].description}`;
    })
    .catch(error => {
        console.error("Error fetching weather data:", error);
    });

// Ticking Sound
const tickSound = new Audio('tick.mp3');
setInterval(() => {
    tickSound.play();
}, 1000);

// Theme Selector
themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.body.className = ''; // Reset classes
    document.body.classList.add(theme); // Apply selected theme
    localStorage.setItem('theme', theme); // Save theme to localStorage
});

// Load Theme on Page Load
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
};

// Initialize Clock and Date on Page Load
updateAnalogClock();
updateDigitalClock();
updateDate();
updateBackground();

// Update the Clock and Date Every Second
setInterval(() => {
    updateAnalogClock();
    updateDigitalClock();
    updateDate();
}, 1000);

// Add Event Listener to Theme Toggle Button
themeToggle.addEventListener("click", toggleTheme);
