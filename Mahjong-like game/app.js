const cards = document.querySelectorAll(".memory_card");

let hasFlippedCard = false;
let boardLocked = false;
//save DOM element
let firstCard, secondCard;

const flipCard = (e) => {
  if (boardLocked) return;

  const target = e.target.parentElement;

  if (target === firstCard) return;

  target.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = target;
  } else {
    hasFlippedCard = false;
    secondCard = target;

    checkForMatch();
  }
};

const checkForMatch = () => {
  const isEqual = firstCard.dataset.number === secondCard.dataset.number;

  isEqual ? disableCards() : flipCards();
};

const disableCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
};

const flipCards = () => {
  boardLocked = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
};

const resetBoard = () => {
  hasFlippedCard = boardLocked = false;
  firstCard = secondCard = null;
};

cards.forEach((card) => {
  card.addEventListener("click", flipCard);

  const randomIndex = Math.floor(Math.random() * cards.length);
  card.style.order = randomIndex;
});
