import axios from "axios";
import { useState, useEffect } from "react";
import { API_ENDPOINTS, API_BASE_URL } from "../../util/api";
import toast from 'react-hot-toast';


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

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(API_BASE_URL + API_ENDPOINTS.USERS, {
                action: 'register',
                username,
                firstName,
                lastName,      
                occupation,
                email,
                password
            });
            toast.success('Account created!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Registration failed');
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

        if (value === "") {
            setUsernameError(true);
            setUsernameErrorMessage("Username is required");
            return;
        }

        const exists = await checkDuplicate("username", value);
        setUsernameError(exists);
        setUsernameErrorMessage(exists ? "Username already exists" : "");
    };

    const handleEmailChange = async (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value === "") {
            setEmailError(true);
            setEmailErrorMessage("Email is required");
            return;
        }

        const exists = await checkDuplicate("email", value);
        setEmailError(exists);
        setEmailErrorMessage(exists ? "Email already exists" : "");
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
                    {usernameError && <p className="text-red-500 text-sm">{usernameErrorMessage}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(e)}
                            className={"w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 " + (emailError ? "focus:ring-red-500 border-red-500" : "focus:ring-blue-300")}
                        />
                    </div>
                    {emailError && <p className="text-red-500 text-sm">{emailErrorMessage}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}   
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"  
                        />

                        {password && (
                            <div>
                                <p className="text-gray-500 text-sm">- Password must be at least 6 characters long</p>
                                <p className="text-gray-500 text-sm">- Password must contain at least one uppercase letter, one lowercase letter, and one number</p>
                                <p className="text-gray-500 text-sm">- Password must not contain any spaces</p>
                                <p className="text-gray-500 text-sm">- Password must not contain any special characters</p>
                            </div>
                        )}

                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Occupation</label>
                        <select    
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select Occupation</option>
                            <option value="1">Admin</option>
                            <option value="2">Teacher</option>
                            <option value="3">Doctor</option>
                            <option value="4">Lawyer</option>
                            <option value="5">Information Technologist</option>
                            <option value="6">Electrical Engineer</option>
                            <option value="7">Civil Engineer</option>
                            <option value="8">Electronics Engineer</option>
                            <option value="9">Mechanical Engineer</option>
                            <option value="10">Architect</option>
                            <option value="11">Nurse</option>
                            <option value="12">Student</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-lg ease-in-out duration-300 ${
                            canSubmit
                                ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={handleRegister}
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