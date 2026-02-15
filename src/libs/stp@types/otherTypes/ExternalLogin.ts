export const ExternalLoginProviders = ["discord", "google"] as const;
export type ExternalLoginProvider = (typeof ExternalLoginProviders)[number];

export type ExternalLogins = {
	[key: string]: ExternalLogin;
};
export type ExternalLogin = {
	externalUserId: string;
};
