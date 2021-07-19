import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './EditLeague.css';

const EditLeague = (props) => {
	const auth = useContext(AuthContext);
	const leagueId = useParams().leagueId;
	const [leagueDetails, setLeagueDetails] = useState();

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [formState, inputHandler, setFormData] = useForm(
		{
			name: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			location: {
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
				console.log(responseData.league);
				//set form inputs to existing values here
				setFormData({
					name: {
						value: responseData.league.name,
						isValid: true,
					},
					description: {
						value: responseData.league.description,
						isValid: true,
					},
					location: {
						value: responseData.league.location,
						isValid: true,
					},
				});
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, leagueId, auth.token, auth.userId, setFormData]);

	const history = useHistory();

	const leagueSubmitHandler = async (event) => {
		event.preventDefault();

		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + '/leagues/',
				'POST',
				JSON.stringify({
					name: formState.inputs.name.value,
					description: formState.inputs.description.value,
					location: formState.inputs.location.value,
					participantId: auth.userId,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
			history.push('/');
		} catch (err) {}
	};

	if (isLoading || !leagueDetails) {
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
			<Card className='create-league-form'>
				<ErrorModal error={error} onClear={clearError} />
				<h2>Create a ranked ladder</h2>
				<hr />
				<form onSubmit={leagueSubmitHandler}>
					{isLoading && <LoadingSpinner asOverlay />}
					<Input
						id='name'
						label='Name'
						element='input'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a name.'
						onInput={inputHandler}
						initialValue={leagueDetails.name}
						initialValid={true}
					/>
					<Input
						id='description'
						label='Description'
						element='textarea'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a description.'
						onInput={inputHandler}
						initialValue={leagueDetails.description}
						initialValid={true}
					/>
					<Input
						id='location'
						label='Location'
						element='input'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a valid location.'
						onInput={inputHandler}
						initialValue={leagueDetails.location}
						initialValid={true}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						Create ladder
					</Button>
				</form>
			</Card>
		);
	}
};

export default EditLeague;
