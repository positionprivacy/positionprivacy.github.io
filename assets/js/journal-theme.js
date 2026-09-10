try {
  document.documentElement.dataset.theme = JSON.parse(localStorage.getItem('journal-night')) === true ? 'night' : 'day';
} catch {}
