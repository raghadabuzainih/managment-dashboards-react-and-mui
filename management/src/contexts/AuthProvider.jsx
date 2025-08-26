import React from "react"
import { AuthContext } from "./AuthContext"
import users from '../data/users.json'

export const AuthProvider = ({children})=>{
    if(localStorage.getItem('userEmail')){
           if(new Date().getTime() > JSON.parse(localStorage.getItem('userEmail')).expiry){
            localStorage.removeItem('userEmail')
           }
    }
    const [userEmail, setUserEmail] =
        React.useState(JSON.parse(localStorage.getItem('userEmail')) || null)

    const login = (email)=>{
        const hours=3
        const item = {
            value: email,
            expiry: new Date().getTime() + (hours*60*60*1000),
            role: users.find(user=> user.email == email).role
        }
        localStorage.setItem('userEmail', JSON.stringify(item))
        setUserEmail(item)
    }
    
    const logout = ()=> {
        setUserEmail(null)
    }

    return(
        <AuthContext.Provider value={{userEmail, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

}