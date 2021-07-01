import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form-hook';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './LeagueList.css';

const LeagueList = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [leagueList, setLeagueList] = useState([]);

	const [formState, inputHandler] = useForm(
		{
			searchFilter: {
				value: '',
				isValid: false,
			},
		},
		false
	);

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

	const filterSubmitHandler = (event) => {
		event.preventDefault();
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
			<div className='main-container'>
				<div className='league-search'>
					<h1>Find a 40k Ladder</h1>
					<form onSubmit={filterSubmitHandler}>
						<Input
							element='input'
							id='searchFilter'
							type='text'
							label='Ladder Name'
							validators={[]}
							errorText='Please enter a ladder name.'
							onInput={inputHandler}
						/>
					</form>
				</div>
				<div className='table-container'>
					<table>
						<thead>
							<tr>
								<th>Ladder Name</th>
								<th>Location</th>
								<th>Player Count</th>
							</tr>
						</thead>
						<tbody>
							{leagueList
								.filter((league) =>
									league.name.includes(
										formState.inputs.searchFilter.value
									)
								)
								.map((league) => (
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
