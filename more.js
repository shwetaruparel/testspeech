var mediaConstraints = {
    audio: true,
	video:false
};
var synth = window.speechSynthesis;
var utterThis = new SpeechSynthesisUtterance();
var voices = speechSynthesis.getVoices();	

var mediaRecorder;
var blobURL;

function onMediaSuccess(stream) {
	console.log("I have created stream");
    window.streamReference = stream;
    $(function() {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav';
        mediaRecorder.audioChannels = 1;
        mediaRecorder.ondataavailable = function(blob) {
            // POST/PUT "Blob" using FormData/XHR2
            //blobURL = URL.createObjectURL(blob);
            //$("#result").append('<audio controls src="' + blobURL + '"></audio><br><a href="' + blobURL + '" target="_blank">' + blobURL + '</a>');
			console.log("I have some data "+blob.data);
		};
		stream.oninactive = function() {
			console.log('Stream ended');
			window.stream = stream; // make variable available to browser console
			audio.srcObject = stream;
            mediaRecorder.stop();

		};
		stream.onend= function(){
			console.log("No more sound");
		};
        mediaRecorder.start(5000 * 5000);
        setTimeout(function() {
            mediaRecorder.stop();
        }, 120 * 1000); //Se não clicar em parar, a gravação para automaticamente em 2 minutos.

    });
}

function onMediaError(e) {
    console.error('media error', e);
}

function onStop() {
    mediaRecorder.stop();
    mediaRecorder.stream.stop();
}

var interval;

function contadorIncremento() {
    var count = 1;
    interval = setInterval(function() {
        if (count > 1)
            $('.contador').html("setInterval: Ja passou " + count++ + " segundos!");
        else
            $('.contador').html("setInterval: Ja passou " + count++ + " segundo!");
    }, 1000);
}

function stopContadorIncremento() {
    clearTimeout(interval);
    $('.contador').html("");
}

$(function() {

    $(".play").on("click", function() {
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
        contadorIncremento();

    });

    $(".stop").on("click", function() {
		console.log("I am trying to stop");
        mediaRecorder.stop();
        stopContadorIncremento();

        if (window.streamReference) {
            window.streamReference.getAudioTracks().forEach(function(track) {
                track.stop();
            });

            window.streamReference.getVideoTracks().forEach(function(track) {
                track.stop();
            });

            window.streamReference = null;
        }
    });


});