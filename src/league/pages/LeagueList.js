import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';

import './LeagueList.css';

const LeagueList = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [leagueList, setLeagueList] = useState([]);

	useEffect(() => {
		const fetchLeagues = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/leagues'
				);
				setLeagueList(responseData.leagues);
			} catch (err) {
				if (err) {
					console.log(err.message);
				}
			}
		};
		fetchLeagues();
	}, [sendRequest]);

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
