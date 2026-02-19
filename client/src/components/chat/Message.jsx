import React from 'react'
import moment from 'moment'
import MarkdownRenderer from './MarkdownRenderer'


import { assets } from '../../assets/assets'






const Message = ({ message }) => {

    return (
        <div>
            {
                message.role === "user" ? (
                    <div className='flex items-start justify-end my-4 gap-2'>
                        <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317c]/30 border border-[#80609f]/30 rounded-md max-w-2xl'>
                            <p className='text-[15px] dark:text-primary'>{message.content}</p>
                            <span className='text-xs text-gray-400 dark:text-[#b1a6c0]'>{moment(message.timestamp).fromNow()}</span>
                        </div>
                        <img src={assets.user_icon} className='w-8 rounded-full' alt="" />
                    </div>
                ) : (
                    <div className='inline-flex flex-col gap-2 p-2 max-w-2xl dark:bg-[#57317c]/30'>
                        {
                            message.isImage ? (
                                <img src={message.content} className='w-full max-w-md mt-2 rounded-md' alt="" />
                            ) : (
                                <div className="prose prose-sm dark:prose-invert max-w-none text-[16px] prose-p:leading-relaxed">
                                    <MarkdownRenderer content={message.content} />
                                </div>
                            )
                        }

                    </div>
                )
            }
        </div>
    )

}

export default Message