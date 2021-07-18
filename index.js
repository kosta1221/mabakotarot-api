require("dotenv").config();
const app = require("./app");
const { connectToMongo } = require("./db/mongo-connection");
const PORT = process.env.PORT || 443;

app.listen(PORT, () => {
	console.log(`app listening on ${PORT}`);
	connectToMongo();
});
