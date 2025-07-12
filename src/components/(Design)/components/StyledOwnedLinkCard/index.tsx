import { StyledLinkCard, StyledLinkCardProps } from "../StyledLinkCard";
import {
	OwnerPageLinkContainer,
	StyledOwnedLinkCardContainer,
} from "./styledElements";
import { CSSProperties } from "react";
import OwnerPageLink, {
	OwnerPageLinkProps,
} from "./subComponents/OwnerPageLink";

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
		left: size - 32,
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
