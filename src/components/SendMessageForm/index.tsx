import { FormEvent, useContext, useState } from "react"
import { VscGithubInverted, VscSignOut } from "react-icons/vsc"
import { AuthContext } from "../../contexts/auth"
import { api } from "../../services/api"
import styles from "./styles.module.scss"

export default function SendMessageForm() {
    const [message, setMessage] = useState("")
    const { user, signOut } = useContext(AuthContext)

    async function handleSendMessage(event: FormEvent) {
        event.preventDefault()

        if (!message.trim()) return

        await api.post("messages", { message })

        setMessage("")
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button className={styles.signOutButton} onClick={signOut}>
                <VscSignOut size={32} />
            </button>

            <header className={styles.userInfo}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size={16}></VscGithubInverted>
                    {user?.login}
                </span>
            </header>

            <form
                className={styles.sendMessageForm}
                onSubmit={handleSendMessage}
            >
                <label htmlFor="message">Mensagem</label>
                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual suas expecttivas para o evento?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                ></textarea>

                <button type="submit">Enviar mensagem</button>
            </form>
        </div>
    )
}
