var citiesTab = $('#city-tab');

citiesTab.on('click', citiesTabClicked);


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
