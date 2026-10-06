export const VttOperationMethods = [
	"Post",
	"Get",
	"Put",
	"Delete",
	"Head",
	"Patch",
] as const;
export type VttOperationMethod = (typeof VttOperationMethods)[number];
