import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return(
        <div className="flex-1 w-52 h-52 bg-white z-1">
            <form>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

                <input type="submit"></input>
                <p>No Account Yet? <a href="/register" className="text-blue-500 hover:underline">Register here</a></p>
            </form>
        </div>
    )
}