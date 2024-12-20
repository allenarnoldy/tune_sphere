import { useState, useEffect, useLayoutEffect } from "react";
import { retrieveTicketMaster } from "../api/ticketmasterAPI";
import type { TicketMasterData } from "../interfaces/TicketMasterData";
import ErrorPage from "./ErrorPage";
import TicketMasterList from '../Components/Ticketmaster';
//import auth from '../utils/auth';

const TicketMaster = () => {

    const [ticketmasters, setTicketMasters] = useState<TicketMasterData[]>([]);
    //const [error, setError] = useState(false);
    const [searchterm,setSearchTerm] = useState('');
    const [loginCheck, setLoginCheck] = useState(false);

    // useEffect(() => {
    //     if (loginCheck) {
    //         retrieveTicketMaster();
    //     }
    // }, [loginCheck]);

    // useLayoutEffect(() => {
    //     checkLogin();
    // }, []);

    // const checkLogin = () => {
    //     if (auth.loggedIn()) {
    //         setLoginCheck(true);
    //     }
    // };

    // const fetchTicketMaster = async () => {
    //     try {
    //         const query = '';
    //         const data = await retrieveTicketMaster(query);
    //         setTicketMasters(data)
    //     } catch (err) {
    //         console.error('Failed to retrieve Events:', err);
    //         setError(true);
    //     }
    // }

    // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        //fetch from state variable
        const query = searchterm;
        const data = await retrieveTicketMaster(query);
        setTicketMasters(data)
        // If login is successful, call Auth.login to store the token in localStorage
        //Auth.login(data.token);
    } catch (err) {
      console.error('Failed to fetch Ticket master data', err);  // Log any errors during fetch
    }
  };

    // if (error) {
    //     return <ErrorPage />;
    // }

    return (
        <>
            {/* {
                !loginCheck ? ( */}
                    <form className="form" onSubmit={handleSubmit}>
                        <div className='login-notice'>
                            <h1>
                                Please use the search button to see the list of events related to your favourite Artist!
                            </h1>
                        </div>
                        <div className="mb-3">
                            <label htmlFor ="exampleFormControlInput1" className="form-label">Search for Artist</label>
                            <input type="text" name="artistName" className="form-control w-50" id="exampleFormControlInput1" placeholder="Type Artist Name" onChange={(e)=>setSearchTerm(e.target.value)}></input>
                        </div>

                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary mb-3">Submit</button>
                        </div>
                    </form>

                    <TicketMasterList ticketmasters={ticketmasters} />

                {/* ) : (
                    
                )
            } */}
        </>
    );
};

export default TicketMaster;
