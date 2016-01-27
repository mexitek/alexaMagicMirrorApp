var awsIot = require('aws-iot-device-sdk');
var config = require("./config");

var app = {};
app.TOPIC_IMAGES = "MagicMirror:new-images";
app.TOPIC_TEXT = "MagicMirror:new-text";
app.clientToken;

// Setup our AWS IoT device gateway
app.setup = function(callback) {
    // Auth with AWS
    app.device = awsIot.device(config.aws.magicmirror);

    console.log("Attempt to connect to AWS ");
    app.device.on("connect",function(){
        console.log("Connected to AWS ");
        callback();
    });
}

// Method that will accept an array of images and publish to AWS IoT
app.showImages = function(images, searchTerm, callback) {
    var callback = callback || function(){};
    var searchTerm = searchTerm || null;
    var imageList = images || [];
    var timestamp = new Date().getTime();
    var update = {"images":imageList,"displayText":searchTerm, timestamp:timestamp};

    // validate?
    if(!imageList.length) return;

    app.device.publish(app.TOPIC_IMAGES, JSON.stringify(update), function(){
        console.log("Published: \nTopic => "+app.TOPIC_IMAGES
                    +"Data => "+JSON.stringify(update));
        callback();
    });
}

// Method that will accept an array of images and publish to AWS IoT
app.displayText = function(text, callback) {
    var callback = callback || function(){};
    var displayText = text || "Oops. I missed it. Try again.";
    var timestamp = new Date().getTime();
    var update = {"displayText":displayText, timestamp:timestamp};

    app.device.publish(app.TOPIC_TEXT, JSON.stringify(update), function(){
        console.log("Published: \nTopic => "+app.TOPIC_TEXT
                    +"Data => "+JSON.stringify(update));
        callback();
    });
}

module.exports = app;