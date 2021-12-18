const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic("tp-translator-Save");

const { Translate } = require('@google-cloud/translate').v2;
const translateClient = new Translate();

async function translateToEnglish(text) {
    console.log(`Translate the following text to English: ${text}`);
    const target = 'en'
    let [translations] = await translateClient.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log('Translations:');
    translations.forEach((translation, i) => {
        console.log(`${text[i]} => ${translation}`);
    })
}

async function publishText(text) {

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

exports.translate = async function (message, context) {
    const text = message.data
        ? Buffer.from(message.data, 'base64').toString() : "undefined";

    const englishText = await translateToEnglish(text);
    await publishText(englishText);
}