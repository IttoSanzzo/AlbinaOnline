import { NotionHeader, NotionDivisor } from "@/components/(NotionBased)";

interface GenericPageFooterProps {
	version: string;
	lastUpdate?: string;
}
export function GenericPageFooter({
	version,
	lastUpdate,
}: GenericPageFooterProps) {
	const lastUpdateString = lastUpdate
		? new Intl.DateTimeFormat("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
		  }).format(new Date(lastUpdate))
		: null;

	return (
		<>
			<NotionDivisor />
			{lastUpdateString && (
				<NotionHeader
					textAlign="center"
					headerType="h5"
					textColor="darkGray">
					{`Ultima atualização em ${lastUpdateString}`}
				</NotionHeader>
			)}
			<NotionHeader
				textAlign="center"
				headerType="h5"
				textColor="darkGray">
				{`『⇅ Ver. ${version}』`}
			</NotionHeader>
		</>
	);
}
