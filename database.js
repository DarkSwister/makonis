const mongooseconnection = require("mongoose");
mongooseconnection.connect("mongodb://mongo:27017/docker-node-mongo", {
    useNewUrlParser: true
});
mongooseconnection.connection.once("open", function() {
    console.log("MongoDB connected successfully");
});

