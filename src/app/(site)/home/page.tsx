import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";

const HomeContainer = newStyledElement.div(styles.homeContainer);

export const metadata: Metadata = assembleMetadata({
	title: "Home",
});

export default function HomePage() {
	return <HomeContainer></HomeContainer>;
}
