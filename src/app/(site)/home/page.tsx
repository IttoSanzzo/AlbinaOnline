import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Metadata } from "next";

const HomeContainer = newStyledElement.div(styles.homeContainer);

export const metadata: Metadata = {
	title: "Home",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function HomePage() {
	return <HomeContainer></HomeContainer>;
}
