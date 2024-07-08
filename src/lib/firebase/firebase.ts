import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyCP73t3StUcIXjhMamcJxRTxiQJapogYiY',
	authDomain: 'stellera-e266d.firebaseapp.com',
	projectId: 'stellera-e266d',
	storageBucket: 'stellera-e266d.appspot.com',
	messagingSenderId: '915845436379',
	appId: '1:915845436379:web:e03b47a87f7de61ae00dfe',
	measurementId: 'G-8S2QWMGFS5'
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
