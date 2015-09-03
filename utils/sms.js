/**
 * Created by robin on 31/08/15.
 */

var os = require('os');
var config = require('../conf/config.json');
var twilio = config.twilioAcountDetails;
var messages = require('twilio')(twilio.accountSid, twilio.authToken).sms.messages;

var url = config.serverAddress;

var generateURL = function generateURL() {
    function getAddress(connection) {
        var port = require('../server').get('port');
        if (connection) {
            var address = false;
            if (connection[0]) {
                address = connection[0].address;
            }
            else {
                address = connection.address;
            }
            return 'http://'+address+':'+port;
        }
    }

    var connections = os.networkInterfaces();
    if (connections.eth0) {
        return getAddress(connections.eth0);
    }
    else if (connections.wlan0) {
        return getAddress(connections.wlan0);
    }

    //throw new Error('Could not get host details!');
};

function getSessionURL(sessionId) {
    if (!url) {
        url = generateURL();
    }
    return url + '/upload?sessionId=' + sessionId;
}

function sendSMS(sessionId, number, callback) {
    var text =
        'Please use the following link to upload an image of your passport.\n' +
        getSessionURL(sessionId);
    messages.create({
        body: text,
        to: number,
        from: twilio.accountNumber
    }, callback);
}


module.exports = {
    getSessionURL: getSessionURL,
    sendSMS: sendSMS
};
