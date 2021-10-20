import styles from "./styles.module.scss"
import LogoImg from "../../assets/LogoImg"
import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { io } from "socket.io-client"

type Message = {
    id: string
    message: string
    user: {
        name: string
        avatar_url: string
    }
}

const messagesQueue: Message[] = []

const socket = io("http://localhost:3333")
socket.on("new_message", (newMessage: Message) => messagesQueue.push(newMessage))

export default function MessageList() {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => {
                    return [
                        messagesQueue[0],
                        prevState[0],
                        prevState[1]
                    ].filter(Boolean)
                })

                messagesQueue.shift()
            }
        }, 1000)
    }, [])

    useEffect(() => {
        api.get<Message[]>("messages/last3")
            .then(resp => setMessages(resp.data))
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <LogoImg></LogoImg>
            <ul className={styles.messageList}>

                {messages.map((message, i) => {
                    return (
                        <li key={i} className={styles.message}>
                            <p className={styles.messageContent}>
                                {message.message}
                            </p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}