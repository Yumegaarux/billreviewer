import { NavLink } from 'react-router-dom';
import { Home, Settings, Bell } from 'lucide-react'

export default function Sidebar(){
    return(
        <nav className='fixed right-0'> {/* for screen not moving */}
            <span className='flex flex-col w-16 h-screen shadow-[-1px_0px_2px_rgba(0,0,0,0.1)] p-4 space-y-6 gap-6 justify-center bg-white'>
                <NavLink 
                    to="/test"
                    className={({ isActive }) => 
                        `flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-50' 
                    }`
                    }
                    title="Test Page"
                >
                    <Home size={24} />
                </NavLink>
                <NavLink 
                    to="/dev"
                    className={({ isActive }) => 
                        `flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-50' 
                    }`
                    }
                    title="Dev Page"
                >
                    <Settings size={24} />
                </NavLink>
                <NavLink 
                    to="/login"
                    className={({ isActive }) => 
                        `flex items-center justify-center p-2 rounded-lg transition-colors ${
                        isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-50' 
                    }`
                    }
                    title="Login Page"
                >
                    <Bell size={24} />
                </NavLink>
            </span>
        </nav>
    )
}
