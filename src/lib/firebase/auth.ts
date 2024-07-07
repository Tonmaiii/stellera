import {
	GoogleAuthProvider,
	getAuth,
	onAuthStateChanged,
	signInWithPopup,
	type User
} from 'firebase/auth';
import { writable } from 'svelte/store';
import firebaseApp from './firebase';

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error) {
		console.error('Authentication error:', error);
		throw error;
	}
};

export const signOut = async () => {
	try {
		await auth.signOut();
	} catch (error) {
		console.error('Sign-out error:', error);
		throw error;
	}
};

export const enum USER_STATE {
	WAITING,
	SIGNED_OUT,
	SIGNED_IN
}

export const user = writable<
	| { state: USER_STATE.WAITING | USER_STATE.SIGNED_OUT }
	| { state: USER_STATE.SIGNED_IN; user: User }
>({ state: USER_STATE.WAITING });

export const initializeAuth = () => {
	const localStorageUser = localStorage.getItem('user');
	if (localStorageUser) {
		user.set(JSON.parse(localStorageUser) ?? { state: USER_STATE.SIGNED_OUT });
	}
	onAuthStateChanged(auth, (newUser) => {
		if (newUser) {
			user.set({ state: USER_STATE.SIGNED_IN, user: newUser });
		} else {
			user.set({ state: USER_STATE.SIGNED_OUT });
		}
		localStorage.setItem('user', JSON.stringify(newUser));
	});
};
