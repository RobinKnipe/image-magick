/**
 * Created by robin on 31/08/15.
 */

$(function () {

    $('#text').click(function () {
        var userData = {
            name: $('#name').val(),
            number: $('#number').val()
        };
        var connection = Primus.connect();
        connection.on('data', function message(data) {
            console.log('Message from server', data);
            if (data && data.sessionId) { //connected
                if (!userData.sessionId) {
                    userData.sessionId = data.sessionId;
                }
                else { //reconnected
                    connection.write(userData);
                }
            }
            else if (data && data.imagePath) {
                $('#passportFileId').val(data.imagePath);
                $('#image').css('backgroundImage', 'url(\''+data.imagePath+'\')');
                $('#sumbit').disabled=false;
            }
        });
        connection.on('error', function error(err) {
            console.error('Something horrible has happened', err.stack);
        });
        connection.on('open', function open() {
            console.log('Connected');
            connection.write(userData);
        });
        this.disabled=true;
    });

    $('#sumbit').click(function () {
        var data = new FormData(document.forms[0]);
        window.alert(data);
    });

});
