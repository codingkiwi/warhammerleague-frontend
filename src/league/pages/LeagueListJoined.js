import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './LeagueListJoined.css';

const LeagueList = (props) => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [leagueList, setLeagueList] = useState([]);

	useEffect(() => {
		const fetchLeagues = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/leagues/user',
					'POST',
					JSON.stringify({
						user: auth.userId,
					}),
					{
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + auth.token,
					}
				);
				setLeagueList(responseData.leagues);
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, auth.token, auth.userId]);

	//hack to allow build without warnings
	if (error) {
		console.log(isLoading + error + clearError);
	}

	return (
		<React.Fragment>
			<div class='main-container'>
				<h1>My Ladders</h1>
				<div class='table-container'>
					<table>
						<thead>
							<tr>
								<th>Ladder Name</th>
								<th>Location</th>
								<th>Player Count</th>
							</tr>
						</thead>
						<tbody>
							{leagueList.map((league) => (
								<tr key={league.id}>
									<td>
										<Link to={'/leagues/' + league.id}>
											{league.name}
										</Link>
									</td>
									<td>{league.location}</td>
									<td>{league.players.length}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</React.Fragment>
	);
};

export default LeagueList;
