const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Minio = require('minio');
const Multer = require("multer");
const db = require('./database');
const app = express();
const rabbit = require('./rabbit');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


let minioClient = new Minio.Client({
    endPoint: "minio",
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

//setup bucket
minioClient.bucketExists('cars', function (err, exists) {
    if (err) {
        console.log(err);
    }
    if (!exists) {
        minioClient.makeBucket('cars');
    }
})
app.post("/enter", Multer({storage: Multer.memoryStorage()}).single("car"), function(request, response) {
    minioClient.putObject("cars", request.file.originalname, request.file.buffer, function(error, etag) {
        if(error) {
            return console.log(error);
        }
        rabbit.send(request.file.originalname);

        response.send(request.file);
    });
});
app.post("/exit", Multer({storage: Multer.memoryStorage()}).single("car"), function(request, response) {
    minioClient.putObject("cars", request.file.originalname, request.file.buffer, function(error, etag) {
        if(error) {
            return console.log(error);
        }
        rabbit.send(request.file.originalname);

        response.send(request.file);
    });
});

module.exports = app;
