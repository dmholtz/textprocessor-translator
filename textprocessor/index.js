const { v4: uuidv4 } = require('uuid');
let myId = uuidv4();

let processText = function (text) {
    return "[Processed by " + myId + "] " + text;
}

const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic("tp-translator-LanguageDetection");

let publish = function (text) {
    const messageObject = {
        data: {
            message: text,
        },
    };
    const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');

    try {
        topic.publish(messageBuffer);
        console.log("Publish successful");
    } catch (err) {
        console.error(err);
    }
}

/**
 * Valid textprocessor request is a HTTP-POST request with plaintext
 * @param {*} request 
 * @param {*} response 
 */
exports.textprocessor = function (request, response) {
    switch (request.method) {
        case 'POST':
            let content_type = request.get('content-type');
            if (content_type === 'text/plain') {
                let processedText = processText(request.body);
                publish(request.body);
                response.status(200).send(processedText);
            }
            else {
                // invalid content type
                response.status(400).send();
            }
            break;
        default:
            response.status(405).send();
            break;
    }
}