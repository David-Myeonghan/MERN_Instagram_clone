import "dotenv/config.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbModel from "./dbModel.js";

// app config
const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(express.json()); // pass everything as JSON in and out
app.use(cors()); // security

// DB config
const connection_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqzya.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;

mongoose
	.connect(connection_url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
	.catch((error) => console.error(error));

// try {
// 	await mongoose.connect(connection_url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
// } catch (error) {
// 	console.log(error);
// }

mongoose.connection.once("open", () => {
	console.log("DB Connected");
});

// api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/upload", (req, res) => {
	const body = req.body;

	dbModel.create(body, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get("/sync", (req, res) => {
	dbModel.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});

// listen
app.listen(port, () => console.log(`listening on localhost:${port}`));
