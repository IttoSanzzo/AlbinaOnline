export enum RoleHierarchy {
	Unknown,
	Visitor,
	User,
	Master,
	Admin,
	Bot,
	God,
}

export const canCreateCatalogEntry = (role: RoleHierarchy) =>
	role >= RoleHierarchy.Admin;

export const canEditCatalogEntry = (role: RoleHierarchy) =>
	role >= RoleHierarchy.Admin;
