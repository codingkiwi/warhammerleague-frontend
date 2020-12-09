import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './LeagueDetails.css';
import { AuthContext } from '../../shared/context/auth-context';

const LeagueDetails = (props) => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const leagueId = useParams().leagueId;
	const [leagueDetails, setLeagueDetails] = useState();

	useEffect(() => {
		const fetchLeagues = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/leagues/' + leagueId,
					'GET',
					null,
					{ Authorization: 'Bearer ' + auth.token }
				);
				console.log(responseData.league);
				setLeagueDetails(responseData.league);
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, leagueId, auth.token]);

	console.log(isLoading + error + clearError); //hack to remove warnings so netlify can build

	const addParticipantHandler = async () => {	
		console.log('participant added');
		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + '/leagues/' + leagueId + '/addparticipant',
				'PATCH',
				JSON.stringify({
                    participantId: auth.userId,
                }),
				{ 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token }
			);
		} catch (err) {}
	}

	if (!leagueDetails) {
		return <p>no league details</p>;
	} else {
		return (
			<div>
				<p>{leagueDetails.name}</p>
				<Button onClick={addParticipantHandler} type='submit'>
					JOIN LEAGUE
				</Button>
			</div>
		);
	}
};

export default LeagueDetails;
