
module.exports = function({method, path}, callback){
	if (!callback){
		console.error('You must supply a callback for a request')
		return null;
	}
	if (!method) method = 'GET';

	const self = this;

	const apiRequest = new XMLHttpRequest();
	apiRequest.onreadystatechange = () => {

		if (apiRequest.readyState == 4){
			// the request is complete -> now check the status

			if (apiRequest.status == 200) {
				// the request was received without errors -> but needs to be verified

				let parsedResponse = null; // create placeholder refrence to the JSON data to be parsed
				try {
					parsedResponse = JSON.parse(apiRequest.responseText);
				} catch (e) {
					console.warn('bad JSON response', e);
				}
				callback(parsedResponse || apiRequest.responseText || null)
			} else {
				console.error('requestError', { apiRequest });
				callback(null)
				// the request is a failure -> output error and do callback
			}
		}
	}

	apiRequest.open(method, path, true);
	apiRequest.send();
}
