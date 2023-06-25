import React, { useState } from 'react';
import '../App.css';
import { process } from "../env";
import {Configuration, OpenAIApi} from 'openai'

export default function CreateAiCaption() {

  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(configuration);

  async function fetchBotReply(userInput) {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Generate a tweet style, creative caption using the user input
      ###
      userInput: Beautiful mountain range in Mestia, Georgia, we went Skiing that day
      output: Just had the most incredible skiing adventure in Mestia, Georgia! The beautiful mountains took my breath away. The fresh powder, stunning vistas, and adrenaline rush made it an unforgettable experience. Highly recommend exploring this winter wonderland! 🎿❄️
      ###
      userInput: ${userInput}
      output: `,
      max_tokens: 100,
      temperature: 1
    })
    setDisplayValue(response.data.choices[0].text.trim())
    //return response.data.choices[0].text.trim();
  }

  function handleChange(e) {
    setInputValue(e.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    fetchBotReply(inputValue)
    setInputValue('');
  };

  function handleCopy() {
    navigator.clipboard.writeText(displayValue).then(() => {
      alert("copied to clipboard");
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Can't think of a good caption? Ask our super creative AI to come up with something fun 🌼</h3>
        <input type='text' name='user-input' value={inputValue} id='user-input' onChange={handleChange}/>
        <button type='submit'>Generate caption</button>
      </form>
      <div className='ai-response'>
        <h4>{displayValue}</h4>
        <button onClick={handleCopy}>Copy Text</button>
      </div>
    </div>
  )

}
