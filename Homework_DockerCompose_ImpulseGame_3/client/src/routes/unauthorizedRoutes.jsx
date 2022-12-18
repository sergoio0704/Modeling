import { Route, Routes } from "react-router"
import { Login } from "../pages/login/login"
import { Registration } from "../pages/registration/registration"

export const UnauthorizedRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/registration' element={<Registration />} />
      <Route path='*' element={<Login />} />
    </Routes>
  )
}
