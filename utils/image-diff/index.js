const fs = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const sharp = require("sharp");
const axios = require("axios");

const sizeOf = require("buffer-image-size");

const getDiffFromUrl = async (s3Url1, s3Url2) => {
	console.log("url 1: ", s3Url1);
	console.log("url 2: ", s3Url2);

	const { data: data1 } = await axios({
		url: s3Url1,
		method: "GET",
		responseType: "arraybuffer",
		responseEncoding: "binary",
	});

	const { data: data2 } = await axios({
		url: s3Url2,
		method: "GET",
		responseType: "arraybuffer",
		responseEncoding: "binary",
	});

	// console.log(data1, data2);
	// const img1 = PNG.sync.read(fs.readFileSync("headlines/ynet/2021-07-01_21-15.png"));
	// const img2 = PNG.sync.read(fs.readFileSync("headlines/n12/2021-07-01_21-15.png"));
	const { width: width1, height: height1 } = sizeOf(data1);
	const { width: width2, height: height2 } = sizeOf(data2);
	console.log("width1: ", width1, "height1: ", height1);
	console.log("width2: ", width2, "height2: ", height2);

	const dataSharp1 = await sharp(data1).png().toBuffer();
	const dataSharp2 = await sharp(data2).png().toBuffer();
	const img1 = PNG.sync.read(dataSharp1);
	const img2 = PNG.sync.read(dataSharp2);

	const diff = new PNG({ width: width1, height: height1 });

	const diffNum = pixelmatch(img1.data, img2.data, diff.data, width1, height1, { threshold: 0.1 });
	console.log(diffNum);
	console.log((diffNum / (width1 * height1)) * 100);

	fs.writeFileSync(`ignore/diff.png`, PNG.sync.write(diff));
};

module.exports = { getDiffFromUrl };
