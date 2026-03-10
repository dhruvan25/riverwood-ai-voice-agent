function speak(text){

const speech=new SpeechSynthesisUtterance(text)

speech.lang="en-IN"

speech.rate=1

speech.pitch=1

speechSynthesis.speak(speech)

}

function startVoice(){

const recognition=new(window.SpeechRecognition||window.webkitSpeechRecognition)()

recognition.lang="en-IN"

recognition.start()

recognition.onresult=function(e){

document.getElementById("messageInput").value=e.results[0][0].transcript

}

}
