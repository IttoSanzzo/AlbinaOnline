import { NotionBullet, NotionDivisor } from "@/components/(NotionBased)";
import { NotionBulletListContainer } from "./styledElements";

interface NotionBulletListProps {
	items?: string[];
	withDivisor?: boolean;
}

export function NotionBulletList({
	items,
	withDivisor = false,
}: NotionBulletListProps) {
	const divisor = withDivisor ? <NotionDivisor /> : <></>;

	return (
		<NotionBulletListContainer>
			{divisor}
			{!items || items.length === 0 ? (
				<NotionBullet />
			) : (
				items.map((item, index) => (
					<NotionBullet
						key={index}
						children={item}
					/>
				))
			)}
			{divisor}
		</NotionBulletListContainer>
	);
}
