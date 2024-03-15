const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
  let currentRow = 0;
  let currentGuess = "";
  let done = false;
  let isLoading = true;

  setLoading(isLoading);
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const { word: wordRes } = await res.json();
  const word = wordRes.toUpperCase();
  const wordParts = word.split("");
  isLoading = false;
  setLoading(isLoading);

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
    } else {
      currentGuess = currentGuess.substring(0, ANSWER_LENGTH - 1) + letter;
    }

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerHTML = letter;
  }

  async function commit() {
    if (currentGuess.length < ANSWER_LENGTH) {
      return;
    }

    isLoading = true;
    setLoading(isLoading);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const { validWord: isValidWord } = await res.json();
    isLoading = false;
    setLoading(isLoading);

    if (isValidWord) {
      alert("you win");
      document.querySelector(".brand").classList.add("winner");
      done = true;
      return;
    } else {
      markInvalidWord();
    }

    const guessParts = currentGuess.toUpperCase().split("");
    const map = makeMap(wordParts);

    // correct
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      const letter = guessParts[i];
      if (letter === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        const value = map.get(letter);
        map.set(letter, value - 1);
      }
    }

    // close
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      const letter = guessParts[i];
      if (letter === wordParts[i]) {
      } else if (map.has(letter) && map.get(letter) > 0) {
        const value = map.get(letter);
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map.set(letter, value - 1);
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    if (currentRow === ROUNDS) {
      alert(`you lose, the word was ${word}`);
      done = true;
    }

    currentRow += 1;
    currentGuess = "";
  }

  function backspace() {
    if (currentGuess.length > 0) {
      letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerHTML = "";
      currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    }
  }

  function markInvalidWord() {
    const thisCurrentRow = currentRow;
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[thisCurrentRow * ANSWER_LENGTH + i].classList.remove("invalid");

      // long enough for the browser to repaint without the "invalid class" so we can then add it again
      setTimeout(() => letters[thisCurrentRow * ANSWER_LENGTH + i].classList.add("invalid"), 10);
    }
  }

  // Keydown
  document.addEventListener("keydown", function handleKeyPress(event) {
    const key = event.key;

    if (key === "Enter") {
      commit();
    } else if (key === "Backspace") {
      backspace();
    } else if (isLetter(key)) {
      addLetter(key);
    }
  });

  function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
  }

  function makeMap(array) {
    const map = new Map();
    for (let i = 0; i < array.length; i++) {
      const letter = array[i];
      if (map.has(letter)) {
        const value = map.has(letter);
        map.set(letter, value + 1);
      } else {
        map.set(letter, 1);
      }
    }
    return map;
  }
}

init();
