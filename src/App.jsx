import './App.css';
import StartPage from "./components/StartPage/StartPage.jsx";
import {Route, Routes} from "react-router-dom";
import Game from "./components/Game/Game.jsx";

function App() {
  return (
    <>
        <Routes>
            <Route path='/' element={<StartPage />}/>
            <Route path='/game/:gameId?' element={<Game/>} action={({ params }) => {}}/>
        </Routes>

    </>
  )
}

export default App
