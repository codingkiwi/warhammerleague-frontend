import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import texture from '../../Images/always-grey.png';

import './Home.css';

const Home = () => {
	return (
		<div className='home-container'>
			<div className='home-container-hero'>
				<h1>40k Ranked Ladder Manager</h1>
				<h3>Create and manage ranked ladders for Warhammer 40k</h3>
				<Button to='/auth'>Get Started</Button>
			</div>
			<div className='home-container-subhero' style={{backgroundImage:`url(${texture})`}}>
				<div className='home-subhero-contents'>
					<h2>Enjoy 40k more with <span className='accent-text'>friendly competition</span></h2>
					<h3>
						Foster friendly competition and rivalries. Keep a record
						of your conquests. Get your local community engaged
					</h3>
				</div>
			</div>
			<div className='home-container-dark'>
				<Card>
					<h5>Create a Ladder</h5>
					<p>Create a ranked ladder and invite your friends.</p>
				</Card>
				<Card>
					<h5>Improve Your Ranking</h5>
					<p>
						Compete against your friends for rankings. Gain or Lose
						ranking points depending on you and your opponents
						relative ranking using the ELO system.
					</p>
				</Card>
				<Card>
					<h5>View Your Stats</h5>
					<p>
						Watch your local meta evolve. This feature is coming
						soon...
					</p>
				</Card>
			</div>
		</div>
	);
};

export default Home;
