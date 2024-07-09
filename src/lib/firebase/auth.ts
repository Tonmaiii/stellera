import {
	GoogleAuthProvider,
	getAuth,
	onAuthStateChanged,
	signInAnonymously,
	signInWithPopup,
	type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import firebaseApp from './firebase';
import { db } from './firestore';
import type { UserEntry } from './types';

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

export const anonymousSignIn = async () => {
	try {
		const result = await signInAnonymously(auth);
		return result.user;
	} catch (error) {
		console.error('Error signing in anonymously:', error);
	}
};

export const signOut = async () => {
	try {
		await auth.signOut();
	} catch (error) {
		console.error('Sign-out error:', error);
	}
};

export const enum USER_STATE {
	WAITING,
	SIGNED_OUT,
	SIGNED_IN
}

export const user = writable<
	| { state: USER_STATE.WAITING | USER_STATE.SIGNED_OUT; user: null }
	| { state: USER_STATE.SIGNED_IN; user: User }
>({ state: USER_STATE.WAITING, user: null });
export const userData = writable<UserEntry | null>(null);

export const initializeAuth = () => {
	const localStorageUser = localStorage.getItem('user');
	if (localStorageUser) {
		const parsedUser = JSON.parse(localStorageUser);
		user.set(
			parsedUser
				? { user: parsedUser, state: USER_STATE.SIGNED_IN }
				: { state: USER_STATE.SIGNED_OUT, user: null }
		);
	}
	onAuthStateChanged(auth, async (newUser) => {
		if (newUser) {
			user.set({ state: USER_STATE.SIGNED_IN, user: newUser });
			updateProfile(newUser);
		} else {
			user.set({ state: USER_STATE.SIGNED_OUT, user: null });
			anonymousSignIn();
			userData.set(null);
		}
		localStorage.setItem('user', JSON.stringify(newUser));
	});
};

const updateProfile = async (user: User) => {
	const userDocument = doc(db, 'players', user.uid);
	const userDocumentSnapshot = await getDoc(userDocument);
	const data = (userDocumentSnapshot.data() ?? null) as UserEntry | null;
	userData.set(data);
};
