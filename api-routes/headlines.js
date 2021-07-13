const { Router } = require("express");

const headlines = Router();

const Headline = require("../db/models/Headline");
const { getQuery, getQueryNoLogs } = require("../utils");

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
	let sameQueryNotUnique;
	if (search) {
		query = { titleText: { $regex: search } };

		if (unique) {
			query.isTextUnique = { $eq: true };
		}
	} else {
		query = getQuery(startDate, endDate, parsedSites, unique);
		sameQueryNotUnique = getQueryNoLogs(startDate, endDate, parsedSites, false);
	}

	try {
		const foundByQuery = await Headline.find(query)
			.sort([
				["date", isSortAsc ? 1 : -1],
				["site", 1],
			])
			.skip(count * (page - 1))
			.limit(count);

		let response = [];

		if (foundByQuery.length > 0) {
			response = [...foundByQuery];

			const doesCountPermitAddingFirstHeadline = count === 0 || count > foundByQuery.length;

			if (unique && startDate && doesCountPermitAddingFirstHeadline) {
				// first headline which is not unique to db, but unique to this query. Only applies when querying for unique headlines and when a start date is set.
				const firstHeadline = await Headline.findOne(sameQueryNotUnique).sort([["date", 1]]);

				if (
					firstHeadline &&
					foundByQuery.filter((headline) => headline._id === firstHeadline._id).length < 1
				) {
					response = isSortAsc
						? [firstHeadline, ...foundByQuery]
						: [...foundByQuery, firstHeadline];
				}
				// console.log("first headline found : ", firstHeadline);
			}

			console.log("found by query length: ", foundByQuery.length);
			console.log("number of headlines fetched: ", response.length);
			console.log("original page: ", +req.query.page);
			console.log("page: ", page);
		}

		res.status(200).json({ headlines: response });
	} catch (err) {
		next(err);
	}
});

module.exports = headlines;
