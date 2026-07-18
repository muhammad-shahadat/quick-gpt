import React, { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast'

import ChatBox from './components/chat/ChatBox'
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { useAppContext } from './context/useContext';
import Login from './pages/Login';
import Sidebar from './components/chat/Sidebar';
import VerifyAccount from './pages/VerifyAccount';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './pages/Loading';
import PaymentSuccess from './pages/PaymentSuccess';
import ChatLayout from './layouts/ChatLayout';




const App = () => {


    const { user, userLoading } = useAppContext();




    if (userLoading) {

        return <Loading />
    }


    return (
        <>

            <Toaster
                position='top-center'
                reverseOrder={false}
            />


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

                    {/* Full Screen payment success page */}
                    <Route path='/payment-success' element={<PaymentSuccess />} />

                    {/* Sidebar Layout */}
                    <Route path='/' element={<ChatLayout />} >
                        <Route index element={<ChatBox />} />
                        <Route path='chat/:chatId' element={<ChatBox />} />
                        <Route path='credits' element={<Credits />} />
                        <Route path='community' element={<Community />} />
                    </Route>

                </Route>

                {/*wrong or others route*/}
                <Route path='*' element={<Navigate to={user ? "/" : "/login"} />} />
            </Routes>


        </>
    )
}

export default App