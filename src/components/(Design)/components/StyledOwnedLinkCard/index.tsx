import { StyledLinkCard, StyledLinkCardProps } from "../StyledLinkCard";
import { CSSProperties } from "react";
import OwnerPageLink, {
	OwnerPageLinkProps,
} from "./subComponents/OwnerPageLink";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const StyledOwnedLinkCardContainer = newStyledElement.div(
	styles.styledOwnedLinkCardContainer
);
const OwnerPageLinkContainer = newStyledElement.div(
	styles.ownerPageLinkContainer
);

interface StyledOwnedLinkCardProps
	extends StyledLinkCardProps,
		OwnerPageLinkProps {}
export function StyledOwnedLinkCard({
	ownerId,
	size = 150,
	...rest
}: StyledOwnedLinkCardProps) {
	const ownerImageContainerStyle: CSSProperties = {
		top: size - 32,
	};

	return (
		<StyledOwnedLinkCardContainer>
			<StyledLinkCard
				size={size}
				{...rest}
			/>
			<OwnerPageLinkContainer style={ownerImageContainerStyle}>
				<OwnerPageLink ownerId={ownerId} />
			</OwnerPageLinkContainer>
		</StyledOwnedLinkCardContainer>
	);
}
