const { v4: uuidv4 } = require('uuid');
let myId = uuidv4();

let processText = function (text) {
    return "[Processed by " + myId + "] " + text;
}

const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic("tp-translator-LanguageDetection");

/**
 * Valid textprocessor request is a HTTP-POST request with plaintext
 * @param {*} request 
 * @param {*} response 
 */
exports.textprocessor = async (req, res) => {
    console.log(`Publishing message to topic language-detection`);

    // References an existing topic
    const topic = pubsub.topic('language-detection');

    const messageBuffer = Buffer.from(req.body);

    // Publishes a message
    try {
        await topic.publishMessage(messageBuffer);
        res.status(200).send('[GCF] ' + req.body);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
        return Promise.reject(err);
    }
};