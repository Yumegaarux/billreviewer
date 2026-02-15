import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Test from '../pages/Test.jsx' ;
import Header from '../components/Header.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Test></Test>
      </BrowserRouter>
    </>
  )
}

export default App
