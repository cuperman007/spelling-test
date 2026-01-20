import { loadSpellingData } from './data.js';
import { loadHistory, saveAttempt } from './storage.js';
import { SpellingSession } from './session.js';
import { loadVoices, speakWord } from './tts.js';
import { buildDashboardStats, renderDashboardStats } from './components/dashboard.js';
import { renderHistory } from './components/history.js';
import { renderSessionResults } from './components/results.js';

const selectors = {
  weekSelect: document.getElementById('week-select'),
  startSession: document.getElementById('start-session'),
  playWord: document.getElementById('play-word'),
  repeatWord: document.getElementById('repeat-word'),
  wordProgress: document.getElementById('word-progress'),
  answerForm: document.getElementById('answer-form'),
  answerInput: document.getElementById('answer-input'),
  answerFeedback: document.getElementById('answer-feedback'),
  sessionSummary: document.getElementById('session-summary'),
  sessionResults: document.getElementById('session-results'),
  dashboardStats: document.getElementById('dashboard-stats'),
  historyList: document.getElementById('history-list'),
  voiceSelect: document.getElementById('voice-select'),
  rate: document.getElementById('rate'),
  rateValue: document.getElementById('rate-value'),
  pitch: document.getElementById('pitch'),
  pitchValue: document.getElementById('pitch-value'),
  themeToggle: document.getElementById('theme-toggle'),
  app: document.querySelector('.app'),
  activeWeekPill: document.getElementById('active-week-pill')
};

const state = {
  data: null,
  session: null,
  voices: [],
  history: [],
  theme: 'light'
};

const THEME_KEY = 'spellingTheme';

function setTheme(theme) {
  state.theme = theme;
  selectors.app.setAttribute('data-theme', theme);
  selectors.themeToggle.checked = theme === 'dark';
  localStorage.setItem(THEME_KEY, theme);
}

function updateWeekPill(label) {
  selectors.activeWeekPill.textContent = label;
}

function setControlsEnabled(enabled) {
  selectors.playWord.disabled = !enabled;
  selectors.repeatWord.disabled = !enabled;
  selectors.answerInput.disabled = !enabled;
  selectors.answerForm.querySelector('button').disabled = !enabled;
}

function updateProgress() {
  if (!state.session) {
    selectors.wordProgress.textContent = '0 / 0';
    return;
  }
  selectors.wordProgress.textContent = `${state.session.currentIndex} / ${state.session.total}`;
}

function clearFeedback() {
  selectors.answerFeedback.textContent = '';
  selectors.answerFeedback.className = 'form-text';
}

function updateFeedback(correct) {
  selectors.answerFeedback.textContent = correct
    ? 'Nice work! That spelling is correct.'
    : 'Not quite. Keep going to the next word.';
  selectors.answerFeedback.className = `form-text ${correct ? 'text-success' : 'text-danger'}`;
}

function updateSessionSummary(results) {
  if (!results.length) {
    selectors.sessionSummary.textContent = 'Start a session to see results.';
    return;
  }
  const correctCount = results.filter(result => result.correct).length;
  selectors.sessionSummary.textContent = `You answered ${correctCount} of ${results.length} correctly.`;
}

function updateDashboard() {
  const stats = buildDashboardStats(state.history);
  renderDashboardStats(selectors.dashboardStats, stats);
  const weekLookup = Object.fromEntries(
    (state.data?.weeks ?? []).map(week => [week.id, week.label])
  );
  renderHistory(selectors.historyList, state.history, weekLookup);
}

function playCurrentWord() {
  if (!state.session || state.session.isComplete) {
    return;
  }
  speakWord({
    word: state.session.currentWord,
    voiceName: selectors.voiceSelect.value,
    rate: Number(selectors.rate.value),
    pitch: Number(selectors.pitch.value)
  });
}

function finishSession() {
  const results = state.session?.results ?? [];
  updateSessionSummary(results);
  renderSessionResults(selectors.sessionResults, results);
  setControlsEnabled(false);

  const attempt = {
    id: crypto.randomUUID(),
    weekId: selectors.weekSelect.value,
    results,
    completedAt: new Date().toISOString()
  };
  state.history = saveAttempt(attempt);
  updateDashboard();
}

function startSession() {
  const weekId = selectors.weekSelect.value;
  const selectedWeek = state.data.weeks.find(week => week.id === weekId);
  if (!selectedWeek) {
    return;
  }
  state.session = new SpellingSession(selectedWeek.words);
  selectors.sessionSummary.textContent = 'Session started. Press "Play word" to begin.';
  selectors.sessionResults.innerHTML = '';
  selectors.answerInput.value = '';
  clearFeedback();
  setControlsEnabled(true);
  updateProgress();
  updateWeekPill(selectedWeek.label);
}

function handleAnswerSubmit(event) {
  event.preventDefault();
  if (!state.session || state.session.isComplete) {
    return;
  }
  const answer = selectors.answerInput.value;
  const correct = state.session.recordAnswer(answer);
  updateFeedback(correct);
  renderSessionResults(selectors.sessionResults, state.session.results);
  updateProgress();
  selectors.answerInput.value = '';

  if (state.session.isComplete) {
    finishSession();
    return;
  }
}

async function initialize() {
  state.data = await loadSpellingData();
  state.history = loadHistory();

  selectors.weekSelect.innerHTML = '';
  state.data.weeks.forEach(week => {
    const option = document.createElement('option');
    option.value = week.id;
    option.textContent = `${week.label} (21 words)`;
    selectors.weekSelect.appendChild(option);
  });
  updateWeekPill(state.data.weeks[0].label);

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(savedTheme);

  const voices = await loadVoices();
  selectors.voiceSelect.innerHTML = '';
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    selectors.voiceSelect.appendChild(option);
  });

  updateDashboard();
  updateProgress();
  setControlsEnabled(false);
}

selectors.startSession.addEventListener('click', startSession);
selectors.playWord.addEventListener('click', playCurrentWord);
selectors.repeatWord.addEventListener('click', playCurrentWord);
selectors.answerForm.addEventListener('submit', handleAnswerSubmit);
selectors.rate.addEventListener('input', event => {
  selectors.rateValue.textContent = event.target.value;
});
selectors.pitch.addEventListener('input', event => {
  selectors.pitchValue.textContent = event.target.value;
});
selectors.themeToggle.addEventListener('change', event => {
  setTheme(event.target.checked ? 'dark' : 'light');
});
selectors.weekSelect.addEventListener('change', event => {
  const selected = state.data.weeks.find(week => week.id === event.target.value);
  if (selected) {
    updateWeekPill(selected.label);
  }
});

initialize();
