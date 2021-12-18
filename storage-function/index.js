const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore();

const save = async function (text) {
    // The kind for the new entity
    const kind = 'Note';
    // The name/ID for the new entity
    const note = text;
    // The Cloud Datastore key for the new entity
    const taskKey = datastore.key([kind, note]);
    // Prepares the new entity
    const task = {
        key: taskKey,
        data: {
            text: text,
        },
    };
    // Saves the entity
    await datastore.save(task);
    console.log(`Saved ${task.key.name}: ${task.data.text}`);
}

/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * Saves a message from the trigger topic to the Google Datastore.
 * 
 * @param {*} message 
 * @param {*} context 
 */
exports.saveToDatastore = async function (message, context) {
    const text = message.data
        ? Buffer.from(message.data, 'base64').toString() : "undefined";

    console.log('[INFO]: Save to datastore: ' + text);
    save(text);
}