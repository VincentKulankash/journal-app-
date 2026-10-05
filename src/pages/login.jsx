import { useState } from "react";

function Login({ onLogin }){
    const [mode, setMode] = useState('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!username.trim() || !password) {
            setError('Username and password are required')
            return
        }

        onLogin({id: 1, username: username.trim() })
    }

    function switchTo(nextMode) {
        setMode(nextMode)
        setError('')
        setUsername('')
        setPassword('')
    }

    return (
        <div className="page auth-page">
            <h1> {mode === 'login' ? 'Log in' : 'Create account'}</h1>

            {error && <div className="message error"> {error} </div>  }

            <form onSubmit={handleSubmit}>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                </label>

                {mode === 'login' && (
                    <label className="checkbox">
                        <input type="checkbox"/>
                        Remember me on this device
                    </label>
                )}

                <button type="submit">
                    {mode === 'login' ? 'Log in' : 'Create account'}
                </button>
            </form>

            <p className="switch">
                {mode === 'login' ? (
                    <>
                        No account{' '}
                        <button type="button" className="link" onClick={() => switchTo('signup')}>
                            Create one
                        </button>
                    </>
                ): (
                    <>
                        Already have an account? {' '}
                        <button type="button" className="link" onClick={() => switchTo('login')}>
                            Log in
                        </button>
                    </>
                )}
            </p>
        </div>
    )
}

export default Login