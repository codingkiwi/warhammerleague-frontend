import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';

import './GameDetails.css';

const converter = new Showdown.Converter({
	tables: true,
	simplifiedAutoLink: true,
	strikethrough: true,
	tasklists: true,
});

const GameDetails = (props) => {
	const auth = useContext(AuthContext);
	const gameId = useParams().gameId;
	const leagueId = useParams().leagueId;
	const [gameDetails, setGameDetails] = useState();
	const [userIsInGame, setUserIsInGame] = useState(false);
	const [batRepExists, setBatRepExists] = useState(false);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [editorValue, setEditorValue] = useState(
		'**Write your battle report here using markdown**'
	);
	const [selectedTab, setSelectedTab] = useState('write');
	const [editorActiveState, setEditorActiveState] = useState('hide-editor');
	const [batrepActiveState, setBatrepActiveState] = useState('show-editor');

	const batrepEditHandler = () => {
		setBatrepActiveState('hide-editor');
		setEditorActiveState('show-editor');
	};

	const batrepSaveHandler = async () => {
		setBatrepActiveState('show-editor');
		setEditorActiveState('hide-editor');

		try {
			await sendRequest(
				process.env.REACT_APP_BACKEND_URL +
					'/leagues/' +
					leagueId +
					'/updateGame/' +
					gameId,
				'PATCH',
				JSON.stringify({
					batrep: editorValue,
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token,
				}
			);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		const fetchGameDetails = async () => {
			try {
				const responseData = await sendRequest(
					process.env.REACT_APP_BACKEND_URL +
						'/leagues/' +
						leagueId +
						'/games/' +
						gameId
				);
				setGameDetails(responseData.game);

				//checks whether logged in user is in the current game
				if (responseData.game) {
					if (
						responseData.game.batrep !== '' &&
						responseData.game.batrep !== undefined
					) {
						setBatRepExists(true);
					}
					if (
						auth.userId ===
							responseData.game.player1score.player.id ||
						auth.userId === responseData.game.player2score.player.id
					) {
						setUserIsInGame(true);
					}
					console.log(responseData.game.batrep);
					if (responseData.game.batrep !== false) {
						setEditorValue(responseData.game.batrep);
					}
					setEditorValue(responseData.game.batrep);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchGameDetails();
	}, [sendRequest, gameId, leagueId, auth.userId]);

	if (!gameDetails) {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				<div>
					{isLoading && <LoadingSpinner asOverlay />}
					<p>no game details</p>
				</div>
			</React.Fragment>
		);
	} else {
		return (
			<React.Fragment>
				<ErrorModal error={error} onClear={clearError} />
				{isLoading && <LoadingSpinner asOverlay />}
				<div className='main-container'>
					<h2>
						{gameDetails.player1score.player.name} vs{' '}
						{gameDetails.player2score.player.name}
					</h2>
					<h3>{gameDetails.datePlayed.slice(0, 10)} </h3>
					<div className='league-details'>
						<table id='game-details-table'>
							<tbody>
								<tr>
									<th>Name</th>
									<td>
										<Link
											to={
												'/user/' +
												gameDetails.player1score.player
													._id
											}
										>
											{
												gameDetails.player1score.player
													.name
											}
										</Link>
										{gameDetails.winner._id ===
											gameDetails.player1score.player
												._id && (
											<i className='fas fa-trophy winner-trophy'></i>
										)}
									</td>
									<td>
										<Link
											to={
												'/user/' +
												gameDetails.player2score.player
													._id
											}
										>
											{
												gameDetails.player2score.player
													.name
											}
										</Link>
										{gameDetails.winner._id ===
											gameDetails.player2score.player
												._id && (
											<i className='fas fa-trophy winner-trophy'></i>
										)}
									</td>
								</tr>
								<tr>
									<th>Faction</th>
									<td>{gameDetails.player1score.faction}</td>
									<td>{gameDetails.player2score.faction}</td>
								</tr>
								<tr>
									<th>Primary Points</th>
									<td>
										{gameDetails.player1score.primaryPoints}
									</td>
									<td>
										{gameDetails.player2score.primaryPoints}
									</td>
								</tr>
								<tr>
									<th>Secondary Points</th>
									<td>
										{
											gameDetails.player1score
												.secondaryPoints
										}
									</td>
									<td>
										{
											gameDetails.player2score
												.secondaryPoints
										}
									</td>
								</tr>
								<tr>
									<th>Total Points</th>
									<td className='table-row-bold'>
										{gameDetails.player1score.totalPoints}
									</td>
									<td className='table-row-bold'>
										{gameDetails.player2score.totalPoints}
									</td>
								</tr>
								<tr>
									<th>Went First</th>
									<td>
										{gameDetails.player1score.wentFirst
											? 'Yes'
											: 'No'}
									</td>
									<td>
										{gameDetails.player2score.wentFirst
											? 'Yes'
											: 'No'}
									</td>
								</tr>
							</tbody>
						</table>
						<h2>Battle Report</h2>
						{userIsInGame && (
							<React.Fragment>
								{batrepActiveState === 'show-editor' && (
									<Button onClick={batrepEditHandler}>
										Edit Battle Report
									</Button>
								)}
								{batrepActiveState === 'hide-editor' && (
									<Button onClick={batrepSaveHandler}>
										Save Battle Report
									</Button>
								)}
							</React.Fragment>
						)}
						<div className={batrepActiveState}>
							{!batRepExists ? (
								<p>No batrep has been written for this game</p>
							) : (
								<p>{editorValue}</p>
							)}
						</div>
						<div className={editorActiveState}>
							<ReactMde
								value={editorValue}
								onChange={setEditorValue}
								selectedTab={selectedTab}
								onTabChange={setSelectedTab}
								generateMarkdownPreview={(markdown) =>
									Promise.resolve(
										converter.makeHtml(markdown)
									)
								}
							/>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
};

export default GameDetails;
