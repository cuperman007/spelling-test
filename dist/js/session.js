export class SpellingSession {
  constructor(words) {
    this.words = [...words];
    this.index = 0;
    this.results = [];
  }

  get total() {
    return this.words.length;
  }

  get currentIndex() {
    return this.index + 1;
  }

  get isComplete() {
    return this.index >= this.words.length;
  }

  get currentWord() {
    return this.words[this.index];
  }

  recordAnswer(answer) {
    const correct = answer.trim().toLowerCase() === this.currentWord.toLowerCase();
    this.results.push({
      word: this.currentWord,
      answer,
      correct
    });
    this.index += 1;
    return correct;
  }
}
