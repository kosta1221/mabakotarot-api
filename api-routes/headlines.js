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
	try {
		const response = await Headline.find()
			.skip(count * (page - 1))
			.limit(count);
		console.log("number of headlines fetched: ", response.length);
		res.status(200).json({ headlines: response });
	} catch (err) {
		next(err);
	}
});

module.exports = headlines;
