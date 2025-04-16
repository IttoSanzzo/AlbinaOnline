import { NotionHeader, NotionDivisor } from "@/components/(NotionBased)";

interface GenericPageFooterProps {
	version: string;
}

export function GenericPageFooter({ version }: GenericPageFooterProps) {
	return (
		<>
			<NotionDivisor />
			<NotionHeader
				textAlign="center"
				headerType="h5"
				textColor="darkGray">
				{`『⇅ Ver. ${version}』`}
			</NotionHeader>
		</>
	);
}
