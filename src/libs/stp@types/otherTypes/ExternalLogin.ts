export const ExternalLoginProviders = ["discord", "google"] as const;
export type ExternalLoginProvider = (typeof ExternalLoginProviders)[number];
export const ExternalConnectionProviders = [
	...ExternalLoginProviders,
	"dddice",
] as const;
export type ExternalConnectionProvider =
	(typeof ExternalConnectionProviders)[number];

export type ExternalConnections = {
	[key: string]: ExternalConnection;
};
export type ExternalConnection = {
	externalUserId: string;
};
