import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import './UserProfile.css';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

const UserProfile = (props) => {
	const auth = useContext(AuthContext);
	const userId = useParams().userId;

    console.log(userId);

	if (!userId) {
		return (
			<div className='main-container'>
				<p>user profile for self</p>
			</div>
		);
	} else {
		return (
			<div className='main-container'>
				<p>user profile for {userId}</p>
			</div>
		);
	}
};

export default UserProfile;
