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
	const [sortedPlayerList, setSortedPlayerList] = useState([]);
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

				const sortedPlayers = responseData.league.players.sort((a, b) =>
					a.score > b.score ? 1 : -1
				);

				setSortedPlayerList(sortedPlayers);

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
				<div className='main-container'>
					{isLoading && <LoadingSpinner asOverlay />}
					<h1>{leagueDetails.name}</h1>
					<p>{leagueDetails.description}</p>
					<p>Players: {leagueDetails.players.length}</p>
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
					<h2>Participants</h2>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Role</th>
								<th>Rating</th>
							</tr>
						</thead>
						<tbody>
							{sortedPlayerList.map((player) => (
								<tr key={player.player.id}>
									<td>{player.player.name}</td>
									<td>{player.role}</td>
									<td>{player.score}</td>
								</tr>
							))}
						</tbody>
					</table>
					<h3>Games</h3>
					<table>
						<thead>
							<tr>
								<th>Date Played</th>
								<th>Player 1</th>
								<th>Player 2</th>
								<th>Winner</th>
							</tr>
						</thead>
						<tbody>
							{leagueDetails.games.map((game) => (
								<tr key={game.id}>
									<td>{game.datePlayed}</td>
									<td>{game.player1score.player.name}</td>
									<td>{game.player2score.player.name}</td>
									<td>{game.winner.name}</td>
								</tr>
							))}
						</tbody>
					</table>


				</div>
			</React.Fragment>
		);
	}
};

export default LeagueDetails;
