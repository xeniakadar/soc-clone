import React, { useState } from 'react';
import '../App.css';
import { process } from "../env";
import {Configuration, OpenAIApi} from 'openai'
import { Disclosure } from '@headlessui/react'

import ChevronUpIcon from './images/chevronUp.svg';

export default function CreateAiCaption() {

  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [copyText, setCopyText] = useState('Copy Text')

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
      setCopyText("Copied Text ✅")
    })
  }

  return (
    <div className='mb-5 bg-super-light-green'>
      <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-sage px-4 py-2 text-left text-sm font-medium text-purple-900 hover:opacity-80 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Can't think of a good caption?</span>
                <img src={ChevronUpIcon}
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-purple-500`}
                 alt="open"/>
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 w-full pt-4 pb-2 text-sm text-gray-500 flex flex-col  bg-bone rounded-lg">
              <h1>Ask our super creative AI to come up with something fun 🌼</h1>
              <input className='create--text-input mt-5 mb-2 p-1 sm:w-48 rounded-sm' placeholder='Describe your photo...' type='text' name='user-input' value={inputValue} id='user-input' onChange={handleChange}/>
              <button className='create--submit-btn ring-offset-2 w-32 text-white  focus:outline-none focus:ring- bg-sage rounded-lg py-2.5 text-md font-medium leading-5 ' onClick={handleSubmit}>Generate caption</button>

              {displayValue &&
                <>
                  <h4 className='py-2 bg-ivory my-2 p-2 rounded-md'>{displayValue}</h4>
                  <button className='copy-btn create--submit-btn ring-offset-2 w-32 text-white  focus:outline-none focus:ring- bg-sage rounded-lg py-2.5 text-md font-medium leading-5' onClick={handleCopy}>{copyText}</button>
                </>
              }

              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
    </div>
  )

}
