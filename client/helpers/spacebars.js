UI.registerHelper('pluralize', function (n, thing) {

	if (n === 0) {

		return "No votes";
	}
	else if (n === 1) {
		
		return '1 ' + thing;
	} else {
		
		return n + ' ' + thing + 's';
	}
});