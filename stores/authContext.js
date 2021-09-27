import { createContext, useEffect, useState } from "react";
import netlifyIdentity from 'netlify-identity-widget'

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: ()=>{},
    authReady: false
})

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [authReady, setAuthReady] = useState(false)

    useEffect(()=>{
        // ini namanya userFromNetlify buat perjelas aja, bisa kok pake user aja untuk parameter jadi misalnya parameter diganti 'user' nanti si
        // setUser() nya juga bisa diisi setUser(user)
        netlifyIdentity.on('login', (userFromNetlify)=>{
            setUser(userFromNetlify)
            netlifyIdentity.close()
            console.log('login event')
        })

        netlifyIdentity.on('logout',()=>{
            setUser(null)
            console.log('logout event')
        })

        netlifyIdentity.on('init',(user)=>{
            setUser(user);
            setAuthReady(true)
            console.log('init event')
        })

        // init netlify identity connection
        netlifyIdentity.init()

        return () =>{
            netlifyIdentity.off('login')
            netlifyIdentity.off('logout')
        }
    },[])

    const login = () =>{
        netlifyIdentity.open()
    }

    const logout = ()=>{
        netlifyIdentity.logout()
    }

    const context = { user, login, logout, authReady}

    return(
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext