export async function loadSpellingData() {
  const response = await fetch('./data/spellings.json');
  if (!response.ok) {
    throw new Error('Unable to load spelling data.');
  }
  return response.json();
}
