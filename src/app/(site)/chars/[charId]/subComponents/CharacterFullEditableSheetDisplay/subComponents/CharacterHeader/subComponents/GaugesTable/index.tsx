import { NotionTable } from "@/components/(NotionBased)";

interface GaugesTableProps {}
export function GaugesTable({}: GaugesTableProps) {
	return (
		<NotionTable
			fixedLinePositions={[1, 3, 4, 5]}
			fixedLineWidths={[20, 5, 10, 5]}
			tableData={{
				tableLanes: [
					["HP", "1", "/", "1", "+", "1"],
					["EP", "1", "/", "1", "+", "1"],
					["MP", "1", "/", "1", "+", "1"],
				],
			}}
		/>
	);
}
