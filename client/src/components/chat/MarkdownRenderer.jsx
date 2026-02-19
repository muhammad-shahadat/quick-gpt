import React from 'react'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import CodeBlock from './CodeBlock';


const MarkdownRenderer = ({ content }) => {

   const markdownComponents = {
      code({ node, inline, className, children, ...rest }) {

         const match = /language-(\w+)/.exec(className || '');

         return !inline && match ? (
            <div className='relative group'>
               <CodeBlock
                  language={match[1]}
                  {...rest}
               >
                  {children}
               </CodeBlock>
            </div>
         ) :
            (
               <code
                  className={className}
                  {...rest}
               >
                  {children}
               </code>
            )


      }
   }

   return (
      <div>
         <Markdown
            components={markdownComponents}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
         >
            {content}
         </Markdown>
      </div>
   )
}

export default MarkdownRenderer