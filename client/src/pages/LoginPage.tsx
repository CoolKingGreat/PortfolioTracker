import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            console.error('Login failed:', error);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'An unexpected error occurred.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-gray-100 pt-8 px-8 rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
                    Sign In
                </h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username" className="block text-md font-medium text-gray-700">
                            Usernme
                        </label>
                        <input
                            id="username"
                            type="usernamr"
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-md font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                        />
                    </div>
                    {error && (
                        <p className="text-center text-red-500 bg-red-100 p-2 rounded-md">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Submit
                    </button>
                </form>
                <div className="text-center text-md py-1 text-blue-900 mb-6"><Link to="/register">Register</Link></div>
            </div>
        </div>
    );
};

export default LoginPage;