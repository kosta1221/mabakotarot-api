const { Router } = require("express");

const diff = Router();

const { getS3UrlFromSiteAndFileName } = require("../utils");
const { getDiffFromUrl } = require("../utils/image-diff/index");

diff.get("/", async (req, res, next) => {
	const { site1, fileName1, site2, fileName2 } = req.query;

	console.log(`trying to calculate diff between ${site1}/${fileName1} and ${site2}/${fileName2}`);

	const s3Url1 = getS3UrlFromSiteAndFileName(site1, fileName1);
	const s3Url2 = getS3UrlFromSiteAndFileName(site2, fileName2);

	try {
		const { diffNum, diffPercentage } = await getDiffFromUrl(s3Url1, s3Url2);

		res.status(200).json({ diffNum, diffPercentage });
	} catch (err) {
		next(err);
	}
});

module.exports = diff;
