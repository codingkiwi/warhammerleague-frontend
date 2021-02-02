import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_NUMBER,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './LeagueSubmitGame.css';

const LeagueSubmitGame = (props) => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const leagueId = useParams().leagueId;
	const [leagueDetails, setLeagueDetails] = useState();
	const [leagueParticipants, setLeagueParticipants] = useState();
	const [alreadyJoined, setAlreadyJoined] = useState(false);

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
				setLeagueParticipants(
					responseData.league.players.map(
						(player) => player.player.name
					)
				);

				if (responseData.joined === 'true') {
					setAlreadyJoined(true);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchLeagues();
	}, [sendRequest, leagueId, auth.token, auth.userId]);

	console.log(leagueParticipants);

	const [formState, inputHandler] = useForm(
		{
			player1: {
				value: '',
				isValid: false,
			},
			player1PrimaryPoints: {
				value: 0,
				isValid: false,
			},
			player1SecondaryPoints: {
				value: 0,
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
				value: 0,
				isValid: false,
			},
			player2SecondaryPoints: {
				value: 0,
				isValid: false,
			},
			player2Faction: {
				value: '',
				isValid: false,
			},
			playerFirstTurn: {
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
					element='select'
					options={leagueParticipants}
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 1'
					onInput={inputHandler}
				/>
				<Input
					id='player1PrimaryPoints'
					label='player 1s primary points'
					element='input'
					type='number'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 1s primary points'
					onInput={inputHandler}
				/>
				<Input
					id='player1SecondaryPoints'
					label='player 1s secondary points'
					element='input'
					type='number'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 1s secondary points'
					onInput={inputHandler}
				/>
				<Input
					id='player1Faction'
					label='player 1s faction'
					element='select'
					options={[
						'Aeldari',
						'Asuryani',
						'Drukhari',
						'Harlequins',
						'Ynnari',
						'Aeldari',
						'Chaos',
						'Chaos Knights',
						'Daemons',
						'Death Guard',
						'Fallen',
						'Gellerpox Infected',
						'Heretic Astarties',
						'Servants of the Abyss',
						'Thousand Sons',
						'Titanicus Traitoris',
						'Chaos',
						'Imperium',
						'Adepta Sororitas',
						'Adeptus Astarties',
						'Adeptus Custodies',
						'Adeptus Mechanicus',
						'Adeptus Titanicus',
						'Astra Militarum',
						'Elucidian Starstriders',
						'Fallen',
						'Grey Knights',
						'Imperial Knights',
						'Inquisition',
						'Officio Assassinorum',
						'Sisters of Silence',
						'Imperium',
						'Necrons',
						'Orks',
						"T'au Empire",
						'Tyranids',
						'Brood Brothers',
						'Genestealer Cults',
						'Tyranids',
					]}
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 1s faction'
					onInput={inputHandler}
				/>
				<Input
					id='player2'
					label='player 2'
					element='select'
					options={leagueParticipants}
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 2'
					onInput={inputHandler}
				/>
				<Input
					id='player2PrimaryPoints'
					label='player 2s primary points'
					element='input'
					type='number'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 2s primary points'
					onInput={inputHandler}
				/>
				<Input
					id='player2SecondaryPoints'
					label='player 2s secondary points'
					element='input'
					type='number'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
					errorText='please enter a number for player 2s secondary points'
					onInput={inputHandler}
				/>
				<Input
					id='player2Faction'
					label='player 2s faction'
					element='select'
					options={[
						'Aeldari',
						'Asuryani',
						'Drukhari',
						'Harlequins',
						'Ynnari',
						'Aeldari',
						'Chaos',
						'Chaos Knights',
						'Daemons',
						'Death Guard',
						'Fallen',
						'Gellerpox Infected',
						'Heretic Astarties',
						'Servants of the Abyss',
						'Thousand Sons',
						'Titanicus Traitoris',
						'Chaos',
						'Imperium',
						'Adepta Sororitas',
						'Adeptus Astarties',
						'Adeptus Custodies',
						'Adeptus Mechanicus',
						'Adeptus Titanicus',
						'Astra Militarum',
						'Elucidian Starstriders',
						'Fallen',
						'Grey Knights',
						'Imperial Knights',
						'Inquisition',
						'Officio Assassinorum',
						'Sisters of Silence',
						'Imperium',
						'Necrons',
						'Orks',
						"T'au Empire",
						'Tyranids',
						'Brood Brothers',
						'Genestealer Cults',
						'Tyranids',
					]}
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter player 2s faction'
					onInput={inputHandler}
				/>
				<Input
					id='playerFirstTurn'
					label='which player went first?'
					element='select'
					options={['Player 1', 'Player 2']}
					validators={[VALIDATOR_REQUIRE()]}
					errorText='please enter which player went first'
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
