"use client";

import { GenericPageContainer } from "@/components/(Design)";
// import { Language, translate3 } from "@/libs/stp@translate";

export default function SandboxPageContent() {
	return (
		<GenericPageContainer title="Sandobox">
			<div>
				<button
					onClick={async (event) => {
						event.preventDefault();

						const response = await fetch(
							`https://www.dnd5eapi.co/api/2014/monsters/tarrasque?lang=pt-BR`,
						);
						if (!response.ok) return;
						console.log(await response.json());
					}}>
					Test
				</button>
			</div>
		</GenericPageContainer>
	);
}
