import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Log';
import Verify from './pages/varify';
import Protected from './auth/authroute';
import Details from './pages/details';
import Dashboard from './pages/dashboard';
import NearbyOrders from './pages/avilableorder';
import CurrentOrder from './pages/CurrentOrder';
import PickedUpOrder from './pages/pickeduporder';


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
                        <Route path='/available/order' element={<NearbyOrders />} />
                        <Route path='/current/order' element={< CurrentOrder /> } />
                        <Route path='/pickup/order' element={ <PickedUpOrder />} />
                    </Route>
                </Routes>    
            </Router>
        </>
    );
}

export default App;