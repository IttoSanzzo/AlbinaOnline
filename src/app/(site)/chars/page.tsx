import { Metadata } from "next";
import CharsPageContent from "./pageContent";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

export const metadata: Metadata = {
	title: "Chars",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/chars"),
	},
};

export default function CharsPageServerShell() {
	return <CharsPageContent />;
}
