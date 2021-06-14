import React from 'react';
import { useParams } from 'react-router-dom';

// import { useHttpClient } from '../../shared/hooks/http-hook';

import './GameDetails.css';

// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import { AuthContext } from '../../shared/context/auth-context';

const GameDetails = (props) => {
	const gameId = useParams().gameId;

	

	return (
		<section className='main-container'>
			<p>game details for {gameId}</p>
		</section>
	);
};

export default GameDetails;
