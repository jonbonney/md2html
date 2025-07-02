// Function to get the user's theme preference from localStorage
function getThemePreference() {
    return localStorage.getItem('theme');
}

// Function to set theme preference in localStorage
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
}

// Function to apply theme to document
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// Function to toggle between light and dark themes
function toggleTheme() {
    const currentTheme = getThemePreference();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(newTheme);
    applyTheme(newTheme);
}

// Initialize theme
function initializeTheme() {
    const savedTheme = getThemePreference();
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // If no saved preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setThemePreference(initialTheme);
        applyTheme(initialTheme);
    }
}

// Add event listener for theme toggle button
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Add event listener for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getThemePreference()) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemePreference(newTheme);
        applyTheme(newTheme);
    }
});

// Initialize theme on page load
initializeTheme(); 