import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './LeagueDetails.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

const LeagueDetails = (props) => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const leagueId = useParams().leagueId;
	const [leagueDetails, setLeagueDetails] = useState();
	const [participantsChanged, setParticipantsChanged] = useState(false);
	const [alreadyJoined, setAlreadyJoined] = useState(false);

	useEffect(() => {
		const fetchLeagues = async () => {
			setParticipantsChanged(false);
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
				setLeagueDetails(responseData.league);

				if (responseData.joined === 'true') {
					setAlreadyJoined(true);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, leagueId, auth.token, participantsChanged, auth.userId]);

	if (error) {
		console.log(isLoading + error + clearError); //hack to remove warnings so netlify can build
	}

	const addParticipantHandler = async () => {
		setParticipantsChanged(true);
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

	const removeSelfAsParticipantHandler = async () => {
		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL +
					'/leagues/' +
					leagueId +
					'/removeparticipant/' +
					auth.userId,
				'PATCH',
				JSON.stringify({
					participantId: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
			console.log('removed as participant');
		} catch (err) {
			console.log(err.message);
		}
		setParticipantsChanged(true);
		setAlreadyJoined(false);
	};

	const submitGameHandler = () => {};

	if (!leagueDetails) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				<div>
					{isLoading && <LoadingSpinner asOverlay />}
					<p>no league details</p>
				</div>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				<div>
					{isLoading && <LoadingSpinner asOverlay />}
					<h3>League Name</h3>
					<p>{leagueDetails.name}</p>
					<h3>Participants</h3>
					{
						<ul id='participant-details'>
							{leagueDetails.players.map((player) => (
								<li key={player.player.id}>
									{player.player.name} - {player.role}
								</li>
							))}
						</ul>
					}
					<h3>Games</h3>
					{
						<ul id='game-details'>
							{leagueDetails.games.map((game) => (
								<li key={game.id}>
									{game.player1score.player} vs {game.player2score.player} 
								</li>
							))}
						</ul>
					}
					{!alreadyJoined ? (
						<Button onClick={addParticipantHandler} type='submit'>
							JOIN LEAGUE
						</Button>
					) : (
						<p>Already Joined</p>
					)}
					{alreadyJoined && (
						<React.Fragment>
							<Button
								onClick={removeSelfAsParticipantHandler}
								type='submit'
							>
								LEAVE LEAGUE
							</Button>
							<Link
								to={{
									pathname:
										'/leagues/' + leagueId + '/submitgame',
								}}
							>
								SUBMIT GAME
							</Link>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
};

export default LeagueDetails;
