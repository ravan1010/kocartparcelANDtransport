import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Log';
import Verify from './pages/varify';
import Protected from './auth/authroute';
import Details from './pages/details';
import Dashboard from './pages/dashboard';


function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/parcel-auth-success" element={<Verify />} />   
                    <Route element={<Protected />}>
                        <Route path='/details' element={<Details />} />
                        <Route path='/' element={<Dashboard />} />
                    </Route>
                </Routes>    
            </Router>
        </>
    );
}

export default App;
