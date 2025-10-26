import { Routes, Route } from "react-router-dom"
import './App.css'
import Home from "./views/pages/home/home"
import Login from "./views/pages/login/login"
import Forgot from "./views/pages/login/forgotPass"
import LoginLayout from "./views/pages/login/loginLayout"
import CreateAccount from "./views/pages/login/createAccount"

function App() {
  return (
    <>
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path='/login' element={<Login />}></Route>
          <Route path="/forgot" element={<Forgot />}></Route>
          <Route path="/create" element={<CreateAccount />}></Route>
        </Route>
        <Route element={''}>
          <Route path='/home' element={<Home />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
