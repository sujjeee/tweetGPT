import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { GrFormClose } from 'react-icons/gr';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

const Modal = ({ setClose }) => {
    const [apiKey, setApiKey] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleAddKey = (e) => {
        e.preventDefault();
        const encryptedKey = CryptoJS.AES.encrypt(apiKey, process.env.NEXT_PUBLIC_NEXTAUTH_KEY).toString();
        localStorage.setItem('apiKey', encryptedKey);
        setClose()
    };

    useEffect(() => {
        const localKey = localStorage.getItem("apiKey");
        if (localKey) {
            const decryptedKey = CryptoJS.AES.decrypt(localKey, process.env.NEXT_PUBLIC_NEXTAUTH_KEY).toString(CryptoJS.enc.Utf8);
            setApiKey(decryptedKey);
        }
    }, []);


    return (
        <div className="fixed z-10 overflow-y-auto top-0 w-full left-0" >
            <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 backdrop-blur-xl" />
                </div>
                <span className="inline-block align-middle h-[80vh] sm:h-screen">&#8203;</span>
                <div className="inline-block align-center rounded-lg text-left shadow-xl sm:my-8 sm:align-middle max-w-[450px] w-full" >
                    <div className="relative bg-white rounded-lg shadow border">
                        <button
                            onClick={setClose}
                            type="button"
                            className="absolute top-3 right-2.5  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                            <GrFormClose
                                size={25}
                                className="text-gray-200" />
                        </button>
                        <div className="px-6 py-12 lg:px-8">
                            <form onSubmit={handleAddKey}>
                                <div className='relative'>
                                    <h3 className="mb-4 text-xl font-medium text-gray-900 ">Enter Your API Key</h3>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                                        required />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 top-11 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <AiOutlineEye className="text-xl text-gray-400" />
                                        ) : (
                                            <AiOutlineEyeInvisible className="text-xl text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                <div className='text-xs pt-1.5 pl-0.5'>
                                    Find your free API key
                                    <a href="https://platform.openai.com/account/api-keys" className="ml-1 underline text-blue-500">here</a>.
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 tracking-wider">Add my key</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal