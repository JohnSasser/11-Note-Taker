// DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");
let data = require("./db/db.json");

// sets-up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// sets-up the Express app to handle data parsing
// and encoding for the url;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// use for serving static assets/files;
app.use(express.static(__dirname + "/public"));

// front-end request to the .html doc;
app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "public/assets/html/notes.html"));
});

// route that gets my notes from the array of .JSON obj through the api route;
app.get("/api/notes", (req, res) => {
	console.log(`getting notes from index.js getNotes()`);
	res.json(data);
});

// front-end request to the back for data with .get;
// anything that does not match a route, gets sent to the index.html;
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public/assets/html/index.html"));
});

// send data from the front to the back with .post;
app.post("/api/notes", (req, res) => {
	const sendNote = req.body;
	// console.log(`updating array of notes from browser`, sendNote);
	data.push(sendNote);
	// logging my data Arr
	console.log(data);
	fs.writeFile(
		path.join(__dirname, "db/db.json"),
		JSON.stringify(data),
		err => {
			if (err) {
				res.json(err);
			} else {
				res.json(data);
			}
		}
	);
});

// delete route from front to back-end;
app.delete("/api/notes:/id", (req, res) => {
	console.log(req.body);
	console.log(data);
	data = data.filter(element => {
		return element.title != req.body.title;
	});
	console.log(data);
	fs.writeFile(
		path.join(__dirname, "db/db.json"),
		JSON.stringify(data),
		err => {
			if (err) {
				res.json(err);
			} else {
				res.json(data);
			}
		}
	);
});

app.listen(PORT, () => {
	console.log(`app listening on port http://localhost:${PORT}`);
});
