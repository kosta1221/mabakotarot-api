const getQuery = (startDate, endDate, site) => {
	let query = {};

	if (startDate) {
		if (endDate) {
			if (site) {
				console.log(
					`trying to fetch headlines between ${startDate} and ${endDate} of site ${site}...`
				);
				query = { date: { $gte: startDate, $lte: endDate }, site: { $eq: site } };
			} else {
				console.log(`trying to fetch headlines between ${startDate} and ${endDate}...`);
				query = { date: { $gte: startDate, $lte: endDate } };
			}
		} else {
			if (site) {
				console.log(`trying to fetch headlines with date ${startDate} of site ${site}...`);
				query = { date: { $regex: startDate }, site: { $eq: site } };
			} else {
				console.log(`trying to fetch headlines with date ${startDate}...`);
				query = { date: { $regex: startDate } };
			}
		}
	} else {
		if (site) {
			console.log(`trying to fetch headlines of site ${site}...`);
			query = { site: { $eq: site } };
		}
	}

	return query;
};

module.exports = { getQuery };
