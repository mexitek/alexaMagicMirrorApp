var buffers = require("./keys/buffers");

var config = {};

// AWS IoT
config.aws = {};
config.aws.magicmirror = {
    // "keyPath": __dirname+'/keys/MagicMirrorThing-private.pem.key',
    // "certPath": __dirname+'/keys/MagicMirrorThing-certificate.pem.crt',
    // "caPath": __dirname+'/keys/root-CA.crt',
    "keyPath": buffers.privateKey,
    "certPath": buffers.certificate,
    "caPath": buffers.rootCA,
    "host": "A2S4HK394S6UXN.iot.us-east-1.amazonaws.com",
    "port": 8883,
    "clientId": "AlexaMagicMirror-"+(new Date().getTime()),
    "region":"us-east-1",
    "debug":true
};

module.exports = config;