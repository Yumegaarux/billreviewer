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
        <Header></Header>
        <Routes>
          <Route path='/dev' element={<Dev></Dev>} />
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <Sidebar></Sidebar>
    </>
  )
}

export default App
