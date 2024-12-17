
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/SignIn';
import SignUp from './pages/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

