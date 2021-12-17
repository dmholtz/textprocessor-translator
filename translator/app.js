const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic("tp-translator-Save");

let publish = function (text) {
    const messageObject = {
        data: {
            message: text,
        },
    };
    const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');

    try {
        topic.publishMessage(messageBuffer);
        console.log("Publish successful");
    } catch (err) {
        console.error(err);
    }
}

exports.translate = function (message, context) {
    const text = message.data
        ? Buffer.from(message.data, 'base64').toString() : "undefined";

    // translate
    let englishText = "[English] " + text;
    publish(englishText);
}