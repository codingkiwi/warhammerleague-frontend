import { useEffect, useCallback, useState } from 'react';

let logoutTimer;

export const useAuth = () => {
	const [token, setToken] = useState(null);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();
	const [userId, setUserId] = useState(false);
	const [image, setImage] = useState(null);

	const login = useCallback((uid, token, image, expirationDate) => {
		setToken(token);
		setUserId(uid);
		setImage(image);
		const tokenExpirationDate =
			expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uid,
				token: token,
				image: image,
				expiration: tokenExpirationDate.toISOString(),
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		setImage(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime = tokenExpirationDate.getTime() - new Date();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate, image]);

	useEffect(() => {
		const storageData = JSON.parse(localStorage.getItem('userData'));
		if (
			storageData &&
			storageData.token &&
			storageData.image &&
			new Date(storageData.expiration) > new Date()
		) {
			login(
				storageData.userId,
				storageData.token,
				storageData.image,
				new Date(storageData.expiration)
			);
		}
	}, [login, image]);

	return { userId, token, image, login, logout };
};
