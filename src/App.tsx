import { useContext } from "react"
import styles from "./App.module.scss"
import LoginBox from "./components/LoginBox"
import MessageList from "./components/MessageList"
import SendMessageForm from "./components/SendMessageForm"
import { AuthContext } from "./contexts/auth"

export default function App() {
    const { user } = useContext(AuthContext)

    return (
        <main className={`${styles.contentWrapper} ${!!user ? "" : ""}`}> {/* incluir svg */}
            <MessageList></MessageList>
            {!!user ? <SendMessageForm></SendMessageForm> : <LoginBox></LoginBox>}
        </main>
    )
}