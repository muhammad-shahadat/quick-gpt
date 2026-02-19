import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'





const CodeBlock = ({ language, children, ...rest }) => {

   const codeContent = String(children).replace(/\n$/, '');

   const [copied, setCopied] = useState(false);
   const handleCopy = () => {
      navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => {
         setCopied(false)
      }, 2000);

   }



   return (
      <>
         <button
            onClick={handleCopy}
            className="absolute right-2 top-2 px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-all cursor-pointer"
         >
            {copied ? 'Copied!' : 'Copy'}
         </button>

         <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            {...rest}
         >
            {codeContent}
         </SyntaxHighlighter>

      </>
   )
}

export default CodeBlock