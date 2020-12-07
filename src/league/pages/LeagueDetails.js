import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './LeagueDetails.css';

const LeagueDetails = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const leagueId = useParams().leagueId;
	const [leagueDetails, setLeagueDetails] = useState();

	useEffect(() => {
		const fetchLeagues = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL + '/leagues/' + leagueId
				);
				console.log(responseData.league);
				setLeagueDetails(responseData.league);
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, leagueId]);

	if (!leagueDetails) {
		return <p>no league details</p>;
	} else {
		return <p>{leagueDetails.name}</p>;
	}
};

export default LeagueDetails;
