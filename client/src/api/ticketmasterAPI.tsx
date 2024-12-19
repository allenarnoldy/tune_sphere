//import Auth from '../utils/auth';

const retrieveTicketMaster = async (query:string) => {
  try {
    const response = await fetch(`/api/ticket/${query}`, {
      headers: {
        'Content-Type': 'application/json'//,
       // Authorization: `Bearer ${Auth.getToken()}`
      }
    });
    const data = await response.json();

    if(!response.ok) {
      throw new Error('Invalid user API response, check network tab!');
    }

    return data;

  } catch (err) { 
    console.log('Error from data retrieval:', err);
    return [];
  }
}

export { retrieveTicketMaster };
