import { Routes, Route } from "react-router-dom"
import './App.css'

//home
import Home from "./views/pages/home/home"
import BaseLayout from "./views/pages/layout/baseLayout"

//login
import Login from "./views/pages/login/login"
import Forgot from "./views/pages/login/forgotPass"
import LoginLayout from "./views/pages/login/loginLayout"
import CreateAccount from "./views/pages/login/createAccount"
import Teste from "./views/pages/layout/teste"

function App() {
  return (
    <>
      <Routes>
        <Route path="/teste" element={<Teste />}></Route>
        {/*LOGIN*/}
        <Route element={<LoginLayout />}>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/forgot" element={<Forgot />}></Route>
          <Route path="/create" element={<CreateAccount />}></Route>
        </Route>
        {/*LOGIN*/}

        {/*CONTEUDO DA PAGINA */}
        <Route element={<BaseLayout />}>
          <Route path='/home' element={<Home />}></Route>
        </Route>
        {/*CONTEUDO DA PAGINA */}

      </Routes>
    </>
  )
}

export default App
