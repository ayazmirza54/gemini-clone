

import { useState } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from './components/mode-toggle';
import './App.css';
import { Textarea } from './components/ui/textarea';
import ReactMarkdown from 'react-markdown';


interface ChatItem {
  role: string;
  parts: string[];
  avatar: string; // Add avatar field
}

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chathistory, setChatHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);

  const getresponse = async () => {
    if (!value) {
      setError("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chathistory,
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();

      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        { role: "user :", parts: [value], avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Bob' }, // Add user avatar URL
        { role: "AI buudy :", parts: [data], avatar: 'https://api.dicebear.com/7.x/bottts/svg' }  // Add model avatar URL
      ]);

      setValue("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className='m-4 p-4'>
  <div className='flex justify-end items-center'>
    <ModeToggle />
  </div>
  <br />
  <div className='header flex flex-row justify-center items-center'>
    <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
      <div className='flex flex-row justify-center items-center gap-2'>
        Welcome to <img src='https://api.dicebear.com/7.x/bottts/svg' className='h-8 w-8 lg:h-10 lg:w-10'></img> AI buddy
      </div>
    </h1>
  </div>
  <div className='flex flex-col lg:flex-row p-4 m-4 justify-center items-center'>
    <div className="lg:w-3/4 w-full h-full">
      <Textarea
        placeholder="Type your prompt here."
        id="message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
    <div className="lg:w-1/4 flex justify-center items-center mt-4 lg:mt-0">
      {!loading && !error && <Button onClick={getresponse} className='ml-4'>Send to AI</Button>}
      {loading && <div className="loader"></div>}
      <Button className='ml-4' onClick={() => { setError(""); setValue(""); setChatHistory([]); }}>Clear</Button>
    </div>
  </div>
</div>

      {error && <div className='error'>{error}</div>}
     
    
      <div className='search-result px-8 mx-8 flex flex-col justify-start items-start'>
  {chathistory.map((chatItem, index) => (
    <div key={index} className={`chat-item ${chatItem.role === 'user :' ? 'user-message' : 'model-message'}`}>
      <div className='avatar flex flex-row justify-start items-center'>
        <img src={chatItem.avatar} alt={`${chatItem.role} avatar`} className="avatar-image" />
        <p className='message-text'>{chatItem.role}</p>
      </div>
      <div className='message-container'>
        
        <div className='answer'>
          {chatItem.role === 'user' ? (
            <p>{chatItem.parts}</p>
          ) : (
            <ReactMarkdown>{chatItem.parts.join(' ')}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  ))}
</div>


    </ThemeProvider>
  )
}

export default App;

