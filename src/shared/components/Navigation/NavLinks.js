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
					HOME
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<React.Fragment>
					<li>
						<NavLink to='/leagues/create'>CREATE LEAGUE</NavLink>
					</li>
					<li>
						<NavLink to='/leagues/explore'>EXPLORE</NavLink>
					</li>
                    <li>
						<NavLink to='/leagues/'>MY LEAGUES</NavLink>
					</li>
				</React.Fragment>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to='/auth'>AUTHENTICATE</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<button onClick={auth.logout}>LOGOUT</button>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
