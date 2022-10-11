// Hotels API
var requestURL = 'https://hotels4.p.rapidapi.com/properties/v2/list?currency';



const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '83010fd117mshd9d07434275d9cfp12f58ajsn5ea49c1c3a87',
        'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
    }
};

// reach into the html and grabe the button
var btn = document.querySelector('#search-button');

// listen for a click
function getHotelInfo (event, cityName) {
    // go get the users data
    // reach into the thml and grabe the area w/ the user input
    // drill down into that obj and grabe the actual data and put it in aa var call cityName



    // insert data into first url
    console.log(cityName);
    fetch('https://hotels4.p.rapidapi.com/locations/v3/search?q=' + cityName + '&locale=en_US&langid=1033&siteid=300000001', options)
        .then(response => response.json())
        .then(response => {

            console.log(response)
            const gaiaId = response.sr[0].gaiaId;
            console.log(gaiaId)

            const options2 = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': '83010fd117mshd9d07434275d9cfp12f58ajsn5ea49c1c3a87',
                    'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
                },
                body: '{"currency":"USD","eapid":1,"locale":"en_US","siteId":300000001,"destination":{"regionId":"' + gaiaId + '"},"checkInDate":{"day":10,"month":10,"year":2022},"checkOutDate":{"day":15,"month":10,"year":2022},"rooms":[{"adults":2,"children":[{"age":5},{"age":7}]}],"resultsStartingIndex":0,"resultsSize":200,"sort":"PRICE_LOW_TO_HIGH","filters":{"price":{"max":150,"min":100}}}'
            };

            fetch(requestURL, options2)
                .then(response2 => response2.json())
                .then(response2 => {
                    var hotelData = response2.data.propertySearch.properties;
                    for (var i = 0; i < hotelData.length; i++) {
                        console.log(hotelData[i].name)
                        console.log(hotelData[i].reviews.score)
                        console.log(hotelData[i].price.lead.currencyInfo.code)
                        console.log(response2.data.propertySearch.filterMetadata.priceRange.max)
                        console.log(hotelData[i].propertyImage.image.url)
                    }

                    console.log(response2)
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));

};
var citiesTab = $('#city-tab');
var searchButton = $('#hotel-search');
searchButton.on('click', searchHotels);
citiesTab.on('click', citiesTabClicked);

//where hotel search API calls and returns will go to fetch hotel name, thumbnail, and hopefully link to the offer
function searchHotels(e)
{
	$('#search-warning').text("");
	var errMsg = "";
	//city name input, this should be replaced by the auto-complete api
	var cityName = $('#hotel-city').val();
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

	var hotelMinRating = $('input:radio[name=review]:checked').val();
	console.log(maximumBudget);

	if(errMsg.length > 0)
	{
		$('#search-warning').append(errMsg);
		return;
	}
    getHotelInfo(e, cityName);
}


//swaps the city detail tab based on which one is focused.
function citiesTabClicked (event)
{
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
