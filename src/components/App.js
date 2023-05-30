import React, {useState} from 'react'
import ChatRoom from './ChatRoom'
import Login from './Login'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

var stompClient = null;

const App = () => {
    const [publicChats, setPublicChats] = useState([])
    const [userName, setUserName] = useState('')
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState(0)

    const connect =()=>{
        const socket = new SockJS("http://localhost:8080/ws")
        stompClient = Stomp.over(socket)
        stompClient.debug = null
        stompClient.connect({},onConnected, onError)
    }
    
    //Callback TRUE
    const onConnected = () => {
        //Suscribo al ChatRoom:
        stompClient.subscribe('/chatroom', onMessageReceived)
        //Envío al Login:
        var req = {name: userName}
        stompClient.send("/app/login", {}, JSON.stringify(req));
    }
    
    //Callback FALSE:
    const onError = (err) => {
        console.log(err)
    }

    //On Message Received:
    const onMessageReceived = (payload)=>{

        var payloadData = JSON.parse(payload.body)

        switch(payloadData.status){
            case "JOIN":
                if(!sessionStorage.name && !sessionStorage.id){
                    sessionStorage.setItem("name", payloadData.user.name)
                    sessionStorage.setItem("id", payloadData.user.id)
                }
                setUsers(payloadData.users.length)
                publicChats.push(payloadData)
                setPublicChats([...publicChats])
                break;
            
            case "MESSAGE":
                publicChats.push(payloadData)
                setPublicChats([...publicChats])
                break
            
            case "LEAVE":
                if(payloadData.user.id === parseInt(sessionStorage.id)){
                    sessionStorage.removeItem("id")
                    sessionStorage.removeItem("name")
                }
                setUsers(payloadData.users.length)
                publicChats.push(payloadData)
                setPublicChats([...publicChats])
                break
            
            default:
                break
        }
    }

    //Log Out:
    const logout = () => {
        if (stompClient) {
            var req = {id: sessionStorage.id, name:sessionStorage.name}
            stompClient.send("/app/logout", {}, JSON.stringify(req))
        }
    }

    //Send New Message:
    const sendNewMessage = () => {
        if (stompClient) {
            var req = {
                user: {name: sessionStorage.name, id: sessionStorage.id}, 
                message: message, 
                status:"MESSAGE"
            }
            console.log(req)
            stompClient.send("/app/message", {}, JSON.stringify(req))
            setMessage('')
        }
    }

    //On page close: 
    window.addEventListener("beforeunload", function(){
        logout()
    })


    return (
        <div className="container">
            { sessionStorage.name && sessionStorage.id ? 
                    <ChatRoom 
                        message={message}
                        setMessage={setMessage}
                        publicChats={publicChats} 
                        sendNewMessage={sendNewMessage}
                        logout={logout}
                        users={users}
                    />
                : 
                    <Login 
                        userName={userName} 
                        setUserName={setUserName} 
                        connect={connect}
                    />
            }
        </div>
    )
}

export default App;