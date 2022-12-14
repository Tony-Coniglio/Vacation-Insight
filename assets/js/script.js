//Local Storage Get
populateSearches();
function populateSearches() {
  var storedSearches = JSON.parse(localStorage.getItem("searches"));
  var storedSearchContainer = $('#stored-search-container');
  if(storedSearchContainer.length > 0)
  {
    storedSearchContainer.empty();
  }
  if(storedSearches)
  {
    for(let i = storedSearches.length - 1; i >= 0; i--)
    {
      var newButton = $('<button>');
      newButton.attr("class", "button is-primary mt-4 is-medium is-fullwidth is-flex-direction-column");
      var buttonTitle = $('<h2>');
      buttonTitle.attr("class", "has-text-dark has-text-weight-semibold is-size-6")
      buttonTitle.text(storedSearches[i].cityName);
      newButton.append(buttonTitle);
      var buttonDesc = $('<p>');
      buttonDesc.attr("class", "has-text-dark is-size-7");
      buttonDesc.text(`${storedSearches[i].maximumBudget} ${storedSearches[i].currencyType}`);
      newButton.append(buttonDesc);
      newButton.on("click", {cityName: extractSubstring(storedSearches[i].cityName), currencyType: storedSearches[i].currencyType, maximumBudget: storedSearches[i].maximumBudget},
      function(event) {
        clearCards();
        getHotelInfo(event, event.data.cityName, event.data.currencyType, event.data.maximumBudget);
      })
      storedSearchContainer.append(newButton);
    }
  }
}

function storeSearch(cityName, currencyType, maximumBudget) {
  var storedSearches = JSON.parse(localStorage.getItem("searches"));
  var searchObject = {
    "cityName" : cityName,
    "currencyType" : currencyType,
    "maximumBudget" : maximumBudget
  };
  if(storedSearches && storedSearches.length >= 5)
  {
    if(!storedSearches.some(function(element, index, array) {
      return JSON.stringify(element) === JSON.stringify(searchObject);
    }))
    {
      storedSearches.shift();
      storedSearches.push(searchObject);
    }
  }
  else if(!storedSearches) 
  {
    storedSearches = [];
    storedSearches.push(searchObject);
  }
  else 
  {
    if(!storedSearches.some(function(element, index, array) {
      return JSON.stringify(element) === JSON.stringify(searchObject);
    }))
    {
      storedSearches.push(searchObject);
    }
  }
  localStorage.setItem("searches", JSON.stringify(storedSearches));
  populateSearches();
}
// Hotels API
var requestURL = 'https://hotels4.p.rapidapi.com/properties/v2/list?currency';
var dayIn = moment().format("DD");
var monthIn = moment().format("MM");
var yearIn = moment().format("YYYY");

var dayOut = moment().add(5, 'd').format("DD");
var monthOut = moment().add(5, 'd').format("MM");
var yearOut = moment().add(5, 'd').format("YYYY");

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '83010fd117mshd9d07434275d9cfp12f58ajsn5ea49c1c3a87',
        'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
    }
};

var btn = document.querySelector('#search-button');

function createCard(hotelName, hotelScore, hotelCode, hotelPriceActual, hotelImageUrl) {   
  var cardContainer = document.querySelector("#card-container");
  var card = document.createElement('div');
  card.setAttribute("class", "card mb-4");
  cardContainer.append(card);

  var cardContent = document.createElement('div');
  cardContent.setAttribute("class", "card-content");
  card.append(cardContent);

  var figure = document.createElement("figure");
  figure.setAttribute("class", "image is-2by1 mb-4");
  var hotelImage = document.createElement("img");
  hotelImage.setAttribute("src", hotelImageUrl);
  figure.append(hotelImage);
  cardContent.append(figure);

  var subtitle = document.createElement('p');
  subtitle.setAttribute("class", "subtitle has-text-weight-bold");
  subtitle.innerHTML += hotelName;
  cardContent.append(subtitle);

  var footer = document.createElement('footer');
  footer.setAttribute("class", "card-footer");
  card.append(footer);

  var footerItem1 = document.createElement("p");
  footerItem1.setAttribute("class", "card-footer-item has-text-weight-bold");
  footerItem1.innerHTML += "Hotel Rating: " + hotelScore + "/10";
  footer.append(footerItem1);

  var footerItem2 = document.createElement("p");
  footerItem2.setAttribute("class", "card-footer-item has-text-weight-bold");
  footerItem2.innerHTML += "Hotel Price: " + hotelPriceActual + "\t" + hotelCode ;
  footer.append(footerItem2);

  }

//take more limited information from the autocomplete because the api starts to malfunction with more information
function extractSubstring(cityName)
{
  var regex = /.+,/;
  var matches = cityName.match(regex);
  if(matches)
  {
    cityName = matches[0];
  }
  return cityName;
}

// listen for a click
// go get the users data
// reach into the thml and grab the area w/ the user input
// drill down into that obj and grab the actual data and put it in aa var call cityName
function getHotelInfo (event, cityName, currencyType, maximumBudget) {
    // insert data into first url
    console.log(cityName);
    fetch('https://hotels4.p.rapidapi.com/locations/v3/search?q=' + cityName + '&locale=en_US&langid=1033&siteid=300000001', options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            const gaiaId = response.sr[0].gaiaId;
            console.log(gaiaId);
            const options2 = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': '83010fd117mshd9d07434275d9cfp12f58ajsn5ea49c1c3a87',
                    'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
                },
                body: '{"currency":"' + currencyType + '","eapid":1,"locale":"en_US","siteId":300000001,"destination":{"regionId":"' + gaiaId + '"},"checkInDate":{"day":' + dayIn + ',"month":' + monthIn + ',"year":' + yearIn + '},"checkOutDate":{"day":' + dayOut + ',"month":' + monthOut + ',"year":' + yearOut + '},"rooms":[{"adults":2,"children":[{"age":5},{"age":7}]}],"resultsStartingIndex":0,"resultsSize":20,"sort":"DISTANCE","filters":{"price":{"max":' + maximumBudget + ',"min":100}}}'
            };
            console.log(options2.body);
            fetch(requestURL, options2)
                .then(response2 => response2.json())
                .then(response2 => {
                    var hotelData = response2.data.propertySearch.properties;
                    console.log(hotelData)
                    
                    for (var i = 0; i < hotelData.length; i++) {
                        
                        var hotelName = hotelData[i].name;
                        var hotelScore = hotelData[i].reviews.score;
                        var hotelCode = hotelData[i].price.lead.currencyInfo.code;
                        var hotelMaxPrice = response2.data.propertySearch.filterMetadata.priceRange.max;
                        var hotelPriceActual = hotelData[i].price.lead.amount;
                        var hotelImageUrl = hotelData[i].propertyImage.image.url;
                        
                    
                        // create an html element w/ js
                        createCard (hotelName, hotelScore, hotelCode, hotelPriceActual, hotelImageUrl);

                    }

                    console.log(response2);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.error(err));
}
var citiesTab = $('#city-tab');
var searchButton = $('#hotel-search');
searchButton.on('click', searchHotels);
citiesTab.on('click', citiesTabClicked);
var containerElement = $("#autocomplete-container-city");

//where hotel search API calls and returns will go to fetch hotel name, thumbnail, and hopefully link to the offer
function searchHotels(e)
{
	$('#search-warning').text("");
	var errMsg = "";
	//city name input, this should be replaced by the auto-complete api
	var cityName = $('#hotel-city').val();
	console.log(cityName);
	if(cityName === "")
	{
		errMsg += "<p>Please enter a city.</p>"
	}

	//hotel parameters
	var currencyType = $('#hotel-currency-select').val();

	var maximumBudget = $('#hotel-currency-quantity').val();
	if(!maximumBudget.match(/^\d+$/)) {
		errMsg += "<p>Please enter a number for the budget.</p>";
	}

	var hotelMinRating = $('#hotel-rating-select').val();

	if(errMsg.length > 0)
	{
		$('#search-warning').append(errMsg);
		return;
	}
  storeSearch(cityName, currencyType, maximumBudget);
  cityName = extractSubstring(cityName);
  clearCards();
  getHotelInfo(e, cityName, currencyType, maximumBudget);
}

function clearCards () {
  var cardClearer = document.querySelector("#card-container");
  if (cardClearer.children.length > 0) {
    while (cardClearer.firstChild) {
      cardClearer.removeChild(cardClearer.lastChild);
    }
  }
}

//swaps the city detail tab based on which one is focused.
function citiesTabClicked (event)
{   
    console.log("clicked");
	var parent = $(event.target).parent();
	var sibling = $(parent).siblings();
	if(!parent.hasClass('is-active'))
	{
		var currentActiveDiv = $('div.is-visible');
		var currentInactiveDiv = $('div.is-hidden');
		sibling.removeClass('is-active');
		parent.addClass('is-active');
		currentActiveDiv.removeClass('is-visible');
		currentActiveDiv.addClass('is-hidden');
		currentInactiveDiv.removeClass('is-hidden');
		currentInactiveDiv.addClass('is-visible');
	}
	console.log(sibling.hasClass('is-active'));
	console.log(parent.hasClass('is-active'));
}


function addressAutocomplete(containerElement, callback, options) {
    // create input element
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", options.placeholder);
	inputElement.setAttribute("class", "input is-info");
	inputElement.setAttribute("id", "hotel-city");
    containerElement.appendChild(inputElement);
  
    // add clear button
    var clearButton = document.createElement("div");
    clearButton.classList.add("clear-button");
    addIcon(clearButton);
    clearButton.addEventListener("click", (e) => {
      e.stopPropagation();
      inputElement.value = '';
      callback(null);
      clearButton.classList.remove("visible");
      closeDropDownList();
    });
    containerElement.appendChild(clearButton);
  
    var currentItems;
  
    var currentPromiseReject;

    var focusedItemIndex;
  
    inputElement.addEventListener("input", function(e) {
      var currentValue = this.value;
  
      //Closes dropdown list
      closeDropDownList();
  
      // Cancel previous request promise
      if (currentPromiseReject) {
        currentPromiseReject({
          canceled: true
        });
      }
  
      if (!currentValue) {
        clearButton.classList.remove("visible");
        return false;
      }
  
      // Create a new promise and send geocoding request 
      var promise = new Promise((resolve, reject) => {
        currentPromiseReject = reject;
        var apiKey = "c9fd996424244ac8b4f40e121b6056c8";
        var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;
        
        if (options.type) {
            url += `&type=${options.type}`;
        }
        //Checks call
        fetch(url)
          .then(response => {
            if (response.ok) {
              response.json().then(data => resolve(data));
            } else {
              response.json().then(data => reject(data));
            }
          });
      });
  
      promise.then((data) => {
        currentItems = data.features;
  
        // Creates div for item values
        var autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        containerElement.appendChild(autocompleteItemsElement);
  
        // For the items in the result
        data.features.forEach((feature, index) => {
        //creats div elements for values
          var itemElement = document.createElement("DIV");
         //sets the format for the address
          itemElement.innerHTML = feature.properties.formatted;
  
          //Set the value fot the autocomplete and notify
          itemElement.addEventListener("click", function(e) {
            inputElement.value = currentItems[index].properties.formatted;
  
            callback(currentItems[index]);
  
            // Close autocomplete values
            closeDropDownList();
          });
  
          autocompleteItemsElement.appendChild(itemElement);
        });
      }, (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      });
    });
  
    // Gives keyboard function
    inputElement.addEventListener("keydown", function(e) {
      var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
      if (autocompleteItemsElement) {
        var itemElements = autocompleteItemsElement.getElementsByTagName("div");
        if (e.keyCode == 40) {
          e.preventDefault();
          /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
          focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
          /*and and make the current item more visible:*/
          setActive(itemElements, focusedItemIndex);
        } else if (e.keyCode == 38) {
          e.preventDefault();
  
          /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
          focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
          /*and and make the current item more visible:*/
          setActive(itemElements, focusedItemIndex);
        } else if (e.keyCode == 13) {
          /* If the ENTER key is pressed and value as selected, close the list*/
          e.preventDefault();
          if (focusedItemIndex > -1) {
            closeDropDownList();
          }
        }
      } else {
        if (e.keyCode == 40) {
          //Open drop down menu
          var event = document.createEvent('Event');
          event.initEvent('input', true, true);
          inputElement.dispatchEvent(event);
        }
      }
    });
  
    function setActive(items, index) {
      if (!items || !items.length) return false;
  
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("autocomplete-active");
      }
  
      // Add class autocomplete-active
      items[index].classList.add("autocomplete-active");
  
      // Change input value and notify
      inputElement.value = currentItems[index].properties.formatted;
      callback(currentItems[index]);
    }
  
    function closeDropDownList() {
      var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
      if (autocompleteItemsElement) {
        containerElement.removeChild(autocompleteItemsElement);
      }
  
      focusedItemIndex = -1;
    }
  
    function addIcon(buttonElement) {
      var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
      svgElement.setAttribute('viewBox', "0 0 24 24");
      svgElement.setAttribute('height', "24");
  
      var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
      iconElement.setAttribute('fill', 'currentColor');
      svgElement.appendChild(iconElement);
      buttonElement.appendChild(svgElement);
    }
    
      // Closes the autocomplete dropdown when a city is clicked
    document.addEventListener("click", function(e) {
      if (e.target !== inputElement) {
        closeDropDownList();
      } else if (!containerElement.querySelector(".autocomplete-items")) {
        // open dropdown list again
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        inputElement.dispatchEvent(event);
      }
    });
  
  }
  
    //the container for the Enter city
  addressAutocomplete(document.getElementById("autocomplete-container-city"), (data) => {
    console.log("Selected city: ");
    console.log(data);
  }, {
      placeholder: "Enter a city name here"
  });