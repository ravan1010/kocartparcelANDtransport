import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Log';
import Verify from './pages/varify';
import Protected from './auth/authroute';


function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/parcelandtransport-auth-success" element={<Verify />} />   
                    <Route element={<Protected />}>
                        <Route path='/' element={<Verify />} />
                    </Route>
                </Routes>    
            </Router>
        </>
    );
}

export default App;
