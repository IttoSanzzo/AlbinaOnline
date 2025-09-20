import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Codex",
	icons: {
		icon: getAlbinaApiAddress("/favicon/misc/codex"),
	},
};

export default async function test() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}>
			<p>
				<Link href={"/codex/test"}>/test</Link>
			</p>
			<p>
				<Link href={"/codex/icc"}>/icc</Link>
			</p>
			<p>
				<Link href={"/codex/re"}>/re</Link>
			</p>
			<p>
				<Link href={"/codex/re/avant"}>/re/avant</Link>
			</p>
			<p>
				<Link href={"/codex/fail"}>/fail</Link>
			</p>
		</div>
	);
}
