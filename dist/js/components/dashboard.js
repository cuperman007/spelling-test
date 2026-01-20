export function buildDashboardStats(history) {
  const totalAttempts = history.length;
  const totalWords = history.reduce((sum, item) => sum + item.results.length, 0);
  const totalCorrect = history.reduce(
    (sum, item) => sum + item.results.filter(result => result.correct).length,
    0
  );
  const accuracy = totalWords ? Math.round((totalCorrect / totalWords) * 100) : 0;

  return [
    { label: 'Attempts', value: totalAttempts },
    { label: 'Words Practiced', value: totalWords },
    { label: 'Correct', value: totalCorrect },
    { label: 'Accuracy', value: `${accuracy}%` }
  ];
}

export function renderDashboardStats(container, stats) {
  container.innerHTML = '';
  stats.forEach(stat => {
    const col = document.createElement('div');
    col.className = 'col-6 mb-3';
    col.innerHTML = `
      <div class="border rounded-3 p-3 h-100 bg-body-tertiary">
        <div class="text-body-secondary small">${stat.label}</div>
        <div class="fs-4 fw-semibold">${stat.value}</div>
      </div>
    `;
    container.appendChild(col);
  });
}
