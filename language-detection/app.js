const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

const translationTopic = pubsub.topic("tp-translator-Translation");
const saveTopic = pubsub.topic("tp-translator-Save");

let publishTextToTopic = function (text, topic) {
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

exports.languageDetection = function (message, context) {
    const text = message.data
        ? Buffer.from(message.data, 'base64').toString() : "undefined";

    // detect language
    let isEnglish = true;
    if (isEnglish) {
        // save
        console.log('Publish to tp-translator-Save');
        publishTextToTopic(text, saveTopic)
    }
    else {
        // translate
        console.log('Publish to tp-translator-Translation');
        publishTextToTopic(text, translationTopic)
    }
}