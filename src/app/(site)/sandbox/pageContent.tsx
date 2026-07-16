"use client";

import { GenericPageContainer } from "@/components/(Design)";
import { generateAutoMinedSpells } from "../../../../Data/GitIgnored/AutoMinedSpellData/generator";

export default function SandboxPageContent() {
	return (
		<GenericPageContainer title="Sandobox">
			<div>
				<button
					onClick={async (event) => {
						event.preventDefault();

						await generateAutoMinedSpells();
					}}>
					Here goes nothing
				</button>
			</div>
		</GenericPageContainer>
	);
}
