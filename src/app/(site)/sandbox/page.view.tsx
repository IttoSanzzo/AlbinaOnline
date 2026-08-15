"use client";

import { GenericPageContainer } from "@/components/(Design)";

export default function SandboxPageContent() {
	return (
		<GenericPageContainer title="Sandobox">
			<div>
				<button
					onClick={async (event) => {
						event.preventDefault();
					}}>
					Test
				</button>
			</div>
		</GenericPageContainer>
	);
}
