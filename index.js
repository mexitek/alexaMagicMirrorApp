var magicMirror = require("./magicMirror");
var googleImages = require('google-images');
/**
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

var app = {};

// Setup MagicMirror
// magicMirror.setup();

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
app.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("ShowText" === intentName) {
        showText(intent, session, callback);
    } else if ("ShowImages" === intentName) {
        showImages(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Magic Mirror App. Ask me to show you something.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Try something like: Tell mirror to show my sharks.";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function showText(intent, session, callback){
    var cardTitle = "Magic Mirror - Say Something";
    var displayText = intent.slots.displayText.value;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";

    speechOutput = "I told your mirror to say "+displayText;
    repromptText = "I didn't hear you. What would you like me to make your mirror say?";

    magicMirror.setup(function(){
        // Send publish attempt to AWS IoT
        magicMirror.displayText(displayText);

        // Done
        callback(sessionAttributes,
                 buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function showImages(intent, session, callback){
    var cardTitle = "Magic Mirror - Show Me Something";
    var searchTerm = intent.slots.searchTerm.value;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";

    speechOutput = "I told your mirror to show you images of "+searchTerm;
    repromptText = "I didn't quite hear you right. What would you like your mirror to show you?";

    // Search for images
    googleImages.search(searchTerm, function(err,images){
        console.log("Found images: "+JSON.stringify(images));

        // Connect to AWS IoT
        magicMirror.setup(function(clientToken){

            // Send images
            magicMirror.showImages(images,searchTerm);

            // Done
            callback(sessionAttributes,
                     buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    });

}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}

module.exports = app;