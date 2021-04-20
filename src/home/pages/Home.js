import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';

import './Home.css';

const Home = () => {
	return (
		<div className='main-container'>
			<div className='home-container-hero'>
				<h1>40k Ranked Ladder Manager</h1>
				<h2>Create and manage ranked ladders for Warhammer 40k</h2>
				<h3>
					Compete against your friends for rankings. Watch your local
					meta evolve. Work your way up the ladder and prove who's
					number one
				</h3>
				<Link to='/auth'>Get Started</Link>
			</div>
			<div className='home-container-light'>
				<Card>
					<h5>Create a Ladder</h5>
					<p>Create a ranked ladder and invite your friends.</p>
				</Card>
				<Card>
					<h5>Improve Your Ranking</h5>
					<p>Gain or Lose ranking points depending on you and your opponents relative ranking using the ELO system.</p>
				</Card>
				<Card>
					<h5>View Your Stats</h5>
					<p>Coming soon...</p>
				</Card>
			</div>
		</div>
	);
};

export default Home;
