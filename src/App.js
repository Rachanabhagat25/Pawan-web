import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';

import User from './components/getUser/user';
import Add from './components/addUser/add';
import Edit from './components/updateUser/edit';

import Car from './components/getCar/car';
import AddCar from './components/addCar/addcar';
import EditCar from './components/updateCar/editcar';


import DailyPayments from './components/getdailyPayments/dailypayment';
import AddDailyPayment from './components/adddailyPayments/adddailypayment';
import EditDailyPayment from './components/updatedailyPayments/editdailypayment';

import FilterDailyPayment from './components/filterdata/filterdailypayment';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes  basename='/kiaacabs'>
          <Route path="/" element={<User />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
          
          <Route path="/cars" element={<Car />} />
          <Route path="/addcar" element={<AddCar />} />
          <Route path="/editcar/:id" element={<EditCar />} />
          
           <Route path="/dailyPayments" element={<DailyPayments />} />
          <Route path="/addDailyPayment" element={<AddDailyPayment />} />
          <Route path="/editDailyPayment/:id" element={<EditDailyPayment />} />

          <Route path="/filterdailypayment" element={<FilterDailyPayment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
