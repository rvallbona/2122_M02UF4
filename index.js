#!/usr/bin/node

let http = require("http");
let fs = require("fs");

let mongo_client = require("mongodb").MongoClient;

let url = "mongodb://localhost/";

let db;

console.log("Iniciando script mongo-http");

mongo_client.connect(url, function(error, conn){
	console.log("Dentro de MongoDB");

	if (error){
		console.log("ERROR!!!");
		return;
	}

	db = conn.db("tffhd");

});



http.createServer(function(req, res){
	res.writeHead(200);

	if (req.url == "/"){
		fs.readFile("index.html", function (err, data){
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(data);
		});

		return;
	}

	let col = "";

	if (req.url == "/characters")
		col = "characters";
	else if (req.url == "/items")
		col = "items";
	else{
		res.end();
		return;
	}

	let col_data = db.collection(col).find();

	col_data.toArray(function(err, data){
		let string = JSON.stringify(data);

		res.end(string);
	});


}).listen(1095);


