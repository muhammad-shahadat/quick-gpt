import React, { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import {Toaster} from 'react-hot-toast'

import ChatBox from './components/chat/ChatBox'
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { assets } from './assets/assets';
import { useAppContext } from './context/useContext';
import Login from './pages/Login';
import Sidebar from './components/chat/Sidebar';
import VerifyAccount from './pages/VerifyAccount';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './pages/Loading';




const App = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, userLoading } = useAppContext();




    if(userLoading) {

        return <Loading />
    }
        

    return (
        <>

            <Toaster
                position='top-center'
                reverseOrder={false}
            />

            {user && !isMenuOpen && <img onClick={() => { setIsMenuOpen(!isMenuOpen) }} src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' />}

            <Routes>
                {/*public route*/}
                <Route path='/login' element={
                    !user ? (
                        <div className='bg-[#ededed] flex items-center justify-center h-screen w-screen'>
                            <Login />
                        </div>
                    ) : <Navigate to="/" />
                } />
                
                <Route path='/users/activate' element={<VerifyAccount />} />

                {/*Protected route*/}
                <Route element={<ProtectedRoute />}>
                    <Route path='/*' element={
                        <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
                            <div className='flex h-screen w-screen'>
                                <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                                <Routes>
                                    <Route path='/' element={<ChatBox />} />
                                    <Route path='/chat/:chatId' element={<ChatBox />} />
                                    <Route path='/credits' element={<Credits />} />
                                    <Route path='/community' element={<Community />} />
                                    {/*wrong route*/}
                                    <Route path='*' element={<Navigate to="/" />} />
                                </Routes>
                            </div>
                        </div>
                    } />
                </Route>

                {/*wrong or others route*/}
                <Route path='*' element={<Navigate to={user ? "/" : "/login"} />} />
            </Routes>


        </>
    )
}

export default App