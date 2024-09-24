window.addEventListener('load', function () {
    let theme = localStorage.getItem('theme');
  
    if (!theme) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      } else {
        theme = 'light';
      }
      localStorage.setItem('theme', theme);
    }
  
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  });

document.getElementById('theme-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-theme');
  
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });