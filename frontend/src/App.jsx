import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignIn from './lehed/Login'
import SignUp from './lehed/Registreeri'
import IndexPage from './lehed/IndexLeht'

function App() {

  return (
    
      <Routes>
          <Route path='/' Component={IndexPage}/>
          <Route path='/login' Component={SignIn}/>
          <Route path='/register' Component={SignUp}/>
      </Routes>
      
      
    
  )
}

export default App
