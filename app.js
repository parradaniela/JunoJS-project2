const pokeApp = {};
let submittedType;
let pokemonTypeList;
let typeUrl;
let matchedPokemon;
let pokemonDataUrl;

const $container = $(".results-container");
const $listHeading = $(".list-heading");

// Attaches listener event to the form
pokeApp.getType = () => {
  $("form").on("submit", (event) => {
    event.preventDefault();
    // on submit, store input val, which is pokemon type, into a variable
    submittedType = $("#type-search").val().toLowerCase();
    //clears container and list heading if previous search results were already present
    $container.empty();
    $listHeading.empty();
    //passes the user's selection into the next function
    pokeApp.findTypeList(submittedType);
    // resets the input field
    $("#type-search").val("");
  });
};

// function that calls the API for data on all pokemon types, then matches the type to the user input
pokeApp.findTypeList = (userInput) => {
  $.ajax({
    url: `https://pokeapi.co/api/v2/type`,
    method: "GET",
    dataType: "json",
  }).then((response) => {
    //stores all 20 type Objects into one array
    pokemonTypeList = response.results;
    // Iterates over the array to find the url for the type that was passed in the parameter
    pokemonTypeList.forEach((typeObject) => {
      if (userInput === typeObject.name) {
        //saves the url into a variable and passes it to next function
        typeUrl = typeObject.url;
        pokeApp.filterPokemonList(typeUrl);
        // appends a list heading using the type selected by user
        const htmlToAppend = `
          <h2>List of <span>${userInput}</span> type Pokemon:
        `;
        $listHeading.append(htmlToAppend);       
      }
    });
  });
};

//Function that identifies all the pokemon matching the type selected by the user
pokeApp.filterPokemonList = (url) => {
  $.ajax({
    url: `${url}`,
    method: "GET",
    dataType: "json",
  }).then((response) => {
    // stores the pokemon data into an array, passes the array into the next function
    matchedPokemon = response.pokemon;
    pokeApp.DisplayPokemonDetails(matchedPokemon);
  });
};

// function to select and display each pokemon's name and sprite
pokeApp.DisplayPokemonDetails = (array) => {
  // stores the individual pokemon URLs into an array
  pokemonDataUrl = array.map((object) => {
    return object.pokemon.url;
  });
  // iterates through the array to make API calls for individual pokemon data
  pokemonDataUrl.forEach((url) => {
    $.ajax({
      url: `${url}`,
      method: "GET",
      dataType: "json",
    }).then((response) => {
      // stores sprite data
      const imageUrl = response.sprites.front_default;
      // stores pokemon name data
      const pokemonName = response.name;
      // appends collected data to empty UL
      const htmlToAppend = `
              <li>
                  <img src="${imageUrl}">
                  <p>${pokemonName}</p>
              </li>
             `;
      $container.append(htmlToAppend);
    });
  });
};

pokeApp.init = () => {
  pokeApp.getType();
};

//waiting for document to be ready
$(function () {
  pokeApp.init();
});
