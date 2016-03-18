# alexaMagicMirrorApp
An Amazon Echo app that searches Google images based on a search term and publishes the message on your AWS IoT gateway.

## Assumptions
This repo is not a tutorial.
* You know how to setup and use AWS IoT gateway.
* You know how to setup an Amazon Echo app. 

## Things to Configure
1. Edit `keys/buffers.js` and place the content of your real AWS IoT keys.
2. Edit `config.js` with the "host" that represents your AWS IoT gateway.
3. Upload this app to Amazon Echo as your app and run. Watch the console logs for meaningful output.

## Intents Schema
```
{
  "intents": [
    {
      "intent": "ShowText",
      "slots": [{
          "name": "displayText",
          "type": "LITERAL"
        }]
    },
    {
      "intent": "ShowImages",
      "slots": [{
          "name": "searchTerm",
          "type": "LITERAL"
        }]
    }
  ]
}
```

## Sample Utterances
```
ShowText say {hello everyone|displayText}
ShowText say {good morning|displayText}
ShowText say {hi|displayText}
ShowImages show me {sharks|searchTerm}
ShowImages show me pictures of {sea animals|searchTerm}
ShowImages show me imges of {octopus|searchTerm}
ShowImages show pictures of {volcanoes|searchTerm}
ShowImages show images of {bill gates|searchTerm}
ShowImages display pictures of {animals|searchTerm}
ShowImages display images of {rattle snakes|searchTerm}
ShowImages find {rescue bots|searchTerm}
ShowImages find images of {sharks|searchTerm}
ShowImages find pictures of {sharks|searchTerm}
```