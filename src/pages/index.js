import React, { useEffect, useRef, useState } from 'react'
import DropDown from '@/components/DropDown';
import Modal from '@/components/Modal';
import { tweettypes, tweetvibes } from '@/utils/datatypes';
import Head from 'next/head';
import { ImTwitter, ImGithub, ImKey } from 'react-icons/im';
import { toast, Toaster } from 'react-hot-toast';

const index = () => {
  const [apiKey, setApiKey] = useState('')
  const [vibe, setVibe] = useState("Casual");
  const [type, setType] = useState("Tweet");
  const [tweet, setTweet] = useState("");
  const [generatedTweets, setGeneratedTweets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const localKey = localStorage.getItem("apiKey");
    setApiKey(localKey);
  }, [openModal]);

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const prompt = `I want you to generate 2 tweets based on the following information:

  - Tweet Text: ${tweet}
  - Tweet Vibe: ${vibe}
  - Tweet Type: ${type}

  For each tweet, please use natural language processing techniques to generate a message that matches the provided vibe and type of tweet. The tweets should be no longer than 280 characters each. 

  For the first tweet, please focus on conveying the main message of the input text in a way that matches the provided vibe and type.

  For the second tweet, please focus on generating a tweet that complements or expands on the message of the first tweet, again matching the provided vibe and type.

  and don't forget to clearly labeled "1." and "2." on both tweets.`

  const generateBio = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt, apiKey
      }),
    });

    if (!response.ok) {
      setLoading(false)
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error;
      toast.error(errorMessage)
    } else {
      const responseText = await response.text();
      const responseObject = JSON.parse(responseText);
      const restweets = responseObject.data.split("\n").filter((tweet) => tweet !== "");
      setGeneratedTweets(restweets);
      setTimeout(() => {
        window.scrollBy({ top: 500, left: 0, behavior: 'smooth' });
        setLoading(false);
      }, 1000)
    }
  };

  return (
    <>
      <Head>
        <title>TweetsGPT - Generate tweets for you.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='relative'>

        {/* for display toast */}
        <Toaster />

        {/* to open and close modal */}
        {openModal && <Modal setClose={handleModalClose} />}

        <div className='absolute top-5 right-4 sm:right-5 space-x-2 flex'>
          <div className='group'>
            <div
              onClick={() => setOpenModal(true)}
              className='p-2 shadow-2xl opacity-80 rounded-full bg-gradient-to-br from-blue-600 to-purple-800 group-hover:from-white group-hover:to-white'>
              <ImKey size={15}
                className='text-white group-hover:text-black'
                data-te-toggle="tooltip"
                title="Set your API key" />
            </div>
          </div>
          <a href="http://twitter.com/sujjeeee" target="_blank">
            <div className='group'>
              <div className='p-2 shadow-2xl opacity-80 rounded-full bg-gradient-to-br from-blue-600 to-purple-800 group-hover:from-white group-hover:to-whit'>
                <ImTwitter size={15}
                  className='text-white group-hover:text-black'
                  data-te-toggle="tooltip"
                  title="Follow on twitter" />
              </div>
            </div>
          </a>
          <a href="http://github.com/sujjeee" target="_blank">
            <div className='group'>
              <div className='p-2 shadow-2xl opacity-80 rounded-full bg-gradient-to-br from-blue-600 to-purple-800 group-hover:from-white group-hover:to-white'>
                <ImGithub size={15}
                  className='text-white group-hover:text-black'
                  data-te-toggle="tooltip"
                  title="Star on Github" />
              </div>
            </div>
          </a>
        </div>

        <div className='max-w-5xl flex flex-col justify-center items-center mx-auto sm:py-24 py-[68px] '>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-purple-800 flex items-center tracking-wide py-10">
            TweetsGPT
          </h1>
          <section className='flex flex-col max-w-xl w-full px-4 gap-5'>
            <div>
              <p className="my-2 text-gray-600 font-bold px-0.5">1. Select your vibe and type of tweet</p>
              <div className="w-full flex gap-2">
                <DropDown
                  vibe={vibe}
                  setVibe={(newVibe) => setVibe(newVibe)}
                  themes={tweetvibes} />
                <DropDown
                  vibe={type}
                  setVibe={(type) => setType(type)}
                  themes={tweettypes} />
              </div>
            </div>
            <div>
              <p className="my-2 text-gray-600 font-bold px-0.5">2. Write about your tweet</p>
              <textarea
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                rows={8}
                className="w-full rounded-md border border-gray-300 shadow-sm p-4 focus:border-black focus:ring-black "
                placeholder={
                  "What's on your mind? Type your random thoughts here..."
                }
                required />
            </div>
            {!loading
              ? <button
                type='submit'
                onClick={generateBio}
                className="bg-gradient-to-br to-blue-600 from-purple-800 rounded-md text-white font-medium px-4 py-2 w-full">
                Generate your tweet &rarr;
              </button>
              : <button
                type='submit'
                onClick={generateBio}
                className="bg-gradient-to-br to-blue-600 from-purple-800 rounded-md text-white font-medium px-4 py-2   w-full"
              >
                Generating....
              </button>
            }

            <div id='refId' >
              {generatedTweets.length !== 0 && (
                <div className="mt-28 sm:mt-32" >
                  <div className='flex flex-col justify-center items-center'>
                    <div className='mb-5'>
                      <h2
                        className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br to-blue-600 from-purple-800 flex items-center tracking-wide"
                      >
                        Generated Tweets
                      </h2>
                    </div>
                  </div>

                  {generatedTweets.map((tweets, index) => {
                    const withBlueHashtags = tweets.replace(
                      /#(\w+)/g,
                      '<span style="color: #2563eb; font-weight: bold;">$&</span>'
                    );
                    return (
                      <div
                        onClick={() => {
                          navigator.clipboard.writeText(generatedTweets);
                          toast("Tweet copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        className="relative my-5 "
                        key={index}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-800 to-blue-600 rounded-lg blur opacity-25  transition duration-1000"></div>
                        <div className="relative px-7 py-6 bg-white ring-1 hover:bg-slate-100 rounded-lg leading-[1.3] flex font-normal ">
                          <div >
                            <p
                              className="text-slate-800 "
                              dangerouslySetInnerHTML={{ __html: withBlueHashtags }}></p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

    </>
  )
}

export default index