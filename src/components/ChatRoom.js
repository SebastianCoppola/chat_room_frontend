import React from 'react'

const ChatRoom = (props) => {
    const {publicChats, sendNewMessage, logout, message, setMessage, users} = props


    const handleMessage =(event)=>{
        setMessage(event.target.value)
    }

    const handleSend = () => {
        sendNewMessage()
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="chatbox">

            <div className="chat-members">
                <div>
                    <h4 className='title'>Chatroom</h4>
                </div>
                <button className='logout-button' onClick={handleLogout}>LOGOUT</button>
            </div>

            <div className="chat-content">
                <p className='subtitle'><i>{users} participants online.</i></p>    
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.status === 'JOIN' || chat.status === 'LEAVE' ? 'join' : chat.user.id === parseInt(sessionStorage.id) && 'self'}`} key={index}>
                            {chat.status === 'JOIN' || chat.status === 'LEAVE' ?
                                <div className="message-data">{chat.message}</div>
                            : chat.user.id !== parseInt(sessionStorage.id) ?
                                <>
                                    <div className="avatar">{chat.user.name}</div>
                                    <div className="message-data">{chat.message}</div>
                                </>
                            : chat.user.id === parseInt(sessionStorage.id) ?
                                <>
                                    <div className="message-data">{chat.message}</div>
                                    <div className="avatar self">{chat.user.name}</div>
                                </>
                            : null}
                        </li>
                    ))}
                </ul>
                <div className="send-message">
                    <input
                        type="text"
                        className="input-message"
                        placeholder="Enter message..."
                        value={message}
                        onChange={handleMessage}
                    />
                    <button type="button" className="send-button" onClick={handleSend}>
                        SEND
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom