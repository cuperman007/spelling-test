const STORAGE_KEY = 'spellingHistory';

export function loadHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Unable to parse history data.', error);
    return [];
  }
}

export function saveAttempt(attempt) {
  const history = loadHistory();
  history.unshift(attempt);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
}
