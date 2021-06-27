const { Router } = require("express");

const headlines = Router();

const Headline = require("../db/models/Headline");

headlines.get("/", async (req, res, next) => {
	console.log("trying to fetch headlines...");

	if (!req.query.page || !req.query.count) {
		return res.status(400).send("Bad request!");
	}
	if (req.query.page <= 0 || req.query.count <= 0) {
		return res.status(400).send("Bad request!");
	}

	const count = +req.query.count;
	const page = +req.query.page;
	const isSortAsc = req.query.isSortAsc === "true" ? true : false;

	let query = {};
	if (req.query.site) {
		const site = req.query.site;
		query = { site: { $eq: site } };
	}

	try {
		const response = await Headline.find(query)
			.sort([
				["date", isSortAsc ? 1 : -1],
				["site", 1],
			])
			.skip(count * (page - 1))
			.limit(count);

		console.log("number of headlines fetched: ", response.length);
		res.status(200).json({ headlines: response });
	} catch (err) {
		next(err);
	}
});

headlines.get("/:date", async (req, res, next) => {
	const { date } = req.params;
	let query = {};

	const { endDate } = req.query;
	const { site } = req.query;
	console.log(endDate);

	if (endDate) {
		if (site) {
			console.log(`trying to fetch headline between ${date} and ${endDate} of site ${site}...`);
			query = { date: { $gte: date, $lte: endDate }, site: { $eq: site } };
		} else {
			console.log(`trying to fetch headline between ${date} and ${endDate}...`);
			query = { date: { $gte: date, $lte: endDate } };
		}
	} else {
		if (site) {
			console.log(`trying to fetch headline with date ${date} of site ${site}...`);
			query = { date: { $regex: date }, site: { $eq: site } };
		} else {
			console.log(`trying to fetch headline with date ${date}...`);
			query = { date: { $regex: date } };
		}
	}

	try {
		const response = await Headline.find(query);

		console.log("number of headlines fetched: ", response.length);
		res.status(200).json({ headlines: response });
	} catch (err) {
		next(err);
	}
});

module.exports = headlines;
