import Link from "next/link";

export default function RootPage() {
	return (
		<>
			Root
			<Link href={"/login"}>Login</Link>
		</>
	);
}
