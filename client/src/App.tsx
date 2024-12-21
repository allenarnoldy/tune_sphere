import Footer from './Components/Footer';
import Header from './Components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';


function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<SignIn />} />
    //     <Route path="/signup" element={<SignUp />} />
    //     <Route path="/home" element={<Home />} />
    //     <Route path="/spotify" element={<Spotify />} />
    //     <Route path="/ticket" element={<TicketMaster />} />
    //   </Routes>
    //   <Footer />
    // </BrowserRouter>
    <>
     <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    
    </>
  );
}

export default App;

