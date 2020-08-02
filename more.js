var mediaConstraints = {
    audio: true,
	video:false
};
var synth = window.speechSynthesis;
var utterThis = new SpeechSynthesisUtterance();
var voices = speechSynthesis.getVoices();	

var mediaRecorder;
var blobURL;
alert('Your browser version is reported as ' + navigator.appVersion);
const recorder = document.getElementById('recorder');
//const player = document.getElementById('player');
if (navigator.mediaDevices === undefined) {
	console.log("seems to be new browser");
  navigator.mediaDevices = {};
}
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
}

// List cameras and microphones.

navigator.mediaDevices.enumerateDevices()
.then(function(devices) {
  devices.forEach(function(device) {
    console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
  });
})
.catch(function(err) {
  console.log(err.name + ": " + err.message);
});
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
			//audio.srcObject = stream;
            //mediaRecorder.stop();

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
    console.log('media error', e);
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
		console.log("I clicked on play");
		if (navigator.mediaDevices.getUserMedia == undefined) {
			console.log("I am modern browser");
		  navigator.mediaDevices.getUserMedia = function(constraints) {

			// First get ahold of the legacy getUserMedia, if present
			var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

			// Some browsers just don't implement it - return a rejected promise with an error
			// to keep a consistent interface
			if (!getUserMedia) {
			  return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
			}

			// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
		};
		 
		}
				navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);	

		console.log(" I am trtying to update the result");
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