export function renderHistory(container, history, weekLookup) {
  container.innerHTML = '';
  if (!history.length) {
    const empty = document.createElement('div');
    empty.className = 'text-body-secondary';
    empty.textContent = 'No sessions yet. Start practicing to build history.';
    container.appendChild(empty);
    return;
  }

  history.forEach(item => {
    const correctCount = item.results.filter(result => result.correct).length;
    const accuracy = Math.round((correctCount / item.results.length) * 100);
    const wrapper = document.createElement('div');
    wrapper.className = 'list-group-item d-flex justify-content-between align-items-start';
    wrapper.innerHTML = `
      <div>
        <div class="fw-semibold">${weekLookup[item.weekId] ?? item.weekId}</div>
        <div class="small text-body-secondary">${new Date(item.completedAt).toLocaleString()}</div>
      </div>
      <span class="badge text-bg-secondary">${accuracy}%</span>
    `;
    container.appendChild(wrapper);
  });
}
