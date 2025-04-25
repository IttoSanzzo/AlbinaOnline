export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return [];
}
