// [1] show checkbox list by click Event           1111111111111111111
let myType = document.querySelector(".all .type");
let myTipo = document.querySelector(".all .type .label");
let successType = false;

if (myTipo) myTipo.addEventListener("click", typeList);
window.addEventListener("click", typeUnlist);
function typeList() {
  myTipo.classList.toggle("clicked");
  setTimeout(() => {
    successType = true;
  }, 100);
}
function typeUnlist() {
  myType.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  if (successType) myTipo.classList.remove("clicked");
}
// *******************************************************
// *******************************************************
console.log(colorObject);

// data on card
const myPokemon = document.querySelector(".all .pokemons");
const myInput = document.querySelector("input[type=text]");
const myShowMonster = document.querySelector(".show-monster");

let pokemonArray = [];
let filterPokemon = [];
let myTypeObjectArray = [];
const maxWeb = 9;

//   create CheckBox
let myPokemonTyper = document.querySelector(".all .type .type-list");
fetch("https://pokeapi.co/api/v2/type") // type
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    res.results.forEach((type, index) => {
      createCheckBox(type, index);
    });
  });
//  [4] function createCheckBox
function createCheckBox(type, index) {
  let myTypeObject = {
    name: type.name,
    url: type.url,
  };
  myTypeObjectArray.push(myTypeObject);
  let myTypeList = document.createElement("div");
  myTypeList.classList.add("typer");
  let myCheckBox = document.createElement("input");
  myCheckBox.setAttribute("type", "checkbox");
  myCheckBox.setAttribute("id", index);
  let myLabel = document.createElement("label");
  myLabel.setAttribute("for", index);
  myLabel.innerHTML = type.name;
  myTypeList.appendChild(myCheckBox);
  myTypeList.appendChild(myLabel);
  myPokemonTyper.appendChild(myTypeList);
  myCheckBox.addEventListener("change", ordering);
}

//**************************************************** */
// [2] fetch all pokemons on pokemonArray        222222222222222
fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
  .then((res) => res.json())
  .then((res) => {
    res.results.forEach((ele) => {
      pokemonArray.push(ele);
    });
    filterPokemon = pokemonArray;
    cardCreating(filterPokemon);
  });
// *******************************************************
// *******************************************************
// [3] Order pokemons on input change           3333333333333333333
myInput.addEventListener("input", ordering);
function ordering() {
  const myCheckedBoxes = document.querySelectorAll("input[type = checkbox]");

  filterPokemon = pokemonArray.filter((pokemon) =>
    pokemon.name.includes(myInput.value)
  );

  myCheckedBoxes.forEach(async (checkbox, index) => {
    if (checkbox.checked) {
      await fetch(myTypeObjectArray[index].url)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res.pokemon);
          const shared = filterPokemon.filter((obj1) =>
            res.pokemon.some((obj2) => obj1.name == obj2.pokemon.name)
          );
          filterPokemon = shared;
        });
    }
  });

  setTimeout(() => {
    cardCreating(filterPokemon);
  }, 1000);
}

// [4]  creating card             4444444444444444444444
function cardCreating(filterPokemon) {
  let min = maxWeb;
  if (filterPokemon.length < min) min = filterPokemon.length;
  myPokemon.innerHTML = "";
  for (let i = 0; i < min; i++) {
    fetch(filterPokemon[i].url)
      .then((res) => res.json())
      .then((res) => {
        filterPokemon[i] = {
          ...filterPokemon[i],
          "data-order": i,
          order: res.order,
          name: res.name,
          attack: res.stats[1].base_stat,
          defence: res.stats[2].base_stat,
          image: res.sprites.other.home.front_default || "images/pokemon.png",
          "sp-attack": res.stats[3].base_stat,
          "sp-defence": res.stats[4].base_stat,
          health: res.stats[0].base_stat,
          exp: res.base_experience,
          ability: [
            res.abilities[0].ability.name,
            res.abilities[1]?.ability.name || res.abilities[0].ability.name,
          ],
          types: [
            res.types[0].type.name,
            res.types[1]?.type.name || res.types[0].type.name,
          ],
        };
        let myCard = document.createElement("div");
        myCard.classList.add("card");
        myCard.setAttribute("data-order", filterPokemon[i]["data-order"]);
        myCard.style.background = colorObject[filterPokemon[i].types[0]];
        myCard.innerHTML = `<div class="info">
              <div class="name">${filterPokemon[i].name}</div>
              <div class="states">
                <div class="state">
                  <div class="power att">${filterPokemon[i].attack}</div>
                  <div class="power-type">Attack</div>
                </div>
                <div class="state">
                  <div class="power def">${filterPokemon[i].defence}</div>
                  <div class="power-type">Defense</div>
                </div>
              </div>
              <div class="spells">
                <span>${filterPokemon[i].types[0]}</span>
                <span>${filterPokemon[i].types[1]}</span>
              </div>

            </div>
            <div class="image-poke">
              <img src=${filterPokemon[i].image} alt="pokemon" />
            </div>`;
        myPokemon.appendChild(myCard);
        myCard.addEventListener("click", (e) => {
          myShowMonster.classList.add("show");
          myScreen.classList.add("blank");
          handleShowMonster(e.currentTarget.getAttribute("data-order"));
        });
      });
  }
  if (min === 0) {
    let notFoundSpan = document.createElement("span");
    myPokemon.appendChild(notFoundSpan);
    notFoundSpan.innerHTML = "<h3>No Pokemon Found</h3>";
    myPokemon.classList.add("not-found");
  } else myPokemon.classList.remove("not-found");
}
// *******************************************************
// *******************************************************

// [5] function handleShowMonster
function handleShowMonster(index) {
  console.log(filterPokemon);
  myShowMonster.innerHTML = `
        <div class="close"></div>
        <div class="image-side">
          <div class="image-monster">
            <img src="${filterPokemon[index].image}" alt="${
    filterPokemon[index].name
  }" />
          </div>
          <div class="spells">
            <span>${filterPokemon[index].types[0]}</span>
            <span>${
              filterPokemon[index].types[1] || filterPokemon[index].types[0]
            }</span>
          </div>
        </div>
        <div class="data-side">
          <div class="data-name">
            <div class="name">${filterPokemon[index].name}</div>
            <div class="name-gene">
              <div class="gene">Generation 1</div>
              <div class="number">${filterPokemon[index].order}</div>
            </div>
          </div>
          <div class="abilities">
            <div class="ability">Abilities</div>
            <span>${filterPokemon[index].ability[0]}</span> - <span>${
    filterPokemon[index].ability[1]
  }</span>
          </div>
          <div class="hp-exp">
            <div class="hp">
              <div class="hp-title">Healthy Points</div>
              <div class="hp-number">${filterPokemon[index].health}</div>
              <div class="hp-bar"></div>
            </div>
            <div class="exp">
              <div class="exp-title">Experience</div>
              <div class="exp-number">${filterPokemon[index].exp}</div>
              <div class="exp-bar"></div>
            </div>
          </div>
          <div class="all-stats">
            <div class="defense-stat">
              <div class="power def">${filterPokemon[index].defence}</div>
              <div class="power-type">Defense</div>
            </div>
            <div class="attack-stat">
              <div class="power att">${filterPokemon[index].attack}</div>
              <div class="power-type">Attack</div>
            </div>
            <div class="sp-attack-stat">
              <div class="power sp-att">${
                filterPokemon[index]["sp-attack"]
              }</div>
              <div class="power-type">Sp Attack</div>
            </div>
            <div class="sp-defense-stat">
              <div class="power sp-def">${
                filterPokemon[index]["sp-defence"]
              }</div>
              <div class="power-type">Sp Defense</div>
            </div>
          </div>
        </div>`;
  document.querySelector(".close").addEventListener("click", () => {
    myShowMonster.classList.remove("show");
    myScreen.classList.remove("blank");
  });
}

fetch("https://pokeapi.co/api/v2/type/3") // type
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
  });
fetch("https://pokeapi.co/api/v2/pokemon/11/")
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
  });
