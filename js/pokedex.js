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

// data on card
const myPokemon = document.querySelector(".all .pokemons");
const myInput = document.querySelector("input[type=text]");
const myShowMonster = document.querySelector(".show-monster");
let myPokemonTyper = document.querySelector(".all .type .type-list");

let pokemonArray = [];
let filterPokemon = [];
let myTypeObjectArray = [];
const maxWeb = 12;
// Fetching function
const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

//  [2] create CheckBox [1]
const checkboxCreating = async () => {
  const fetchType = await fetchData("https://pokeapi.co/api/v2/type");
  fetchType.results.forEach((type, index) => {
    createCheckBox(type, index);
  });
};
//    create CheckBox [2]
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
  myCheckBox.setAttribute("key", type.name);

  let myLabel = document.createElement("label");
  myLabel.setAttribute("for", index);
  myLabel.innerHTML = type.name;
  myTypeList.appendChild(myCheckBox);
  myTypeList.appendChild(myLabel);
  myPokemonTyper.appendChild(myTypeList);
  myCheckBox.addEventListener("change", ordering);
}

//**************************************************** */
// [3] fetch all pokemons on pokemonArray        222222222222222
const fetchAllPokemons = async () => {
  const pokemonsData = await fetchData(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  pokemonArray = pokemonsData.results;
  filterPokemon = pokemonArray;
  cardCreating(filterPokemon);
};

// *******************************************************
// *******************************************************
// actions on load
window.addEventListener("load", async () => {
  await checkboxCreating();
  await fetchAllPokemons();
  myInput.addEventListener("input", ordering);
});

// [4] Order pokemons on input change           3333333333333333333

const ordering = async () => {
  const myCheckedBoxes = document.querySelectorAll("input[type = checkbox]");

  filterPokemon = pokemonArray.filter((pokemon) =>
    pokemon.name.includes(myInput.value)
  );
  const promises = Array.from(myCheckedBoxes).map(async (checkbox, index) => {
    if (checkbox.checked) {
      const choosingPokemon = await fetchData(myTypeObjectArray[index].url);
      const shared = filterPokemon.filter((obj1) =>
        choosingPokemon.pokemon.some((obj2) => obj1.name == obj2.pokemon.name)
      );
      filterPokemon = shared;
    }
  });
  await Promise.all(promises);
  cardCreating(filterPokemon);
};

// [5]  creating card             4444444444444444444444
async function cardCreating(filterPokemon) {
  let min = maxWeb;
  if (filterPokemon.length < min) min = filterPokemon.length;
  myPokemon.innerHTML = "";
  for (let i = 0; i < min; i++) {
    const myFetch = async () => {
      const res = await fetchData(filterPokemon[i].url);
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
    };
    await myFetch();
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

// [6] function handleShowMonster
function handleShowMonster(index) {
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
              <div class="hp-bar"><span></span></div>
            </div>
            <div class="exp">
              <div class="exp-title">Experience</div>
              <div class="exp-number">${filterPokemon[index].exp}</div>
              <div class="exp-bar"><span></span></div>
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
  let hpWidth = filterPokemon[index].health;
  let expWidth = filterPokemon[index].exp / 2;
  if (hpWidth > 100) hpWidth = 100;
  if (expWidth > 100) expWidth = 100;
  document.querySelector(".hp-bar span").style.width = `${hpWidth}%`;
  document.querySelector(".exp-bar span").style.width = `${expWidth}%`;

  document.querySelector(".close").addEventListener("click", () => {
    myShowMonster.classList.remove("show");
    myScreen.classList.remove("blank");
  });
}
