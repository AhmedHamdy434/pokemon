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
