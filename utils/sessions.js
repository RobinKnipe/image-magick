/**
 * Created by robin on 30/08/15.
 */

var fs = require('fs');
var path = require('path');
var sms = require('./sms');

var sessions = {};

function generateSessionId() {
    return new Date().getTime();
}

function Session(connection) {
    this.sessionId = generateSessionId();
    this.connection = connection;
    this.sentMessage = false;

    var processData = function (data) {
        if (data && data.name && data.number) {
            this.name = data.name;
            this.number = data.number;
            if (!data.sessionId) {
                this.connection.write(this.sessionId);
                sms.sendSMS(this.sessionId, this.number, function (err, result) {
                    if (err) {
                        console.trace(err);
                    }
                    else {
                        this.sentMessage = result;
                    }
                });
            }
            else {
                this.sessionId = data.sessionId;
                sessions[this.sessionId] = this;
            }
        }
        else {
            console.error('Received garbage from client');
            console.dir(data);
            this.connection.write('Unexpected request received');
            this.connection.write(data);
        }
    }.bind(this);
    connection.on('data', processData);

    this.sendImagePath = function (file) {
        var extension = /\.[^\.]+$/.exec(file.originalname);
        var filename = file.filename + extension;
        fs.rename(file.path, file.path+extension, function () {
            this.connection.write({
                imagePath: path.join('/images/uploads', filename)
            });
        }.bind(this));
    };
}

function createSession(connection) {
    var session = new Session(connection);
    sessions[session.sessionId] = session;
    return session;
}

function getSession(sessionId) {
    return sessions[sessionId];
}

module.exports = {
    createSession: createSession,
    getSession: getSession
};
