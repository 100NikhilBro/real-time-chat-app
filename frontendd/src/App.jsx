import React from 'react'
import {Route, Routes} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import LogInpage from './Pages/LogInpage'
import SignPage from './Pages/SignPage'
import ProfilePage from './Pages/ProfilePage'
import { ProtectedRoute } from './protected/routes'
import ChatPage from './Pages/ChatPage'
import './App.css'

const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/' element={<HomePage></HomePage>}></Route>
        <Route path='/login' element={<LogInpage></LogInpage>}></Route>
        <Route path='/sign' element={<SignPage></SignPage>}></Route>
        <Route path='/profile' element={<ProtectedRoute><ProfilePage></ProfilePage></ProtectedRoute>}></Route>
        <Route path='/chat' element={<ProtectedRoute><ChatPage></ChatPage></ProtectedRoute>}></Route>
      </Routes> 

    </div>
  )
}

export default App