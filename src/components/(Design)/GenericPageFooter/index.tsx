import NotionHeader from "@/components/(NotionBased)/NotionHeader";
import NotionDivisor from "@/components/(NotionBased)/NotionDivisor";

interface GenericPageFooterProps {
	version: string;
}

export default function GenericPageFooter({ version }: GenericPageFooterProps) {
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
