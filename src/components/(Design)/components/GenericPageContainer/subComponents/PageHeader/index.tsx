import Image, { StaticImageData } from "next/image";
import { PageHeaderContainer, PageTitle } from "./styledElements";

interface PageHeaderProps {
	title: string;
	src: string | StaticImageData;
}

export function PageHeader({ title, src }: PageHeaderProps) {
	return (
		<PageHeaderContainer>
			<Image
				src={`${src}?size=64`}
				alt="Page's favicon"
				width={64}
				height={64}
			/>
			<PageTitle>{title}</PageTitle>
		</PageHeaderContainer>
	);
}
