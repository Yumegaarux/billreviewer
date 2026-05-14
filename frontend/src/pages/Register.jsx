import axios from "axios";
import { useState, useEffect } from "react";
import { API_ENDPOINTS, API_BASE_URL } from "../../util/api";


export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const [canSubmit, setCanSubmit] = useState(false);

    const handleRegister = () => {
        try {
            const res = axios.post(API_BASE_URL + API_ENDPOINTS.USERS, {
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

    const checkDuplicate = async (field, value) => {
        try {
            const res = await axios.post(API_BASE_URL + API_ENDPOINTS.USERS, {
                action: "check-duplicate", // parameters than can be passed around.
                field: field,      
                value: value       
            });
            console.log('res:', res.data);
            return res.data.exists;
            
        } catch (error) {
            console.error(`Error checking ${field}:`, error);
            return false;
        }
    }

    const handleUsernameChange = async (e) => {
        const value = e.target.value;
        setUsername(value);

        const exists = await checkDuplicate('username', value);
        setUsernameError(exists); 

        handleErrorMessage('username', e.target.value);
        
        e == "" ? setUsernameErrorMessage("Username is required") : null;
    };

    const handleEmailChange = async (e) => {
        const value = e.target.value;
        setEmail(value);

        const exists = await checkDuplicate('email', value);
        setEmailError(exists); 

        e == "" ? setEmailErrorMessage("Email is required") : null;
    };

    useEffect(() => {
        if (
            username &&
            !usernameError &&
            email &&
            !emailError &&
            password &&
            occupation
        ) {
            setCanSubmit(true);
        } else {
            setCanSubmit(false);
        }
    }, [username, usernameError, email, emailError, password, occupation]);

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
                            onChange={(e) => handleUsernameChange(e)}
                            className={"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 " + (usernameError ? "focus:ring-red-500 border-red-500" : "focus:ring-blue-300")}
                        />
                    </div>
                    {usernameError && <p className="text-red-500 text-sm">Username already exists</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(e)}
                            className={"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 " + (emailError ? "focus:ring-red-500 border-red-500" : "focus:ring-blue-300")}
                        />
                    </div>
                    {emailError && <p className="text-red-500 text-sm">Email already exists</p>}
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
                        className={`w-full py-2 px-4 rounded-lg ease-in-out duration-300 ${
                            canSubmit
                                ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleRegister()}
                        disabled={!canSubmit}
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline " >
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}