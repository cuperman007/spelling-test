export function renderSessionResults(container, results) {
  container.innerHTML = '';
  if (!results.length) {
    container.textContent = 'No results yet.';
    return;
  }

  results.forEach((result, index) => {
    const item = document.createElement('div');
    item.className = 'd-flex align-items-center justify-content-between border-bottom py-2';
    const statusClass = result.correct ? 'correct' : 'incorrect';
    const statusLabel = result.correct ? 'Correct' : 'Incorrect';
    item.innerHTML = `
      <span>Word ${index + 1}</span>
      <span class="result-pill ${statusClass}">${statusLabel}</span>
    `;
    container.appendChild(item);
  });
}
