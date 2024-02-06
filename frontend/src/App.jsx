import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignIn from './Signin'
import SignUp from './Signup'
import IndexPage from './IndexPage'

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
