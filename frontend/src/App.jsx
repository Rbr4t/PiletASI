import { Route, Routes } from 'react-router-dom'
import SignIn from './lehed/Login'
import SignUp from './lehed/Registreeri'
import IndexPage from './lehed/IndexLeht'
import OstaPilet from './lehed/OstaPilet'
import ValideeriPilet from './lehed/ValideeriPilet'
import AdminLeht from './lehed/AdminLeht'
function App() {

  return (
    
      <Routes>
          <Route path='/' Component={IndexPage}/>
          <Route path='/login' Component={SignIn}/>
          <Route path='/registreeri' Component={SignUp}/>
          <Route path='/osta' Component={OstaPilet}/>
          <Route path='/valideeri' Component={ValideeriPilet}/>
          <Route path='/admin' Component={AdminLeht}/>
      </Routes>
      
      
    
  )
}

export default App
