import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Log';
import Verify from './pages/varify';
import Protected from './auth/authroute';
import Details from './pages/details';
import Dashboard from './pages/dashboard';

import GoodsNearbyOrders from './pages/goodsAuto/goodsAvailable';
import GoodsCurrentOrder from './pages/goodsAuto/goodscurrent';
import GoodsPickedUpOrder from './pages/goodsAuto/goodsPickup';
import GoodsArrive from './pages/goodsAuto/goodsArrived';
import AcceptedOrder from './pages/goodsAuto/goodsAccepted';
import LanguageSelector from './pages/LanguageSelector';


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

                        <Route path='/goods/available/order' element={<GoodsNearbyOrders />} />
                        <Route path='/goods/accepted/order' element={<AcceptedOrder />} />
                        <Route path='/goods/arrive/order' element={<GoodsArrive /> } />
                        <Route path='/goods/current/order' element={<GoodsCurrentOrder />} />
                        <Route path='/goods/pickup/order' element={< GoodsPickedUpOrder />} />
                    </Route>
                </Routes>    
            </Router>
        </>
    );
}

export default App;