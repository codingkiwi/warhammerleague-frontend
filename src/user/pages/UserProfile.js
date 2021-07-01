import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';

import './UserProfile.css';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import { AuthContext } from '../../shared/context/auth-context';

const UserProfile = (props) => {
	// const auth = useContext(AuthContext);
	const userId = useParams().userId;
	const [userDetails, setUserDetails] = useState([]);
	const [userMainDetails, setUserMainDetails] = useState([]);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/users/' + userId
				);
				setUserDetails(responseData.games);
				setUserMainDetails(responseData.user);
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchUserDetails();
	}, [sendRequest, userId]);

	if (!userId) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				<div>
					{isLoading && <LoadingSpinner asOverlay />}
					<p>no user details</p>
				</div>
			</React.Fragment>
		);
	} else if (!userDetails) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				<div>
					{isLoading && <LoadingSpinner asOverlay />}
					<p>no user details</p>
				</div>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && <LoadingSpinner asOverlay />}
				<div className='main-container'>
					<h1>{userMainDetails.name}</h1>
					<div className='league-details'>
						<h2>Games Played</h2>
						<div className='table-container'>
							<table>
								<thead>
									<tr>
										<th>Date Played</th>
										<th>League</th>
										<th>Player 1</th>
										<th>Player 2</th>
									</tr>
								</thead>
								<tbody>
									{userDetails.map((game) => (
										<tr key={game.game._id}>
											<td>
												<Link
													to={
														'/leagues/' +
														game.leagueId +
														'/games/' +
														game.game._id
													}
												>
													{game.game.datePlayed.slice(
														0,
														10
													)}
												</Link>
											</td>
											<td>
												<Link
													to={
														'/leagues/' +
														game.leagueId
													}
												>
													{game.leagueName}
												</Link>
											</td>
											<td>
												{
													game.game.player1score
														.player.name
												}
												{game.game.winner._id ===
													game.game.player1score
														.player._id && (
													<i className='fas fa-trophy winner-trophy'></i>
												)}
											</td>
											<td>
												{
													game.game.player2score
														.player.name
												}
												{game.game.winner._id ===
													game.game.player2score
														.player._id && (
													<i className='fas fa-trophy winner-trophy'></i>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
};

export default UserProfile;
