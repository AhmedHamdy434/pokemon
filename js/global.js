let myButton = document.querySelector(".burgen"),
  myHeader = document.querySelector("header");
let myScreen = document.querySelector(".screen");
let successButton = false;
// burgen button
myButton.addEventListener("click", list);
window.addEventListener("click", unlist);

function list() {
  myHeader.classList.add("listing");
  myScreen.classList.add("blank");

  setTimeout(() => {
    successButton = true;
  }, 100);
}
function unlist() {
  myHeader.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  if (successButton) {
    myHeader.classList.remove("listing");
    myScreen.classList.remove("blank");
  }
}

// colors
const colorObject = {
  stile: "#a1a1a1",
  dark: "#a1a1a1",
  rock: "#a1a1a1",
  grass: "#70a83b",
  bug: "#70a83b",
  ice: "#a2cff0",
  water: "#a2cff0",
  fire: "#f76545",
  fighting: "#f76545",
  dragon: "#f76545",
  normal: "#76aadb",
  gosth: "#76aadb",
  poison: "#a974bc",
  psychic: "#a974bc",
  fairy: "#a974bc",
  ghost: "#a974bc",
  ground: "#9b897b",
  electric: "#f7c545",
};
