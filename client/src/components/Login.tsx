import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'


const fetchData = async (username: string, password: string) => {
    try {
        const response = await fetch("http://localhost:3000/user/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        if (!response.ok) {
            throw new Error("Error fetching data")
        }
        const data = await response.json()
        console.log(data)

        if(data.token) {
            localStorage.setItem("token", data.token)
            window.location.href = "/board" 
        }


    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to login: ${error.message}`)
        }
    }


}



const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
  return (
    <div>
        <h2>Login</h2>
        <Box
                component="form"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    required
                    id="outlined-required"
                    label="Username"
                    defaultValue=""
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    required
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" sx={{ backgroundColor: '#ffb6c1', color: 'white' }} onClick={() => fetchData(username, password)}>Login</Button>
            </Box>
        
        
        
    </div>
  )
}

export default Login