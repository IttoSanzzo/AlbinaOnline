import { CSSProperties } from "react";

interface SpaceProps {
	height?:
		| 1
		| 2
		| 3
		| 4
		| 5
		| 6
		| 7
		| 8
		| 10
		| 12
		| 15
		| 16
		| 17
		| 18
		| 20
		| 30
		| 40
		| 52
		| 64
		| 80;
}
export function Space({ height = 5 }: SpaceProps) {
	const style: CSSProperties = {
		height: `var(--sp-${height})`,
	};
	return <div style={style} />;
}
