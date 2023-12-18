"use client";

import { useEffect, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";
import SlideOver from "./components/SlideOver";
import EmptyState from "./components/EmptyState";
import { Cog6ToothIcon, CodeBracketIcon } from "@heroicons/react/20/solid";
import { useChat, useCompletion } from "ai/react";
import { Toaster, toast } from "react-hot-toast";


function approximateTokenCount(text) {
  return Math.ceil(text.length * 0.4);
}

const VERSIONS = [
  {
    name: "Llama 2 7B",
    version: "13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",
    shortened: "7B",
  },
  {
    name: "Llama 2 13B",
    version: "f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d",
    shortened: "13B",
  },
  {
    name: "Llama 2 70B",
    version: "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
    shortened: "70B",
  },
];

const LANGUAGES = [
  {name: "Portuguese",},

  {name: "English",},  

  {name: "Bengali",},

  {name: "Catalan",},

  {name: "Czech",},

  {name: "Danish",},

  {name: "Dutch",},  

  {name: "Estonian",},

  {name: "Finnish",},

  {name: "French",},

  {name: "German",},

  {name: "Hindi",},

  {name: "Indonesian",},

  {name: "Italian",},

  {name: "Japanese",},

  {name: "Korean",},

  {name: "Maltese",},

  {name: "Mandarin Chinese",},

  {name: "Modern Standard Arabic",},

  {name: "Northern Uzbek",},

  {name: "Polish",},  

  {name: "Romanian",},

  {name: "Russian",},

  {name: "Slovak",},

  {name: "Spanish",},

  {name: "Swahili",},

  {name: "Swedish",},

  {name: "Tagalog",},

  {name: "Telugu",},

  {name: "Thai",},

  {name: "Turkish",},

  {name: "Ukrainian",},

  {name: "Urdu",},

  {name: "Vietnamese",},

  {name: "Welsh",},

  {name: "Western Persian",},

];

function CTA({ shortenedModelName }) {
  return (
    <a
      href="https://replicate.com/blog/run-llama-2-with-an-api?utm_source=project&utm_campaign=llama2ai"
      target="_blank"
      className="underline"
    >
      Run and fine-tune Llama 2 in the cloud.
    </a>
  );

}

export default function HomePage() {
  const MAX_TOKENS = 4096;
  const bottomRef = useRef(null);
  const [chatMessages, setchatMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  //   Llama params
  const [size, setSize] = useState(VERSIONS[2]); // default to 7B
  const [language, setLanguage] = useState(LANGUAGES[0]); // default to Portuguese
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é um assistente brasileiro prestativo. Portanto, converse apenas em português. "
    // "You're a helpful assistant."
  );
  const [temp, setTemp] = useState(0.75);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(800);
  
  const [audio, setAudio] = useState(null);
  const [responseAudio, setResponseAudio] = useState(null);
  const [input_text, setInputText] = useState(null);
  const [task_name, setTaskName] = useState("S2TT (Speech to Text translation)");
  // const [input_text_language, setInputTextLanguage] = useState("English");
  const [max_input_audio_length, setMaxInputAudioLength] = useState(60);
  // const [target_language_text_only, setTargetLanguageTextOnly] = useState("English");
  // const [target_language_with_speech, setTargetLanguageWithSpeech] = useState("English");

  const { complete, completion, setInput, input, isLoading: llamaLoading } = useCompletion({
    api: "/apillama",
    body: {
      version: size.version,
      systemPrompt: systemPrompt,
      temperature: parseFloat(temp),
      topP: parseFloat(topP),
      maxTokens: parseInt(maxTokens),      
    },
    onError: (error) => {
      setError(error);
    },
  });

  const {messages, isLoading, append} = useChat({
    api: "/apim4t",
    body: {
      task_name: task_name,
      input_audio: audio,
      input_text: input_text,
      input_text_language: language.name,
      max_input_audio_length: max_input_audio_length,
      target_language_text_only: language.name,
      target_language_with_speech: language.name,
    },
    onError: (error) => {
      setError(error);
    },
  });

  const handleAudio = (file) => {
    if (file) {        
        setTaskName("ASR (Automatic Speech Recognition)");
        // setInputTextLanguage("Portuguese");
        setMaxInputAudioLength(180);
        // setTargetLanguageTextOnly("Portuguese");
        // setTargetLanguageWithSpeech("Portuguese");
        setAudio(file);
        toast.success(
          "Audio sent successfully."
        );      
    }
    else
    {
      toast.error(
        `Sorry, something went wrong`
        );
    }    
  };

  const setAndSubmitPrompt = (newPrompt) => {
    handleSubmit(newPrompt);
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    setSystemPrompt(event.target.systemPrompt.value);
  };

  const handleSubmit = async (userMessage) => {
    const SNIP = "<!-- snip -->";
    
    const messageHistory = [...chatMessages];    
    if (completion.length > 0) {
      messageHistory.push({
        text: completion,
        isUser: false,
        audioSrc: responseAudio,
      });      
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
      audioSrc: audio,
    });

    const generatePrompt = (chatMessages) => {
      return chatMessages
        .map((message) =>
          message.isUser ? `[INST] ${message.text} [/INST]` : `${message.text}`
        )
        .join("\n");
    };

    // Generate initial prompt and calculate tokens
    let prompt = `${generatePrompt(messageHistory)}\n`;
    // Check if we exceed max tokens and truncate the message history if so.
    while (approximateTokenCount(prompt) > MAX_TOKENS) {
      if (messageHistory.length < 3) {
        setError(
          "Your message is too long. Please try again with a shorter message."
        );

        return;
      }

      // Remove the third message from history, keeping the original exchange.
      messageHistory.splice(1, 2);

      // Recreate the prompt
      prompt = `${SNIP}\n${generatePrompt(messageHistory)}\n`;
    }
    setResponseAudio(null);
    setchatMessages(messageHistory);

    complete(prompt);
  };



  const sendAudio = async () => {
    if (audio)
      await append(["Sending Audio"]);
    
  }
  
  const sendLlamaText = async () => {
    if (input_text)
      await append(["Sending Llama response"]);    
  }

  useEffect(() => {    
    sendAudio()
  }, [audio]);

  useEffect(() => {    
    sendLlamaText()
  }, [input_text]);

    useEffect(() => {
      if(messages.length > 0 && messages.at(messages.length - 1).role == "assistant")
      {
        const output = messages.at(messages.length - 1).content;
        const indexOfColon = output.indexOf(':');
        if (indexOfColon !== -1) {
          const type = output.substring(0, indexOfColon); // 'audio' or 'text'
          const content = output.substring(indexOfColon + 1); // the actual content after 'audio:' or 'text:'
          if (type == 'audio'){            
            setResponseAudio(content);
          }
          else
            handleSubmit(content);
        }
      }
    }, [messages]);

    useEffect(() => {
      if(isLoading)
      {
        const timer = setTimeout(() => {
          toast.loading("Our model is starting, please wait...", {          
            id:300
          });
        }, 1000);
        return () => clearTimeout(timer);        
      }
      else
      {
        toast.remove(300)
      }
      
    },[isLoading])

    useEffect(() => {
      if(!llamaLoading && completion.length > 0)
      {
        setAudio(null);
        setTaskName("T2ST (Text to Speech translation)");
        // setInputTextLanguage("Portuguese");
        setMaxInputAudioLength(180);
        // setTargetLanguageTextOnly("Portuguese");
        // setTargetLanguageWithSpeech("Portuguese");
        setInputText(completion);        
      }
    },[llamaLoading])

  useEffect(() => {
    if (!localStorage.getItem("toastShown")) {
      toast.success(
        "We just updated our 7B model — it's super fast. Try it out!"
      );
      localStorage.setItem("toastShown", "true");
    }
  }, []);

  

  useEffect(() => {
    if (chatMessages?.length > 0 || completion?.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }    
  }, [chatMessages, completion]);

  return (
    <>
      <div className="bg-slate-100 border-b-2 text-center p-3">
        Powered by Replicate. <CTA shortenedModelName={size.shortened} />
      </div>
      <nav className="grid grid-cols-2 pt-3 pl-6 pr-3 sm:grid-cols-3 sm:pl-0">
        <div className="hidden sm:inline-block"></div>
        <div className="font-semibold text-gray-500 sm:text-center">
          {size.shortened == "Llava"
            ? "🌋"
            : size.shortened == "Salmonn"
              ? "🐟"
              : "🦙"}{" "}
          <span className="hidden sm:inline-block">Chat with</span>{" "}
          <button
            className="py-2 font-semibold text-gray-500 hover:underline"
            onClick={() => setOpen(true)}
          >
            {size.shortened == "Llava" || size.shortened == "Salmonn"
              ? size.shortened
              : "Llama 2 " + size.shortened}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setOpen(true)}
          >
            <Cog6ToothIcon
              className="w-5 h-5 text-gray-500 sm:mr-2 group-hover:text-gray-900"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>

      <Toaster position="top-left" reverseOrder={false} />

      <main className="max-w-2xl pb-5 mx-auto mt-4 sm:px-4">
        <div className="text-center"></div>
        {chatMessages.length == 0 && (
          <EmptyState setPrompt={setAndSubmitPrompt} setOpen={setOpen} />
        )}

        <SlideOver
          open={open}
          setOpen={setOpen}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          handleSubmit={handleSettingsSubmit}
          temp={temp}
          setTemp={setTemp}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          topP={topP}
          setTopP={setTopP}
          versions={VERSIONS}
          languages={LANGUAGES}
          size={size}
          setSize={setSize}
          language={language}
          setLanguage={setLanguage}
        />

        <ChatForm
          prompt={input}
          setPrompt={setInput}
          onSubmit={handleSubmit}
          handleAudio={handleAudio}
        />

        {error && <div>{error}</div>}

        <article className="pb-24">
          {chatMessages.map((message, index) => (
            <Message
              key={`message-${index}`}
              message={message.text}
              isUser={message.isUser}
              audioSrc={message.audioSrc}
            />
          ))}
          <Message message={completion} isUser={false} audioSrc={responseAudio} />
          <div ref={bottomRef} />
        </article>
      </main>
    </>
  );
}
