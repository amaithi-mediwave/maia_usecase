import React, { useState, useEffect } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import './App.css';

import Typography from "@material-ui/core/Typography";
import WaveformVisualizer from "./WaveformVisualizer";
import { PulseLoader } from "react-spinners";
// import TranscribeOutput from "./TranscribeOutput";



function App() {

  const [transcription, setTranscription] = useState();
  const [recentTranscription, setrecentTranscription] = useState('');
  const [latestTranscription, setlatestTranscription] = useState('');
  const [error, setError] = useState('');
  const [recognizer, setRecognizer] = useState(null);
let transcription_array = []
  useEffect(() => {
    return () => {
      if (recognizer) {
        recognizer.close();
      }
    };
  }, [recognizer]);

  const startListening = async () => {
    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription("", "");
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

      const conversationTranscriber = new sdk.ConversationTranscriber(speechConfig, audioConfig);

      conversationTranscriber.sessionStarted = (s, e) => {
        console.log('Session started:', e.sessionId);
      };

      conversationTranscriber.sessionStopped = (s, e) => {
        console.log('Session stopped:', e.sessionId);
      };

      conversationTranscriber.canceled = (s, e) => {
        console.log('Canceled event:', e.errorDetails);
        setError(`Error: ${e.errorDetails}`);
        conversationTranscriber.stopTranscribingAsync();
      };

      conversationTranscriber.transcribed = (s, e) => {
        // console.log('Transcribed:', e.result.text);
        console.log("Speaker ID=" + e.result.speakerId + " TRANSCRIBED: Text=" + e.result.text);

        setTranscription((prevTranscription) => prevTranscription + e.result.text);
        // setTranscription(e.result.text);
        let data = {
          speaker: e.result.speakerId,
          text: e.result.text
        }
        // console.log(data.text)
        // data = ``
        // setTranscription((prevData) => [...prevData, data])
        // transcription_array.push(data)
        // console.log(transcription_array)

        // setTranscription((prevData) => [...prevData, e.result.text])
        
        // let id = 0

        // setTranscription.push({
        //   id: id++,
        //   speaker: e.result.speakerId,
        //   text: e.result.text
        // })
        // setrecentTranscription = transcription[transcription.length - 1]
        // // setrecentTranscription((prevTranscription) => prevTranscription
        // console.log(recentTranscription)
      };

      conversationTranscriber.startTranscribingAsync(
        () => {
          console.log('Continuous transcription started');
        },
        (err) => {
          console.error('Error starting continuous transcription:', err);
          setError(`Error starting continuous transcription: ${err}`);
        }
      );

      setRecognizer(conversationTranscriber);
    } catch (error) {
      console.error('Error initializing speech services:', error);
      setError(`Error initializing speech services: ${error.message}`);
    }
  };

  const stopListening = () => {
    if (recognizer) {
      recognizer.stopTranscribingAsync(
        () => {
          console.log('Continuous transcription stopped');
        },
        (err) => {
          console.error('Error stopping continuous transcription:', err);
          setError(`Error stopping continuous transcription: ${err}`);
        }
      );
    }
  };

  return (
    <div>
    <div className="title">
        <Typography variant="h3">
          Speech Transcripter {" "}
          <span role="img" aria-label="microphone-emoji">
            🎤
          </span>
        </Typography>
      </div>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <div>
        <h3>Transcription:</h3>
        {error && <p>Error: {error}</p>}
        <p>{transcription}</p>
        {/* <TranscribeOutput data={transcription} /> */}
        {/* <p>{recentTranscription}</p> */}
        {/* <p>{transcription}</p> */}
      </div>
    </div>


  );
};
export default App;
