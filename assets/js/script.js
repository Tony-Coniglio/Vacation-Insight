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
