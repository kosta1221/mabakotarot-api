const { Router } = require("express");

const headlines = Router();

const Headline = require("../db/models/Headline");
const { getQuery } = require("../utils");

headlines.get("/", async (req, res, next) => {
	console.log("trying to fetch headlines...");

	if (!req.query.page || !req.query.count) {
		return res.status(400).send("Bad request!");
	}
	if (req.query.page < 0 || req.query.count < 0) {
		return res.status(400).send("Bad request!");
	}

	const count = +req.query.count;
	const page = +req.query.page === 0 ? 1 : +req.query.page;
	const isSortAsc = req.query.isSortAsc === "true" ? true : false;
	const unique = req.query.unique === "true" ? true : false;

	const { sites, startDate, endDate, search } = req.query;

	const parsedSites = sites && JSON.parse(sites);

	let query;
	if (search) {
		query = { titleText: { $regex: search } };

		if (unique) {
			query.isTextUnique = { $eq: true };
		}
	} else {
		query = getQuery(startDate, endDate, parsedSites, unique);
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
		console.log("original page: ", +req.query.page);
		res.status(200).json({ headlines: response });
	} catch (err) {
		next(err);
	}
});

module.exports = headlines;
