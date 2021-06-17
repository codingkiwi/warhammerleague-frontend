import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './GameDetails.css';

const GameDetails = (props) => {
	const gameId = useParams().gameId;
	const leagueId = useParams().leagueId;
	const [gameDetails, setGameDetails] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	useEffect(() => {
		const fetchGameDetails = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL +
						'/leagues/' +
						leagueId +
						'/games/' +
						gameId
				);
				setGameDetails(responseData.game);
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchGameDetails();
	}, [sendRequest, gameId, leagueId]);

	if (!gameDetails) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				<div>
					{isLoading && <LoadingSpinner asOverlay />}
					<p>no game details</p>
				</div>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && <LoadingSpinner asOverlay />}
				<div className='main-container'>
					<h2>
						{gameDetails.player1score.player.name} vs{' '}
						{gameDetails.player2score.player.name}
					</h2>
					<h3>{gameDetails.datePlayed.slice(0, 10)} </h3>
					<div className='league-details'>
						<table id='game-details-table'>
							<tbody>
								<tr>
									<th>Name</th>
									<td>
										<Link
											to={
												'/user/' +
												gameDetails.player1score.player
													._id
											}
										>
											{
												gameDetails.player1score.player
													.name
											}
										</Link>
										{gameDetails.winner._id ===
											gameDetails.player1score.player
												._id && (
											<i className='fas fa-trophy winner-trophy'></i>
										)}
									</td>
									<td>
										<Link
											to={
												'/user/' +
												gameDetails.player2score.player
													._id
											}
										>
											{
												gameDetails.player2score.player
													.name
											}
										</Link>
										{gameDetails.winner._id ===
											gameDetails.player2score.player
												._id && (
											<i className='fas fa-trophy winner-trophy'></i>
										)}
									</td>
								</tr>
								<tr>
									<th>Faction</th>
									<td>{gameDetails.player1score.faction}</td>
									<td>{gameDetails.player2score.faction}</td>
								</tr>
								<tr>
									<th>Primary Points</th>
									<td>
										{gameDetails.player1score.primaryPoints}
									</td>
									<td>
										{gameDetails.player2score.primaryPoints}
									</td>
								</tr>
								<tr>
									<th>Secondary Points</th>
									<td>
										{
											gameDetails.player1score
												.secondaryPoints
										}
									</td>
									<td>
										{
											gameDetails.player2score
												.secondaryPoints
										}
									</td>
								</tr>
								<tr>
									<th>Total Points</th>
									<td className='table-row-bold'>
										{gameDetails.player1score.totalPoints}
									</td>
									<td className='table-row-bold'>
										{gameDetails.player2score.totalPoints}
									</td>
								</tr>
								<tr>
									<th>Went First</th>
									<td>
										{gameDetails.player1score.wentFirst
											? 'Yes'
											: 'No'}
									</td>
									<td>
										{gameDetails.player2score.wentFirst
											? 'Yes'
											: 'No'}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</React.Fragment>
		);
	}
};

export default GameDetails;
