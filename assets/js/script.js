/* example api call for the hotels api, ignore during merge.
const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': 'e82b41c8b4mshdce26feef0f8eeap1bc373jsn76d5e61b4aa4',
		'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
	},
	body: '{"currency":"USD","eapid":1,"locale":"en_US","siteId":300000001,"destination":{"regionId":"6054439"},"checkInDate":{"day":10,"month":10,"year":2022},"checkOutDate":{"day":15,"month":10,"year":2022},"rooms":[{"adults":2,"children":[{"age":5},{"age":7}]}],"resultsStartingIndex":0,"resultsSize":200,"sort":"PRICE_LOW_TO_HIGH","filters":{"price":{"max":150,"min":100}}}'
};

fetch('https://hotels4.p.rapidapi.com/properties/v2/list', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
*/