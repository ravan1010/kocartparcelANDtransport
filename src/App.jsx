import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Log';
import Verify from './pages/varify';
import Protected from './auth/authroute';
import AdminDashboard from './pages/dashboard';
import CreatePost from './pages/postcreate';


function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-auth-success" element={<Verify />} />   
                    <Route element={<Protected />}>
                                            <Route path='/' element={<AdminDashboard />} />
                                            <Route path="/admin/post" element={<CreatePost />} />

                    </Route>
                </Routes>    
            </Router>
        </>
    );
}

export default App;