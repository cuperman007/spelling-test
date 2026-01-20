const synth = window.speechSynthesis;
let voices = [];

export function loadVoices() {
  return new Promise(resolve => {
    const updateVoices = () => {
      voices = synth.getVoices();
      if (voices.length) {
        resolve(voices);
      }
    };

    updateVoices();
    if (typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = updateVoices;
    }
  });
}

export function getVoices() {
  return voices;
}

export function speakWord({ word, voiceName, rate, pitch }) {
  if (!word) {
    return;
  }
  if (synth.speaking) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(word);
  const selected = voices.find(voice => voice.name === voiceName);
  if (selected) {
    utterance.voice = selected;
  }
  utterance.rate = rate;
  utterance.pitch = pitch;
  synth.speak(utterance);
}
