(() => {
  const card = document.getElementById('leetcode-stats');
  if (!card) return;
  const date = value => new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(new Date(value));
  fetch('leetcode-stats.json', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Stats unavailable');
      return response.json();
    })
    .then(stats => {
      if (stats.username !== 'PongLee') throw new Error('Unexpected profile');
      if (!Number.isInteger(stats.solved.All) || stats.solved.All < 0) throw new Error('Invalid stats');
      const summary = card.querySelector('[data-summary]');
      summary.textContent = `· ${stats.solved.All.toLocaleString()} solved`;
      summary.title = `Stats updated ${date(stats.updatedAt)}`;
      summary.hidden = false;
    })
    .catch(() => {
      // Keep the profile link usable when the stats snapshot is unavailable.
    });
})();
