"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const HomeContainer = newStyledElement.div(styles.homeContainer);

export default function Home() {
	return <HomeContainer></HomeContainer>;
}
