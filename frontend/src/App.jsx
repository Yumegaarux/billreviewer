import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Test from '../pages/Test.jsx' ;

function App() {

  return (
    <>
      <BrowserRouter>
        <Test></Test>
      </BrowserRouter>

    </>
  )
}

export default App
