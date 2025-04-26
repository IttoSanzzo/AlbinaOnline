export async function getCacheMode(): Promise<"no-cache" | "force-cache"> {
	return process.env.NODE_ENV === "development" ? "no-cache" : "force-cache";
}
