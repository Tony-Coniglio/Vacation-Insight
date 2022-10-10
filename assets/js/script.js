// Hotels API
var requestURL = 'https://hotels4.p.rapidapi.com/properties/v2/list?currency';

const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': '83010fd117mshd9d07434275d9cfp12f58ajsn5ea49c1c3a87',
		'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
	},
	body: '{"currency":"USD","eapid":1,"locale":"en_US","siteId":300000001,"destination":{"regionId":"6054439"},"checkInDate":{"day":10,"month":10,"year":2022},"checkOutDate":{"day":15,"month":10,"year":2022},"rooms":[{"adults":2,"children":[{"age":5},{"age":7}]}],"resultsStartingIndex":0,"resultsSize":200,"sort":"PRICE_LOW_TO_HIGH","filters":{"price":{"max":150,"min":100}}}'
};

fetch(requestURL, options)
	.then(response => response.json())
	.then(response => { 
        var hotelData = response.data.propertySearch.properties;
        for (var i = 0; i < hotelData.length; i++) {
            console.log (hotelData[i].name)
            console.log (hotelData[i].reviews.score)
            console.log (hotelData[i].price.lead.currencyInfo.code)
            console.log (response.data.propertySearch.filterMetadata.priceRange.max)
            console.log (hotelData[i].propertyImage.image.url)
        }
    
        console.log(response)})
	.catch(err => console.error(err));
    