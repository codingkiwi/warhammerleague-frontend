import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => {
	return (
		<div className='main-container'>
			<h1>Create and manage 40k ranked ladders</h1>
			<h3>
				Compete against your friends using a competitive rating system.
				Work your way up the ladder and prove who's number one
			</h3>
			<Link to='/auth'>Sign up and get started</Link>
		</div>
	);
};

export default Home;
