const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

const translationTopic = pubsub.topic("tp-translator-Translate");
const saveTopic = pubsub.topic("tp-translator-Save");

const { Translate } = require('@google-cloud/translate').v2;
const translateClient = new Translate();

async function publishTextToTopic(text, topic) {

    const messageOptions = {
        data: Buffer.from(JSON.stringify(text))
    }

    try {
        const messageId = await topic.publishMessage(messageOptions);
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing; ${error.message}`);
    }
}

async function detectLanguage(text) {
    console.log(`Detect language of text: ${text}.`);
    let [detections] = await translateClient.detect(text);
    // we expect only one detection, but to be future proof...
    detections = Array.isArray(detections) ? detections : [detections];
    detections.forEach(detection => {
        console.log(`${detection.input} => detected ${detection.language} with confidence ${detection.confidence}`);
    });
    return detections[0].language;
}

const isEnglish = function (languageAcronym) {
    return languageAcronym === 'en';
}

exports.languageDetection = function (message, context) {
    const text = message.data
        ? Buffer.from(message.data, 'base64').toString() : "undefined";

    const detectedLanguage = detectLanguage(text);

    if (isEnglish(detectedLanguage)) {
        // save
        console.log('Publish to tp-translator-Save');
        publishTextToTopic(text, saveTopic)
    }
    else {
        // translate
        console.log('Publish to tp-translator-Translation');
        publishTextToTopic(text, translationTopic)
    }

    message.ack();
}