import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Log';
import Verify from './pages/varify';


function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/lo" element={<Login />} />
                    <Route path="/parcelandtransport-auth-success" element={<Verify />} />             

                </Routes>
            </Router>
        </>
    );
}

export default App;
