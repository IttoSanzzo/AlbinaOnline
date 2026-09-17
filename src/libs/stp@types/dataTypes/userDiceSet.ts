import { Guid } from "../misc";

export enum UserDiceSetType {
	Primary,
	Secondary,
}
export type UserDiceSet = {
	id: Guid;
	userId: Guid;
	dice: number;
	type: keyof typeof UserDiceSetType;
	ddDiceTheme: string;
	preview: string;
	notation?: string;
	diceName: string;
	user: string;
};
