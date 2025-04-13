import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';

const fetchData = async (username: string, password: string) => {
    try {
        const response = await fetch("http://localhost:3000/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error("Error fetching data");
        }
        const data = await response.json();
        console.log(data);

        if (response.status === 200) {
            window.location.href = "/login";
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error when trying to register: ${error.message}`);
        }
    }
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h2>Register</h2>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    required
                    label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    required
                    label="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" sx={{ backgroundColor: '#ffb6c1', color: 'white' }} onClick={() => fetchData(username, password)}>Register</Button>
            </Box>
        </div>
    );
};

export default Register;
