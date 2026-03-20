import { UIBasics } from "@/components/(UIBasics)";

interface GenericPageFooterProps {
	version: string;
	lastUpdate?: string;
	lastUpdateWithHour?: boolean;
	lastUpdateWithMinute?: boolean;
	lastUpdateWithSecond?: boolean;
}
export function GenericPageFooter({
	version,
	lastUpdate,
	lastUpdateWithHour = false,
	lastUpdateWithMinute = false,
	lastUpdateWithSecond = false,
}: GenericPageFooterProps) {
	const lastUpdateString = lastUpdate
		? new Intl.DateTimeFormat("pt-BR", {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
				hour12: true,
				hour: lastUpdateWithHour ? "2-digit" : undefined,
				minute: lastUpdateWithMinute ? "2-digit" : undefined,
				second: lastUpdateWithSecond ? "2-digit" : undefined,
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
