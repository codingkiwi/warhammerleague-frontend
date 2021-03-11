import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './CreateLeague.css';

const CreateLeague = (props) => {
	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
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
				/>
				<Input
					id='description'
					label='Description'
					element='textarea'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a description.'
					onInput={inputHandler}
				/>
				<Input
					id='location'
					label='Location'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid location.'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid}>
					Create ladder
				</Button>
			</form>
		</Card>
	);
};

export default CreateLeague;
