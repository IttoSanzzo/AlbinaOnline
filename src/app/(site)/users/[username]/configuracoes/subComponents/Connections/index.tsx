import { UIBasics } from "@/components/(UIBasics)";
import { ConnectedAccunt } from "./subComponents/ConnectedAccount";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { OtherConnection } from "./subComponents/OtherConnection";
import { ReactiveConnection } from "./subComponents/ReactiveConnection";

const ConnectedAccountsContainer = newStyledElement.div(
	styles.connectedAccountsContainer,
);

export function Connections() {
	return (
		<UIBasics.Box backgroundColor="gray">
			<UIBasics.Header
				children={"Conexões"}
				textColor="gray"
				textAlign="center"
			/>
			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					headerType="h3"
					textColor="gray"
					children={"Contas Externas"}
				/>
				<ConnectedAccountsContainer>
					<ConnectedAccunt
						provider={"discord"}
						label={"Discord"}
						icon={
							"https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://discord.com&size=50"
						}
					/>
				</ConnectedAccountsContainer>
			</UIBasics.Box>
			<UIBasics.Box backgroundColor="darkGray">
				<UIBasics.Header
					headerType="h3"
					textColor="gray"
					children={"Outras Conexões"}
				/>
				<ConnectedAccountsContainer>
					<OtherConnection
						label={"Reactive"}
						icon={
							"https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://reactive.fugi.tech/library&size=50"
						}
						childrenGenerator={ReactiveConnection}
					/>
				</ConnectedAccountsContainer>
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
