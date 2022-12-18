import { AccountProvider } from "../context/accountContext"
import { GameCatalog } from "../pages/game/game_catalog/gameCatalog"
import { Header } from "../components/header/header"
import { GameAccent } from "../pages/game/game_accent/gameAccent"
import { GameProvider } from "../context/gameContext"
import { Rating } from "../pages/rating/rating"
import { Profile } from "../pages/profile/profile"
import { EditGame } from "../pages/game/game_edit/gameEdit"

const { Routes, Route } = require("react-router")

export const AuthorizedRoutes = () => {
  return (
    <AccountProvider>
        <GameProvider>
          <div className="container auth-container-background">
              <Header />
              <div className="content">
                <Routes>
                    <Route path='/' element={<GameCatalog />} />
                    <Route path='/game/accent' element={<GameAccent />} />
                    <Route path='/rating' element={<Rating />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/admin/game/edit' element={<EditGame />} />
                    <Route path='*' element={<GameCatalog />} />
                </Routes>
              </div>
          </div>
        </GameProvider>
    </AccountProvider>
  )
}
