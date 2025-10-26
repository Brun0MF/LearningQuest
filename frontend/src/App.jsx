import { Routes, Route } from "react-router-dom"
import './App.css'

//home
import Home from "./views/pages/home/home"

//login
import Login from "./views/pages/login/login"
import Forgot from "./views/pages/login/forgotPass"
import LoginLayout from "./views/pages/login/loginLayout"
import BaseLayout from "./views/pages/layout/baseLayout"

function App() {
  return (
    <>
      <Routes>

        {/*LOGIN*/}
        <Route element={<LoginLayout />}>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/forgot" element={<Forgot />}></Route>
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
