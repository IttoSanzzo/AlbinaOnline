export function HotBar() {
	return (
		<div
			style={{
				display: "flex",
				position: "absolute",
				bottom: "12px",
				left: "50%",
				transform: "translateX(-50%)",
				height: "50px",
				width: "650px",
				backgroundColor: "black",
				borderRadius: "var(--rd-md)",
				opacity: "0.4",
			}}
		/>
	);
}
