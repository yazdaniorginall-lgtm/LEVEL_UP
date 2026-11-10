const THEME_KEY = "levelup-theme";


function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "dark";
  } catch (error) {
    return "dark";
  }
}


function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const toggle = document.getElementById("theme-toggle");

  if (toggle) {
    toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}


function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    return;
  }
}


applyTheme(getStoredTheme());
