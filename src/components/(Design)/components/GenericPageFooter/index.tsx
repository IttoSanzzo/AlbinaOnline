import { UIBasics } from "@/components/(UIBasics)";

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
			<UIBasics.Divisor />
			{lastUpdateString && (
				<UIBasics.Header
					textAlign="center"
					headerType="h5"
					textColor="darkGray">
					{`Ultima atualização em ${lastUpdateString}`}
				</UIBasics.Header>
			)}
			<UIBasics.Header
				textAlign="center"
				headerType="h5"
				textColor="darkGray">
				{`『⇅ Ver. ${version}』`}
			</UIBasics.Header>
		</>
	);
}
