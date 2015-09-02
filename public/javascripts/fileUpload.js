/**
 * Created by robin on 28/08/15.
 */

function imageUploadSuccess(result) {
    if (result && result==='File received!') {
        //$('#passportFileId').val(result.imagePath);
        $('#imageUpload .status').text('Passport image uploaded successfully');
    }
    else {
        imageUploadFailed('Unknown failure.');
        console.log(result);
    }
    $('#imageUpload progress').hide();
}

function imageUploadFailed(err) {
    $('#imageUpload progress').hide();
    var errText = err.responseText || err;
    $('#imageUpload .status').text('Passport image upload failed. ' + errText + ' Please try again.');
}

$(function () {
    //$('#trigger').click(function (e) {
    //    e.preventDefault();
    //    $('#upload').click();
    //    return false;
    //});

    $('#upload').change(function () {

        if (!this.files[0]) {
            return true;
        }

        var data = new FormData();
        data.append(this.name, this.files[0]);
        //var _id = $('input[name="_id"]').val();
        var _id = /sessionId=([^&]+)(?:&|$)/.exec(location.search)[1];
        data.append('sessionId', _id);
        //var csrf = $('input[name="_csrf"]').val();
        //data.append('_csrf', csrf);

        $.ajax('/upload', {
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            xhr: function () {  // custom xhr to quietly report progress
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress',
                        function (progress) {
                            var total = progress.total || progress.totalSize;
                            var value = progress.loaded || progress.position;
                            console.log('progress: %d/%d', value, total);
                            $('#imageUpload progress')
                                .show()
                                .attr({
                                    max: total,
                                    value: value
                                });
                        },
                        false);
                }
                return myXhr;
            },
            success: imageUploadSuccess,
            error: imageUploadFailed
        });
        //$('#imageUpload .status').text('Upload in progress...');
        console.log('sending passport image...');

    });
});
