"use client";

import { GenericPageContainer } from "@/components/(Design)";
import {
	RadialMenuProvider,
	useRadialMenu,
} from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { RadialMenuSubmitProps } from "@/components/(SPECIAL)/components/RadialMenu/types";
import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";

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
				onMouseDown={(event) => {
					if (event.button !== 0) return;

					event.preventDefault();

					radialMenu.openNew({
						mode: "switch",
						id: "teste",
						name: "Testador",
						overlay: true,
						screenPosition: {
							x: event.clientX,
							y: event.clientY,
						},
						actionPosition: {
							x: event.clientX,
							y: event.clientY,
						},
						options: [
							{
								id: "1",
								name: "Test 1",
								icon: "A",
								fastKey: "a",
								backgroundColor: StandartBackgroundColor["blue"],
							},
							{
								id: "2",
								name: "Test 2",
								options: [
									{
										id: "2-1",
										name: "Test 2 1",
										icon: "Z",
										fastKey: "P",
										description: "Bananada",
									},
									{
										id: "2-2",
										name: "Test 2 2",
										icon: "ZZ",
									},
								],
								icon: "B",
								fastKey: "b",
							},
							{
								id: "3",
								name: "Test 3",
								icon: "C",
							},
							{
								id: "4",
								name: "Test 4",
								icon: <StpIcon name="Acorn" />,
								fastKey: "F",
								backgroundColor: StandartBackgroundColor["blue"],
								options: [
									{
										id: "4-1",
										name: "Test 4-1",
										icon: "F",
									},
									{
										id: "4-2",
										name: "Test 4-2",
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
