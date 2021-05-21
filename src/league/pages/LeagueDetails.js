import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './LeagueDetails.css';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

const LeagueDetails = (props) => {
	const auth = useContext(AuthContext);
	const history = useHistory();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const leagueId = useParams().leagueId;
	const [leagueDetails, setLeagueDetails] = useState();
	const [sortedPlayerList, setSortedPlayerList] = useState([]);
	const [participantsChanged, setParticipantsChanged] = useState(false);
	const [alreadyJoined, setAlreadyJoined] = useState(false);
	const [playerRole, setPlayerRole] = useState('none');

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
				if (responseData.role !== null) {
					setPlayerRole(responseData.role);
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

	const removeGameHandler = async (gameId) => {
		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL +
					'/leagues/' +
					leagueId +
					'/removeGame/' +
					gameId,
				'PATCH',
				JSON.stringify({
					participantId: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
			console.log('removed game');
		} catch (err) {
			console.log(err.message);
		}
		setParticipantsChanged(true);
	};

	const deleteLeagueHandler = async () => {
		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + '/leagues/' + leagueId,
				'DELETE',
				JSON.stringify({
					participantId: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
			console.log('removed game');
		} catch (err) {
			console.log(err.message);
		}
		history.push('/leagues/');
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
					<div className='league-details-header'>
						{isLoading && <LoadingSpinner asOverlay />}
						<h1 id='league-title'>{leagueDetails.name}</h1>
						<p>
							<em>{leagueDetails.description}</em>
						</p>
						<p>Players: {leagueDetails.players.length}</p>
						{!alreadyJoined ? (
							<Button
								onClick={addParticipantHandler}
								type='submit'
							>
								JOIN LEAGUE
							</Button>
						) : (
							<p>
								<em>Already Joined as {playerRole}</em>
							</p>
						)}
						{alreadyJoined && (
							<React.Fragment>
								<Button
									to={{
										pathname:
											'/leagues/' +
											leagueId +
											'/submitgame',
									}}
								>
									SUBMIT GAME
								</Button>
								{playerRole !== 'Admin' && (
									<Button
										onClick={removeSelfAsParticipantHandler}
										type='submit'
										danger='true'
									>
										LEAVE LEAGUE
									</Button>
								)}
								{playerRole === 'Admin' && (
									<Button
										onClick={deleteLeagueHandler}
										type='submit'
										danger='true'
									>
										DELETE LEAGUE
									</Button>
								)}
							</React.Fragment>
						)}
					</div>
					<section className='league-details-section'>
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
										<td>
											<Link
												to={'/user/' + player.player.id}
											>
												{player.player.name}
											</Link>
										</td>
										<td>{player.role}</td>
										<td>{player.score}</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
					<section className='league-details-section'>
						<h2>Games</h2>
						<table>
							<thead>
								<tr>
									<th>Date Played</th>
									<th>Player 1</th>
									<th>Player 2</th>
									{playerRole === 'Admin' && (
										<th className='table-cancel-row'>
											<i className='fas fa-minus-circle'></i>
										</th>
									)}
								</tr>
							</thead>
							<tbody>
								{leagueDetails.games.map((game) => (
									<tr key={game.id}>
										<td>
											<Link
												to={
													'/leagues/' +
													leagueId +
													'/games/' +
													game.id
												}
											>
												{game.datePlayed.slice(0, 10)}
											</Link>
										</td>
										<td>
											{game.player1score.player.name}
											{game.winner.id ===
												game.player1score.player.id && (
												<i className='fas fa-trophy winner-trophy'></i>
											)}
										</td>
										<td>
											{game.player2score.player.name}
											{game.winner.id ===
												game.player2score.player.id && (
												<i className='fas fa-trophy winner-trophy'></i>
											)}
										</td>
										{playerRole === 'Admin' && (
											<td className='table-cancel-row'>
												<i
													className='fas fa-minus-circle remove-icon'
													onClick={() =>
														removeGameHandler(
															game.id
														)
													}
												></i>
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</section>
				</div>
			</React.Fragment>
		);
	}
};

export default LeagueDetails;
