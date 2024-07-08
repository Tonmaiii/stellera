import type { DocumentData, Timestamp } from 'firebase/firestore';

export interface GameEntry extends DocumentData {
	accuracy: number;
	gameId: string;
	playerId: string;
	showConstellation: boolean;
	useDesignation: boolean;
	time: number;
	timestamp: Timestamp;
	anonymous: boolean;
}

export interface UserEntry extends DocumentData {
	name: string;
}
