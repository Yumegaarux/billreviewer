import { useState } from "react";
import { X } from 'lucide-react'
import { API_ENDPOINTS, API_BASE_URL } from "../../util/api";
import axios from "axios";
import toast from 'react-hot-toast';
import { NavLink } from "react-router-dom";

export default function LoginModal( { onClose, onLogin } ) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onLogin();
            onClose();
            setIsClosing(false);
        }, 300);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(API_BASE_URL + API_ENDPOINTS.AUTH, {
                action: 'login',
                username,
                password
            }, { withCredentials: true });
            if (res.data.success) {
                toast.success('Login successful!, Welcome back ' + res.data.user.username);
                onLogin();
                onClose();
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity/50 backdrop-blur-sm z-50" onClick={onClose}>
            <div className={`animate-slide-in flex flex-col min-w-96 p-12 bg-white rounded-lg shadow-lg border border-gray-300 ${ isClosing ? 'animate-slide-out' : ''}`} onClick={(e) => e.stopPropagation()}>
                <X className="self-end cursor-pointer" onClick={handleClose} />
                <div className="text-2xl font-bold mb-4 text-center">Login</div>
                <div className="text-gray-400 mb-4 text-center">It seems you're not logged in.</div>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                    />

                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Login
                    </button>

                    <p className="mt-4 text-center text-sm">
                        No Account Yet? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
                    </p>
                </form>
            </div>
        </div>
    );
}