import React, { useCallback, useContext, useEffect, useState } from "react"

const storageName = "token"

const AuthContext = React.createContext()
export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(storageName))

  const login = useCallback((jwtToken) => {
    setToken(jwtToken)
    localStorage.setItem(storageName, jwtToken)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const jwtToken = localStorage.getItem(storageName)
    if (jwtToken) {
      login(jwtToken)
    }
  }, [login])
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        token: token,
      }}>
        {children}
    </AuthContext.Provider>
  )
}

