import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthResponse = {
    token: string
    user: {
        id: string
        login: string
        name: string
        avatar_url: string
    }
}

type User = {
    id: string
    name: string
    login: string
    avatar_url: string
}

type AuthContextData = {
    user: User | null
    signInUrl: string
    signOut: () => void
}

type AuthProvider = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export default function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=af1d8f4aaf8dc823d188`

    async function signIn(githubCode: string) {
        const resp = await api.post<AuthResponse>("authenticate", {
            code: githubCode,
        })

        const { token, user } = resp.data

        localStorage.setItem("@dowhile_brunohubner:token", token)

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)
    }

    function signOut() {
        setUser(null)
        localStorage.removeItem("@dowhile_brunohubner:token")
    }

    useEffect(() => {
        const token = localStorage.getItem("@dowhile_brunohubner:token")

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>("profile")
                .then(resp => setUser(resp.data))
        }
    }, [])

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes("?code=")

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split("?code=")

            window.history.pushState({}, "", urlWithoutCode)

            signIn(githubCode)
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            signInUrl,
            signOut,
            user
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}