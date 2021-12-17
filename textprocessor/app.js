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
exports.textprocessor = async function (request, response) {
    switch (request.method) {
        case 'POST':
            console.log("Publish message to topic LanguageDetection");

            const messageBuffer = Buffer.from(request.body);
            try {
                await topic.publishMessage(messageBuffer);
                response.status(200).send(processText(req.body));
            }
            catch (err) {
                console.err(err);
                response.status(500).send(err);
                return Promise.reject(err);
            }
            break;
        default:
            response.status(405).send();
            return Promise.reject(err);
    }
}