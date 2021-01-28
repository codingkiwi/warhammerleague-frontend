import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_NUMBER } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './LeagueSubmitGame.css';

const LeagueSubmitGame = (props) => {
	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
		{
			player1: {
				value: '',
				isValid: false,
			},
			player1PrimaryPoints: {
				value: '',
				isValid: false,
			},
			player1SecondaryPoints: {
				value: '',
				isValid: false,
			},
			player1GoFirst: {
				value: '',
				isValid: false,
			},
			player1Faction: {
				value: '',
				isValid: false,
			},
			player2: {
				value: '',
				isValid: false,
			},
			player2PrimaryPoints: {
				value: '',
				isValid: false,
			},
			player2SecondaryPoints: {
				value: '',
				isValid: false,
			},
			player2GoFirst: {
				value: '',
				isValid: false,
			},
			player2Faction: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const history = useHistory();

	const submitGameHandler = async (event) => {
		event.preventDefault();

		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL + '/leagues/',
				'POST',
				JSON.stringify({
					player1: formState.inputs.name.value,
					player: formState.inputs.description.value,
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
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<form onSubmit={submitGameHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='player1'
					label='player 1'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 1'
					onInput={inputHandler}
				/>
				<Input
					id='player1PrimaryPoints'
					label='player 1s primary points'
					element='input'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 1s primary points'
					onInput={inputHandler}
				/>
				<Input
					id='player1SecondaryPoints'
					label='player 1s secondary points'
					element='input'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 1s secondary points'
					onInput={inputHandler}
				/>
				<Input
					id='player1GoFirst'
					label='did player 1 go first?'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter whether player 1 went first'
					onInput={inputHandler}
				/>
				<Input
					id='player1Faction'
					label='player 1s faction'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 1s faction'
					onInput={inputHandler}
				/>
				<Input
					id='player2'
					label='player 2'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 2'
					onInput={inputHandler}
				/>
				<Input
					id='player2PrimaryPoints'
					label='player 2s primary points'
					element='input'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 2s primary points'
					onInput={inputHandler}
				/>
				<Input
					id='player2SecondaryPoints'
					label='player 2s secondary points'
					element='input'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 2s secondary points'
					onInput={inputHandler}
				/>
				<Input
					id='player2GoFirst'
					label='did player 2 go first?'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter whether player 2 went first'
					onInput={inputHandler}
				/>
				<Input
					id='player2Faction'
					label='player 2s faction'
					element='input'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 2s faction'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid}>
					CREATE LEAGUE
				</Button>
			</form>
		</React.Fragment>
	);
};

export default LeagueSubmitGame;
