import React, { useContext, useState } from "react"

const GameContext = React.createContext()

export const useGame = () => {
  return useContext(GameContext)
}

export const GameProvider = ({ children }) => {
  const [currentIdGameType, setCurrentIdGameType] = useState()

  return (
    <GameContext.Provider 
        value={{
            currentIdGameType: currentIdGameType, 
            setCurrentIdGameType
        }}
    >{children}
    </GameContext.Provider>
  )
}