import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/chat/Sidebar';

const ChatLayout = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>

            <div className="flex h-screen w-screen overflow-hidden dark:bg-gradient-to-b from-[#242124] to-black dark:text-white">

                <Sidebar
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                />
                <main className="flex-1 flex">
                    {/* your dynamic child pages render here */}
                    <Outlet />
                </main>


            </div>


        </>
    )
}

export default ChatLayout;