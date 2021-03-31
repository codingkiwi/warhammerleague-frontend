import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = (props) => {
	const auth = useContext(AuthContext);

	return (
		<ul className='nav-links'>
			<li>
				<NavLink to='/' exact>
					Home
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<React.Fragment>
					<li>
						<NavLink to='/leagues/create' exact>
							Create Ladder
						</NavLink>
					</li>
					<li>
						<NavLink to='/leagues/explore' exact>
							Discover
						</NavLink>
					</li>
					<li>
						<NavLink to='/leagues/' exact>
							My Ladders
						</NavLink>
					</li>
					<li id='user-image'>
						<img alt='user profile' src={auth.userImage}></img>
					</li>
				</React.Fragment>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to='/auth' exact>
						Log In
					</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<button onClick={auth.logout}>Logout</button>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
