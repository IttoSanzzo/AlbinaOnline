import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Codex",
	icons: {
		icon: getAlbinaApiAddress("/favicon/misc/codex"),
	},
};

export default async function test() {
	return <>Banana</>;
}
