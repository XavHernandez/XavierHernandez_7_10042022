import API from "./api/api.js";
import { RecipesCard } from "./utils/cards.js";
import { searchBar } from "./utils/searchBar.js";
import { init, createFiltersLists } from "./utils/filters.js";

let recipes;

async function fetch() {
  const api = new API("../scripts/data/data.json");
  recipes = await api.getRecipes();
  data();
  // getData();
}

//// get recipes list (original + updated) and launch init ////
// function getData(recipesList) {
//   recipesList = data();
// }

function data() {
  const searchInput = document.getElementById("site-search");
  let recipesList = recipes;
  if (searchInput.value.length >= 3) {
    recipesList = searchBar(recipesList);
  }
  init(recipesList);
  return recipesList;
}

//// display recipes function ////
function displayRecipes(recipesList) {
  const recipesSection = document.getElementById("recipes");
  recipesSection.innerHTML = "";
  recipesList.forEach((recipe) => {
    recipesSection.appendChild(new RecipesCard(recipe).buildCard());
  });
}

//// generate and create filters lists ////
function generateFiltersLists(recipesList, ingredientsList, appliancesList, ustensilsList) {
  let ingredients = [];
  let appliances = [];
  let ustensils = [];

  recipesList.forEach((recipe) => {
    recipe.ingredients.map((element) => ingredients.push(element.ingredient));
    appliances.push(recipe.appliance);
    recipe.ustensils.map((element) => ustensils.push(element));
  });

  ingredientsList = [...new Set(ingredients)].sort();
  appliancesList = [...new Set(appliances)].sort();
  ustensilsList = [...new Set(ustensils)].sort();

  console.log(recipesList, ingredientsList, appliancesList, ustensilsList);
  createFiltersLists(recipesList, ingredientsList, appliancesList, ustensilsList);

  return { ingredientsList, appliancesList, ustensilsList };
}

//// function to lower case and normalize text ////
function lowerCaseNormalize(items) {
  return items
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

//// launch ////
fetch();

export { lowerCaseNormalize, displayRecipes, generateFiltersLists, recipes };
