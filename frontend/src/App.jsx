import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Test from './pages/Test.jsx';
import Login from './pages/Login.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Sidebar></Sidebar>

        <Routes>
          <Route path="/" element={Test}/>
          <Route path="/" element={Login}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
