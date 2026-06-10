import { UIBasics } from "@/components/(UIBasics)";
import { ExternalLogins } from "@/libs/stp@types";

interface ReactiveConnectionProps {
	externalLogins: ExternalLogins | null;
}
export function ReactiveConnection({
	externalLogins,
}: ReactiveConnectionProps) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: "10px",
			}}>
			{externalLogins != null &&
				(externalLogins["discord"] == undefined ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							textAlign: "center",
							border: "2px solid var(--cl-gray-600)",
							aspectRatio: "1/1",
							height: "10vw",
							minHeight: "100px",
							maxHeight: "150px",
							cursor: "pointer",
						}}
						onClick={() => {
							window.open(
								"https://reactive.fugi.tech",
								"_blank",
								"popup,width=1000,height=800",
							);
						}}>
						<UIBasics.Text textColor="gray">
							Discord não conectado
						</UIBasics.Text>
					</div>
				) : (
					<div
						style={{ cursor: "pointer" }}
						onClick={() => {
							window.open(
								"https://reactive.fugi.tech",
								"_blank",
								"popup,width=1000,height=800",
							);
						}}>
						<iframe
							tabIndex={-1}
							src={`https://reactive.fugi.tech/basic/${externalLogins["discord"].externalUserId}`}
							style={{
								border: "2px solid var(--cl-gray-600)",
								aspectRatio: "1/1",
								height: "10vw",
								minHeight: "100px",
								maxHeight: "150px",
								pointerEvents: "none",
							}}
						/>
					</div>
				))}
		</div>
	);
}
