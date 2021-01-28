import React from 'react'; //import Suspense if using lazy loading below
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';

import Auth from './user/pages/Auth';
import CreateLeague from './league/pages/CreateLeague';
import LeagueList from './league/pages/LeagueList';
import LeagueListJoined from './league/pages/LeagueListJoined';
import LeagueDetails from './league/pages/LeagueDetails';
import LeagueSubmitGame from './league/pages/LeagueSubmitGame';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
	const { userId, token, image, login, logout } = useAuth();

	let routes;

	if (token) {
		routes = (
			<Switch>
				<Route path='/' exact>
					<Redirect to='/leagues/explore' />
				</Route>
				<Route path='/leagues/explore' exact>
					<LeagueList />
				</Route>
				<Route path='/leagues' exact>
					<LeagueListJoined />
				</Route>
				<Route path='/leagues/create' exact>
					<CreateLeague />
				</Route>
				<Route path='/leagues/:leagueId' exact>
					<LeagueDetails />
				</Route>
				<Route path='/leagues/:leagueId/submitgame' exact>
					<LeagueSubmitGame />
				</Route>
				{/* <Redirect to='/' /> */}
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path='/' exact>
					<p>Logged Out Home</p>
				</Route>
				<Route path='/auth' exact>
					<Auth />
				</Route>
				{/* <Redirect to='/auth' /> */}
			</Switch>
		);
	}
	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				userImage: image,
				login: login,
				logout: logout,
			}}
		>
			<Router>
				<MainNavigation />
				<main>
					{/* <Suspense
						fallback={
							<div className='center'>
								<LoadingSpinner />
							</div>
						}
					> */}
					{routes}
					{/* </Suspense> */}
				</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
