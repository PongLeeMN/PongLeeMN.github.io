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
      for (const difficulty of ['Easy', 'Medium', 'Hard']) {
        if (!Number.isInteger(stats.solved[difficulty]) || stats.solved[difficulty] < 0) {
          throw new Error('Invalid stats');
        }
      }
      const lastSolved = stats.lastSolved ? `Last solved ${date(stats.lastSolved)}` : 'No recent accepted submissions';
      for (const difficulty of ['Easy', 'Medium', 'Hard']) {
        card.querySelector(`[data-difficulty="${difficulty}"]`).textContent = stats.solved[difficulty].toLocaleString();
      }
      card.querySelector('[data-last-solved]').textContent = lastSolved;
      card.querySelector('[data-last-solved]').title = `Stats updated ${date(stats.updatedAt)}`;
    })
    .catch(() => {
      card.querySelector('[data-last-solved]').textContent = 'Stats unavailable · View profile for current activity';
    });
})();
