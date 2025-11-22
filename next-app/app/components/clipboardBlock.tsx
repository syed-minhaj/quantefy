"use client"
import { ClipboardClock } from "lucide-react";
import { useState } from "react";

const ClipboardBlock = ({ text} : { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto ">
            <div className="relative flex items-center justify-between w-full p-3 bg-bg2 border border-input rounded-md shadow-sm group">
                <code className="flex-1 mr-4 text-sm  font-mono break-all whitespace-pre-line overflow-hidden">
                    {text}
                </code>
                <button
                    onClick={handleCopy}
                    className={`
                        flex items-center justify-center px-3 py-1.5 text-xs font-medium transition-all duration-200 border rounded shadow-sm focus:outline-none
                        ${isCopied 
                        ? "bg-green-100 text-green-700 border-green-300" 
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                        }
                    `}
                    aria-label="Copy to clipboard"
                >
                {isCopied ? (
                    <>
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        Copy
                    </>
                )}
                </button>
            </div>
        </div>
    );
};

export default ClipboardBlock;