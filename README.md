# Weekly Spelling Practice

A lightweight spelling-test app built for GitHub Pages. Each week contains 21 words stored in a local JSON file. Learners listen to the word using the Web Speech API, type the spelling, and the app tracks accuracy over time with a simple dashboard.

## Features

- Weekly spelling lists stored locally in `dist/data/spellings.json`.
- Speech playback with selectable voice, rate, and pitch settings.
- Practice sessions that never display the word on screen.
- Local history tracking with accuracy summaries.
- Bootstrap 5 styling with a light/dark theme toggle.
- Runs entirely on static hosting (no backend required).

## How It Works

1. Choose a week and start a session.
2. Press **Play word** to hear the spelling.
3. Type the word and submit.
4. Finish all 21 words to save the session to the dashboard history.

All progress is stored locally in the browser using `localStorage`, so each device keeps its own history.

## Data Format

Update `dist/data/spellings.json` to add or edit weeks. Each week has an `id`, `label`, and 21 `words`.

```json
{
  "weeks": [
    {
      "id": "week-01",
      "label": "Week 1",
      "words": ["word1", "word2", "...", "word21"]
    }
  ]
}
```

## Running Locally

Because browsers restrict module loading on `file://` URLs, run a local server:

```bash
python -m http.server
```

Then open `http://localhost:8000/dist/`.

## Browser Requirements

The app relies on the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), which is supported in most modern browsers. Voice availability depends on the browser and operating system.
