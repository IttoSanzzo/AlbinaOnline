export function createSectorPath(
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number,
) {
	const outerStartX = Math.cos(startAngle) * outerRadius;
	const outerStartY = Math.sin(startAngle) * outerRadius;
	const outerEndX = Math.cos(endAngle) * outerRadius;
	const outerEndY = Math.sin(endAngle) * outerRadius;
	const innerEndX = Math.cos(endAngle) * innerRadius;
	const innerEndY = Math.sin(endAngle) * innerRadius;
	const innerStartX = Math.cos(startAngle) * innerRadius;
	const innerStartY = Math.sin(startAngle) * innerRadius;
	return [
		`M ${outerStartX} ${outerStartY}`,
		`A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}`,
		`L ${innerEndX} ${innerEndY}`,
		`A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}`,
		"Z",
	].join(" ");
}
