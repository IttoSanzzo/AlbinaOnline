import Image, { StaticImageData } from "next/image";
import { PageHeaderContainer, PageTitle } from "./styledElements";

interface PageHeaderProps {
	title: string;
	icon: string;
	borderColor?: string;
}

export function PageHeader({ title, icon, borderColor }: PageHeaderProps) {
	const finalIcon = icon[0] === "/" ? icon : `${icon}?size=64`;
	return (
		<PageHeaderContainer>
			<Image
				src={finalIcon}
				alt="Page's favicon"
				width={512}
				height={512}
				style={
					borderColor ? { backgroundColor: `${borderColor}40` } : undefined
				}
			/>
			<PageTitle>{title}</PageTitle>
		</PageHeaderContainer>
	);
}
