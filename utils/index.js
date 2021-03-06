const { DateTime } = require("luxon");
require("dotenv").config();

const getQuery = (startDate, endDate, sites, unique) => {
	let query = {};

	const uniqueWord = unique ? "unique" : "";

	if (startDate) {
		if (endDate) {
			if (sites && sites.length > 0) {
				console.log(
					`trying to fetch ${uniqueWord} headlines between ${startDate} and ${endDate} of sites ${sites}...`
				);
				query = { date: { $gte: startDate, $lte: endDate }, site: { $in: sites } };
			} else {
				console.log(
					`trying to fetch ${uniqueWord} headlines between ${startDate} and ${endDate}...`
				);
				query = { date: { $gte: startDate, $lte: endDate } };
			}
		} else {
			if (sites && sites.length > 0) {
				console.log(
					`trying to fetch ${uniqueWord} headlines with date ${startDate} of sites ${sites}...`
				);
				query = { date: { $regex: startDate }, site: { $in: sites } };
			} else {
				console.log(`trying to fetch ${uniqueWord} headlines with date ${startDate}...`);
				query = { date: { $regex: startDate } };
			}
		}
	} else {
		if (sites && sites.length > 0) {
			console.log(`trying to fetch ${uniqueWord} headlines of sites ${sites}...`);
			query = { site: { $in: sites } };
		}
	}

	if (unique) {
		query.isTextUnique = { $eq: true };
	}

	return query;
};

const getQueryNoLogs = (startDate, endDate, sites, unique) => {
	let query = {};

	const uniqueWord = unique ? "unique" : "";

	if (startDate) {
		if (endDate) {
			if (sites && sites.length > 0) {
				query = { date: { $gte: startDate, $lte: endDate }, site: { $in: sites } };
			} else {
				query = { date: { $gte: startDate, $lte: endDate } };
			}
		} else {
			if (sites && sites.length > 0) {
				query = { date: { $regex: startDate }, site: { $in: sites } };
			} else {
				query = { date: { $regex: startDate } };
			}
		}
	} else {
		if (sites && sites.length > 0) {
			query = { site: { $in: sites } };
		}
	}

	if (unique) {
		query.isTextUnique = { $eq: true };
	}

	return query;
};

const getFileNameFromOptions = (options) => {
	const { year, month, day, hour, minute } = options;

	const dateTime = new DateTime(DateTime.local()).set({
		hour,
		minute,
		day,
		month,
		year,
	});
	const fileName = dateTime.toFormat("yyyy-MM-dd_HH-mm");

	return fileName;
};

const getDateFromOptions = (options) => {
	const { year, month, day, hour, minute } = options;

	const dateTime = new DateTime(DateTime.local()).set({
		hour,
		minute,
		day,
		month,
		year,
	});
	const date = dateTime.toFormat("yyyy-MM-dd HH:mm");

	return date;
};

const getS3UrlFromSiteAndFileName = (site, fileName, format = "webp") => {
	const s3Url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${site}/${fileName}.${format}`;

	return s3Url;
};

module.exports = {
	getQuery,
	getQueryNoLogs,
	getFileNameFromOptions,
	getDateFromOptions,
	getS3UrlFromSiteAndFileName,
};
