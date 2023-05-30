import React from 'react'

const Login = (props) => {
    const {userName, setUserName, connect} = props

    const handleUsername=(event)=>{
        setUserName(event.target.value)
    }
    
    const handleConnect = () => {
        connect() 
    }

    return (
        <div className="register">
            <input
                className="register-input"
                id="user-name"
                placeholder="Enter your name."
                name="name"
                value={userName}
                onChange={handleUsername}
                // margin="normal"
            />
            <button 
                type="button" 
                className="register-button"
                onClick={handleConnect}
            >CONNECT</button> 
        </div>
    )
}

export default Login