"use client";

import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import Image from "next/image";
import axios from "axios";

export default function OCRUpload() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image) URL.revokeObjectURL(image);
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setText("");
      setResponse("");
      setLoading(true);

      Tesseract.recognize(imageUrl, "eng").then((result) => {
        setText(result.data.text);
        setLoading(false);
        getChatGPTResponse(result.data.text);
      });
    }
  };

  const getChatGPTResponse = async (ocrText) => {
    const options = {
      method: "POST",
      url: "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      headers: {
        "x-rapidapi-key": "24fb306253mshf7a6c4356ada724p19e42fjsn8e439798ae23",
        "x-rapidapi-host":
          "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
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
      const response = await axios.request(options);
      setResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTryDifferentImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleReset = () => {
    if (image) URL.revokeObjectURL(image);
    setImage(null);
    setText("");
    setResponse("");
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Image to Answer Chatbot
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 bg-gray-50 p-6 rounded-xl shadow-lg w-full max-w-6xl">
        {/* LEFT SIDE: Image Upload */}
        <div className="lg:w-1/2 space-y-6">
          {!image && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          )}

          {image && (
            <div className="space-y-4">
              <div className="relative w-full h-96 border rounded overflow-hidden">
                <Image
                  src={image}
                  alt="Selected"
                  layout="fill"
                  objectFit="contain"
                  className="rounded"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleTryDifferentImage}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                  Try Different Image
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: OCR + ChatGPT */}
        <div className="lg:w-1/2 space-y-4">
          {loading && (
            <p className="text-blue-600 font-medium">Processing image…</p>
          )}

          {text && (
            <div className="bg-white p-4 rounded shadow whitespace-pre-wrap border">
              <h3 className="text-lg font-bold mb-2">Extracted Text:</h3>
              {text}
            </div>
          )}

          {response && (
            <div className="bg-white p-4 rounded shadow whitespace-pre-wrap border">
              <h3 className="text-lg font-bold mb-2">Chatbot Answer:</h3>
              {response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
