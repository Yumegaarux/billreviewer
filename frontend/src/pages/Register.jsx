import axios from "axios";
import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        try {
            const res = axios.post("/api/user", {
                username,
                firstName,
                lastName,
                occupation,
                email,
                password
            });
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-96 p-6 border border-gray-300 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name</label>
                        <input
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}   
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"  
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Occupation</label>
                        <select    
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select Occupation</option>
                            <option value="engineer">Engineer</option>
                            <option value="teacher">Teacher</option>
                            <option value="doctor">Doctor</option>
                            <option value="lawyer">Lawyer</option>
                            <option value="IT">Information Technologist</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ease-in-out duration-300 cursor-pointer"
                        onClick={() => handleRegister()}
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}