const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Minio = require('minio');
const Multer = require("multer");
const db = require('./database');
const app = express();
const rabbit = require('./rabbit');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Pievienošanas pie Minio
let minioClient = new Minio.Client({
    endPoint: "minio",
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

//Izveidojam cars bucket gadijumā ja tāda nav iekš minio
minioClient.bucketExists('cars', function (err, exists) {
    if (err) {
        console.log(err);
    }
    if (!exists) {
        minioClient.makeBucket('cars');
    }
})

//Ar multer palīdzību saņemam failu un saglabājam iekš minio, izveidojam rabbit mq rindu un atsūtam faila nosaukumu
app.post("/enter", Multer({storage: Multer.memoryStorage()}).single("car"), function (request, response) {
    minioClient.putObject("cars", request.file.originalname, request.file.buffer, function (error, etag) {
        if (error) {
            return console.log(error);
        }
    });
    console.log(request.body.email)
    rabbit.send({'file': request.file.originalname, 'email': request.body.email});
    response.send(request.file.originalname);

});

app.post("/exit", Multer({storage: Multer.memoryStorage()}).single("car"), function (request, response) {
    minioClient.putObject("cars", request.file.originalname, request.file.buffer, function (error, etag) {
        if (error) {
            return console.log(error);
        }
    });
    rabbit.send(request.file.originalname);
    response.send(request.file.originalname);
});

module.exports = app;
