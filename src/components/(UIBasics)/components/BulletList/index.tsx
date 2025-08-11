import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { UIBasics } from "../..";

export const BulletListContainer = newStyledElement.div(
	styles.bulletListContainer
);

interface BulletListProps {
	items?: string[];
	withDivisor?: boolean;
}
export function BulletList({ items, withDivisor = false }: BulletListProps) {
	const divisor = withDivisor ? <UIBasics.Divisor /> : <></>;

	return (
		<BulletListContainer>
			{divisor}
			{!items || items.length === 0 ? (
				<UIBasics.Bullet />
			) : (
				items.map((item, index) => (
					<UIBasics.Bullet
						key={index}
						children={item}
					/>
				))
			)}
			{divisor}
		</BulletListContainer>
	);
}
