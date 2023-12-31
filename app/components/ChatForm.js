
import React, { useState, useRef } from "react";

const ChatForm = ({ prompt, setPrompt, onSubmit, handleAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recordingStatus, setRecordingStatus] = useState('');


  function processAudio(audioBlob, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
        const base64data = reader.result;
        callback(base64data);
    };
    reader.onerror = () => {
        console.error("Error processing audio");
    };
}

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      setIsRecording(true);
      setRecordingStatus('Recording...');
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });  
        // Create a File object from the Blob        
        setIsRecording(false);
        setRecordingStatus('Recorded Successfully');
        setTimeout(() => setRecordingStatus(''), 3000);

        processAudio(audioBlob, (processedAudio) => {
          handleAudio(processedAudio);
        });
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(prompt);
    setPrompt("");
    event.target.rows = 1;
  };
  const handleKeyDown = (event) => {
    console.log("key down");
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <footer className="z-10 fixed bottom-0 left-0 right-0 bg-slate-100 border-t-2">
      <div className="container max-w-2xl mx-auto p-5 pb-8">
        <form className="w-full flex" onSubmit={handleSubmit}>
        <button
          id="recordButton"
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          className={isRecording ? 'recording-button' : 'normal-button'}
        >
        <i className="fa fa-microphone"></i>
        </button>        
          <textarea
            autoComplete="off"
            autoFocus
            name="prompt"
            className="flex-grow block w-full rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:leading-6"
            placeholder="Send a message"
            required={true}
            value={prompt}
            rows={1}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={(e) => {
              const lineCount = e.target.value.split("\n").length;
              e.target.rows = lineCount > 10 ? 10 : lineCount;
            }}
          />
          <button
            className="bg-gray-600 hover:bg-gray-800 items-center font-semibold text-white rounded-r-md px-5 py-3"
            type="submit"
          >
            Chat
          </button>
        </form>
      </div>
    </footer>
  );
};

export default ChatForm;
