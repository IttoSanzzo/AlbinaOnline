"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateMetadata(tag: string) {
	revalidateTag(`page-metadata-${tag}`, {});
	return true;
}

export async function revalidatePathByClientSide(path: string) {
	revalidatePath(path);
	return true;
}
export async function revalidateTagByClientSide(tag: string) {
	revalidateTag(tag, {});
	return true;
}
