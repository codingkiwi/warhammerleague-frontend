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
	const [participantAdded, setParticipantAdded] = useState(false);
	const [alreadyJoined, setAlreadyJoined] = useState(false);

	useEffect(() => {
		const fetchLeagues = async () => {
			setParticipantAdded(false);
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/leagues/' + leagueId,
					'POST',
					JSON.stringify({
						user: auth.userId,
					}),
					{
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + auth.token,
					}
				);
				console.log(responseData.league.players);
				setLeagueDetails(responseData.league);

				if(responseData.joined === "true"){
					setAlreadyJoined(true);
				}

			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, leagueId, auth.token, participantAdded, auth.userId]);

	console.log(isLoading + error + clearError); //hack to remove warnings so netlify can build
	console.log(alreadyJoined);

	const addParticipantHandler = async () => {
		setParticipantAdded(true);
		setAlreadyJoined(true);
		console.log('participant added');
		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL +
					'/leagues/' +
					leagueId +
					'/addparticipant',
				'PATCH',
				JSON.stringify({
					participantId: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
		} catch (err) {}
	};

	if (!leagueDetails) {
		return <p>no league details</p>;
	} else {
		return (
			<div>
				<h3>League Name</h3>
				<p>{leagueDetails.name}</p>
				<h3>Participants</h3>
				{
					<ul id='league-details'>
						{leagueDetails.players.map((player) => (
							<li>{player.player.name}</li>
						))}
					</ul>
				}
				{!alreadyJoined ? <Button onClick={addParticipantHandler} type='submit'>
					JOIN LEAGUE
				</Button> : <p>Already Joined</p>}
			</div>
		);
	}
};

export default LeagueDetails;
