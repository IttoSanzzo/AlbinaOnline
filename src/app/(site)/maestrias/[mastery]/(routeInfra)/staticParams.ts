export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return [
		{ mastery: "acrobacia" },
		{ mastery: "alerta" },
		{ mastery: "arcanismo" },
		{ mastery: "atletismo" },
		{ mastery: "atraencia" },
	];
}
