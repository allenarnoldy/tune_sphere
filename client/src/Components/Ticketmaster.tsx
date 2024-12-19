import React from 'react';
import type { TicketMasterData } from '../interfaces/TicketMasterData';

//import auth from '../utils/auth';

// Define the props for the component
interface TicketMasterListProps {
    ticketmasters: TicketMasterData[] | null; // users can be an array of UserData objects or null
}

const TicketMasterList: React.FC<TicketMasterListProps> = ({ ticketmasters }) => {
    return (
        <>
            <h2 className="pb-5">
                Here are the events!
            </h2>
            {ticketmasters && ticketmasters.map((ticketmaster) => (
                <div className="row align-center mb-5" key={ticketmaster.name}>
                    <div className="col-md-6">
                        <h3>{ticketmaster.sales.public.startDateTime}. {ticketmaster.sales.public.endDateTime}</h3>
                    </div>
                    <div className="col-md-6">
                        <h4><a href={`${ticketmaster.url}`}>{ticketmaster.url}</a></h4>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TicketMasterList;
