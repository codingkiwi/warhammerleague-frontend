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

	return leagueList.map((league) => (
		<ul>
			<li>{league.name}</li>
			<li>{league.description}</li>
			<Link to={'/leagues/' + league.id}>Details</Link>
		</ul>
	));
};

export default LeagueList;
