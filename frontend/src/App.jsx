import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';

import Dev from './pages/Dev.jsx';
import Login from './pages/Login.jsx';
import Test from './pages/Test.jsx';

function App() {

  return (
    <>
        <Sidebar></Sidebar>
        <Header></Header>
        
        <main className='px-2.5 pr-20 py-2.5 bg-gray-50 min-h-screen shadow-[0px_4px_6px_rgba(0,0,0,0.15)]'>
          <Routes>
            <Route path='/dev' element={<Dev></Dev>} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </main>
    </>
  )
}

export default App
