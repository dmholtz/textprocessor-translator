/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * Saves a message from the trigger topic to the Google Datastore.
 * 
 * @param {*} message 
 * @param {*} context 
 */
exports.saveToDatastore = function (message, context) {
    const content = message.data
        ? Buffer.from(message.data, 'base64').toString() : "undefined";

    console.log('[INFO]: Received ' + content);
}