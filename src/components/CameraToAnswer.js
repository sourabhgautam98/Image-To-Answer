"use client";

import { useRef, useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";

export default function CameraToChatbot() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStream(stream);
      videoRef.current.play();
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    const width = 640;
    const height = 480;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/png");
    setPhoto(dataUrl);
    stopCamera();

    processOCR(dataUrl);
  };

  const processOCR = (imageDataUrl) => {
    setLoading(true);
    Tesseract.recognize(imageDataUrl, "eng")
      .then((result) => {
        setText(result.data.text);
        getChatGPTResponse(result.data.text);
      })
      .finally(() => setLoading(false));
  };

  const getChatGPTResponse = async (ocrText) => {
    const options = {
      method: "POST",
      url: "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      headers: {
        "x-rapidapi-key": "73a2c1a1a5mshd4bf04c2e6d6820p16d9b2jsn0edcf5c4ffdb",
        "x-rapidapi-host": "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        messages: [
          {
            role: "user",
            content: `Please process the following text: ${ocrText}`,
          },
        ],
        model: "gpt-4o",
        max_tokens: 100,
        temperature: 0.9,
      },
    };

    try {
      const res = await axios.request(options);
      setResponse(res.data.choices[0].message.content);
    } catch (err) {
      console.error("ChatGPT Error:", err);
      setResponse("Error getting response from ChatGPT.");
    }
  };

  const retake = () => {
    setPhoto(null);
    setText("");
    setResponse("");
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 pt-8">
      <h1 className="text-2xl font-bold mb-4">Camera OCR Chatbot</h1>

      {!photo ? (
        <>
          <video ref={videoRef} className="rounded-md w-full max-w-md" autoPlay playsInline />
          <button
            onClick={takePhoto}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
          >
            Take Photo
          </button>
        </>
      ) : (
        <>
          <img src={photo} alt="Captured" className="rounded-md w-full max-w-md" />
          <button
            onClick={retake}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            Retake Photo
          </button>
        </>
      )}

      {loading && <p className="mt-4 text-blue-400">Processing image…</p>}

      {text && (
        <div className="bg-white text-black mt-6 p-4 rounded w-full max-w-md whitespace-pre-wrap">
          <h2 className="font-bold mb-2">Extracted Text:</h2>
          {text}
        </div>
      )}

      {response && (
        <div className="bg-white text-black mt-4 p-4 rounded w-full max-w-md whitespace-pre-wrap">
          <h2 className="font-bold mb-2">Chatbot Response:</h2>
          {response}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
