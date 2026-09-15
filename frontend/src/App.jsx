// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./Login";
import ItemPage from "./Item";
import UserPage from "./User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้า Login สำหรับคนที่ยังไม่ได้เข้าสู่ระบบ */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* หน้า Home สำหรับคนที่ล็อกอินแล้ว */}
        <Route path="/" element={<Home />}>
           <Route index element={<ItemPage />} />
           <Route path="item" element={<ItemPage />} /> 
           <Route path="user" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;