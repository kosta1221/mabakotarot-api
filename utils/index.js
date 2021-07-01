const getQuery = (startDate, endDate, sites) => {
	let query = {};

	if (startDate) {
		if (endDate) {
			if (sites && sites.length > 0) {
				console.log(
					`trying to fetch headlines between ${startDate} and ${endDate} of sites ${sites}...`
				);
				query = { date: { $gte: startDate, $lte: endDate }, site: { $in: sites } };
			} else {
				console.log(`trying to fetch headlines between ${startDate} and ${endDate}...`);
				query = { date: { $gte: startDate, $lte: endDate } };
			}
		} else {
			if (sites && sites.length > 0) {
				console.log(`trying to fetch headlines with date ${startDate} of sites ${sites}...`);
				query = { date: { $regex: startDate }, site: { $in: sites } };
			} else {
				console.log(`trying to fetch headlines with date ${startDate}...`);
				query = { date: { $regex: startDate } };
			}
		}
	} else {
		if (sites && sites.length > 0) {
			console.log(`trying to fetch headlines of sites ${sites}...`);
			query = { site: { $in: sites } };
		}
	}

	return query;
};

module.exports = { getQuery };
