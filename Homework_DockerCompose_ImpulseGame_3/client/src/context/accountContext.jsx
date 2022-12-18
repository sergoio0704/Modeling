import React, { useCallback, useContext, useEffect, useState } from "react"
import { getAccount, getAvatar } from "../services/accountService"
import { useAuth } from "./authContext"
import { Roles } from "../models/role"

const AccountContext = React.createContext()

export const useAccount = () => {
  return useContext(AccountContext)
}

export const AccountProvider = ({ children }) => {
  const authContext = useAuth()
  const [account, setAccount] = useState({})

  const resolveAmdmin = (role) => {
    return role === Roles.admin
  }

  useEffect(() => {
    getAccount(authContext.token)
        .then( res =>  {
            res.data.isAdmin = resolveAmdmin(res.data.role)
            setAccount(res.data) 
        })
        .catch( err => alert(err.response))

    getAvatar(authContext.token)
        .then( res => {
          console.log(res)
            setAccount( acc => {
              return {...acc, avatar: res}
            })
        })
  }, [])

  return (
    <AccountContext.Provider value={{account: account}}>{children}</AccountContext.Provider>
  )
}
