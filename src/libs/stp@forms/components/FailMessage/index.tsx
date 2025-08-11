import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const SimpleMessageContainer = newStyledElement.div(
	styles.simpleMessageContainer
);

interface SimpleMessageProps {
	message?: string;
	color?: "gray" | "green" | "red" | "teal" | "blue" | "violet" | "mauve";
}
export function SimpleMessage({ message, color }: SimpleMessageProps) {
	if (!message || message === "") return null;
	return (
		<SimpleMessageContainer
			children={message}
			className={color}
		/>
	);
}
