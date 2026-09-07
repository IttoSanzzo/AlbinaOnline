"use client";

import { GenericPageContainer } from "@/components/(Design)";
import {
	RadialMenuProvider,
	useRadialMenu,
} from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { RadialMenuSubmitProps } from "@/components/(SPECIAL)/components/RadialMenu/types";

export default function SandboxPageContent() {
	return (
		<GenericPageContainer title="Sandobox">
			<RadialMenuProvider>
				<SandboxContent />
			</RadialMenuProvider>
		</GenericPageContainer>
	);
}

function SandboxContent() {
	const radialMenu = useRadialMenu();

	return (
		<div>
			<button
				onClick={(event) => {
					event.preventDefault();

					radialMenu.openNew({
						id: "teste",
						overlay: true,
						screenPosition: { x: 960, y: 540 },
						actionPosition: { x: 960, y: 540 },
						options: [
							{
								id: "1",
								name: "Test 1",
								data: {},
								icon: "A",
							},
							{
								id: "2",
								name: "Test 2",
								data: {},
								options: [
									{
										id: "2-1",
										name: "Test 2 1",
										data: {},
										icon: "Z",
									},
									{
										id: "2-2",
										name: "Test 2 2",
										data: {},
										icon: "ZZ",
									},
								],
								icon: "B",
							},
							{
								id: "3",
								name: "Test 3",
								data: {},
								icon: "C",
							},
							{
								id: "4",
								name: "Test 4",
								data: {},
								icon: "D",
								options: [
									{
										id: "4-1",
										name: "Test 4-1",
										data: {},
										icon: "F",
									},
									{
										id: "4-2",
										name: "Test 4-2",
										data: {},
										icon: "H",
									},
								],
							},
						],
						onSubmit: function (props: RadialMenuSubmitProps): void {
							props.close();
						},
					});
				}}>
				Test
			</button>
		</div>
	);
}
