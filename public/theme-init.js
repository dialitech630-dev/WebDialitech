(function () {
  try {
    var raw = localStorage.getItem('appearance_preferences');
    if (raw) {
      var prefs = JSON.parse(raw);
      var root = document.documentElement;
      if (prefs.theme) {
        var theme = prefs.theme;
        if (theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        root.classList.add('theme-' + theme);
        root.setAttribute('data-theme', theme);
      }
      if (prefs.fontSize) {
        root.classList.add('font-' + prefs.fontSize);
        root.setAttribute('data-font-size', prefs.fontSize);
      }
      if (prefs.compactMode) {
        root.classList.add('compact-mode');
        root.setAttribute('data-compact', 'true');
      }
      if (prefs.language) {
        root.setAttribute('lang', prefs.language === 'es' ? 'es' : 'en');
      }
    }
  } catch (e) {}
})();
