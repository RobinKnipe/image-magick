/**
 * Created by robin on 31/08/15.
 */

var expect = require('chai').expect;
var rewire = require('rewire');
var sms = rewire('../../utils/sms');

var connections = {
    wlan0: { address: 'not.this.one' },
    eth0: { address: 'preferred.one' }
};

describe('SMS functions', function() {

    before('rewire modules', function() {
        this.revert = sms.__set__({
            os: {
                getNetworkInterfaces: function() {
                    return connections;
                }
            },
            server: {
                address: function() {
                    return { port: 2000 };
                }
            },
            messages: {
                create: function(options, callback) {
                    options.sid = 'unique sender id?';
                    options.uri = 'unique message uri';
                    callback(undefined, options);
                }
            }
        });
    });

    after('reset rewirings', function() {
        this.revert();
    });

    describe('#generateURL', function() {

        it('should generate the serer\'s URL', function() {
            var expected = 'http://preferred.one:2000';
            var actual = sms.__get__('generateURL')();
            expect(actual).to.equal(expected);
        });

        it('should fallback to less preferred connections', function() {
            delete connections.eth0;
            var expected = 'http://not.this.one:2000';
            var actual = sms.__get__('generateURL')();
            expect(actual).to.equal(expected);
        });
    });

    describe('#sendSMS', function() {

        it('should send a text message', function(done) {
            sms.sendSMS(123, '+447000000000', function(err, response) {
                if (!err) {
                    expect(response).to.be.a('object');
                    expect(response).not.to.be.empty();
                    expect(response.sid).to.be.a('string');
                    expect(response.sid).not.to.be.empty();
                    expect(response.uri).to.be.a('string');
                    expect(response.uri).not.to.be.empty();
                }
                done(err);
            });
        });
    });

});
