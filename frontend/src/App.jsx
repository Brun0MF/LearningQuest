import { Routes, Route } from "react-router-dom"
import './App.css'
import Home from "./views/pages/home/home"
import Login from "./views/pages/login/login"

function App() {
  return (
    <>
      <Routes>
        <Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/home' element={<Home />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
