import { Routes, Route } from "react-router-dom"
import './App.css'

/* import PageInicial from "./views/pages/home/paginaIncial" */
import NotFound from "./views/pages/error/notFound"

//home
import Home from "./views/pages/home/home"
import BaseLayout from "./views/pages/layout/baseLayout"
import LevelMap from "./views/pages/jogos/LevelMap";
import Classificacao from "./views/pages/classificacao/classificacoes"
import Definicoes from "./views/pages/definicoes/definicoes"
import TermosCondicoes from "./views/pages/termos_condicoes/termos_condicoes"

//login
import Login from "./views/pages/login/login"
import Forgot from "./views/pages/login/forgotPass"
import LoginLayout from "./views/pages/login/loginLayout"
import CreateAccount from "./views/pages/login/createAccount"
import NewPassword from "./views/pages/login/newPassword"
import ConfirmEmail from "./views/pages/login/confirmEmail"

import PrivateRoute from "./views/components/privateroute/privateRoute"
import { SidebarProvider } from "./views/components/base/sidebar/sidebarContext"



function App() {
  return (
    <>
      <SidebarProvider>
        <Routes>

          {/* <Route path='/' element={<PageInicial />}></Route> */}

          {/*LOGIN*/}
          <Route element={<LoginLayout />}>
            <Route path='/login' element={<Login />}></Route>
            <Route path="/forgot" element={<Forgot />}></Route>
            <Route path="/createaccount" element={<CreateAccount />}></Route>
            <Route path="/newpassword" element={<NewPassword />}></Route>
            <Route path="/confirmemail" element={<ConfirmEmail />}></Route>
          </Route>
          {/*LOGIN*/}

          {/*CONTEUDO DA PAGINA */}
          <Route element={<BaseLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path='/jogos' element={<Home />}></Route>
              <Route path='/jogos_niveis/:id_topico' element={<LevelMap />} />
              <Route path='/classificacoes' element={<Classificacao />}></Route>
              <Route path='/definicoes' element={<Definicoes />}></Route>
              <Route path='/termos-condicoes' element={<TermosCondicoes />}></Route>
            </Route>
          </Route>
          {/*CONTEUDO DA PAGINA */}

          {/*CATCH ALL*/}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </SidebarProvider >
    </>
  )
}

export default App
