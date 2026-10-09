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
      for (const difficulty of ['All', 'Easy', 'Medium', 'Hard']) {
        if (!Number.isInteger(stats.solved[difficulty]) || !Number.isInteger(stats.totals[difficulty])) {
          throw new Error('Invalid stats');
        }
      }
      card.querySelector('[data-total]').textContent = stats.solved.All.toLocaleString();
      for (const difficulty of ['Easy', 'Medium', 'Hard']) {
        card.querySelector(`[data-difficulty="${difficulty}"]`).textContent =
          `${stats.solved[difficulty].toLocaleString()} / ${stats.totals[difficulty].toLocaleString()}`;
      }
      card.querySelector('[data-last-solved]').textContent = stats.lastSolved
        ? `Last solved ${date(stats.lastSolved)}` : 'No recent accepted submissions';
      card.querySelector('[data-updated]').textContent = `Stats updated ${date(stats.updatedAt)}`;
    })
    .catch(() => {
      card.querySelector('[data-updated]').textContent = 'Stats are unavailable. View my LeetCode profile for current counts.';
    });
})();
