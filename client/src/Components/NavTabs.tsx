import { Link, useLocation } from 'react-router-dom';
//import '../assets/index.css'

// object destructuring assignment to get the variables from the props object
// We assign them to their own variable names
function NavTabs() {
  const currentPage = useLocation().pathname;
  //don't render the nav links if its login or signup page
  if (currentPage === '/' || currentPage === '/signup') {
    return null; // Don't render the navbar
  }

  return (
    <>
      <h1>Tune Sphere</h1>
      <ul className="nav nav-tabs justify-content-end">
        <li className="nav-item">
          <Link
            to="/home"
            // This is a conditional (ternary) operator that checks to see if the current page is "About"
            // If it is, we set the current page to 'nav-link-active', otherwise we set it to 'nav-link'
            className={currentPage === '/home' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/spotify"
            // Check to see if the currentPage is `Contact`, and if so we use the active link class from bootstrap. Otherwise, we set it to a normal nav-link
            className={currentPage === '/spotify' ? 'nav-link active' : 'nav-link'}
          >
            Spotify
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/ticket"
            // Check to see if the currentPage is `Blog`, and if so we use the active link class from bootstrap. Otherwise, we set it to a normal nav-link
            className={currentPage === '/ticket' ? 'nav-link active' : 'nav-link'}
          >
            Ticketmaster
          </Link>
        </li>
      </ul>
    </>
  );
}

export default NavTabs;
