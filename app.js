const pokeApp = {};
pokeApp.pokeApiBaseUrl = "https://pokeapi.co/api/v2/type";
pokeApp.$container = $(".results-container");
pokeApp.$listHeading = $(".list-heading");

// Attaches listener event to the form 
pokeApp.getType = () => {
  $("form").on("submit", (event) => {
    event.preventDefault();
    // on submit, store input val, which is pokemon type, into a variable
    const submittedType = $("#type-search").val().toLowerCase();
    //passes the user's selection into the matchType method
    pokeApp.matchType(submittedType);
    // calls the clearFields method to remove previous search results
    pokeApp.clearFields();
  });
};

//Method that calls the API with a variable for the URL

pokeApp.callApi = (url) => {
  const apiResponse = $.ajax({
    url: `${url}`,
    method: "GET",
    dataType: "json",
  });
  return apiResponse;
};

// Method that calls the API base URL and matches the user's input to one of the objects in the returned Types array
pokeApp.matchType = (stringInput) => {
  const allTypesResponse = pokeApp.callApi(pokeApp.pokeApiBaseUrl);
  const userSelection = stringInput;
  
  allTypesResponse.then((response) => {
    //Locates the array with all 20 pokemon types
    typesArray = response.results;
    // Iterates over the array to match the pokemon type to the text that was entered by the user
    typesArray.forEach((typeObject) => {
      if (userSelection === typeObject.name) {
        //saves the relevant type's url and name into variables to pass to other methods
        typeUrl = typeObject.url;
        typeName = typeObject.name;
        pokeApp.getTypeDetails(typeUrl);
        pokeApp.updateHeading(typeName);
      };
    });
  });
};

// Method to call the API using the desired type's URL, locates all the pokemon with that type, and maps their URLs to an array
pokeApp.getTypeDetails = (url) => {
  const allTypeDetails = pokeApp.callApi(url)
  allTypeDetails.then((response) => {
    // Stores all of the desired type's Pokemon objects into an array
    const matchedPokemonDetails = response.pokemon;
    // Maps each Pokemon's individual URLs to a new array
    const matchedPokemonUrls = matchedPokemonDetails.map((pokemonObject) => {
      return pokemonObject.pokemon.url;
    });
    pokeApp.getIndividualPokemonInfo(matchedPokemonUrls);
  });
};

// Method to call the API using unique Pokemon URLs to locate sprite and name data
pokeApp.getIndividualPokemonInfo = (arrayOfUrls) => {
  arrayOfUrls.forEach((url) => {
    // Calls API for each pokemon object's data
    const singlePokemonDetails = pokeApp.callApi(url);
    singlePokemonDetails.then((response) => {
      // stores sprite data
      const imageUrl = response.sprites.front_default;
      // stores pokemon name data
      const pokemonName = response.name;
      pokeApp.updateSpriteAndName(imageUrl, pokemonName)
    });
  });
};

// Method to populate the results-container UL with pokemon data 
pokeApp.updateSpriteAndName = (spriteUrl, pokemonName) => {
      const htmlToAppend = `
              <li>
                  <img src="${spriteUrl}">
                  <p>${pokemonName}</p>
              </li>`;
      pokeApp.$container.append(htmlToAppend);
}

// Method that appends a list heading using the Pokemon type selected by user
pokeApp.updateHeading = (typeName) => {
  const htmlToAppend = `
    <h2>List of <span>${typeName}</span> type Pokemon:`;
  pokeApp.$listHeading.append(htmlToAppend)
};

// Method to clear the data in the containers and in the input field
pokeApp.clearFields = () => {
  pokeApp.$container.empty();
  pokeApp.$listHeading.empty();
  $("#type-search").val("");
};

pokeApp.init = () => {
  pokeApp.clearFields();
  pokeApp.getType();
};

//waiting for document to be ready
$(function () {
  pokeApp.init();
});

// Thank you for looking through my first attempt at making API calls with jQuery :)
