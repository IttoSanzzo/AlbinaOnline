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
						// try {
						// const text = await translate3("Bordão Mágico", {
						// to: Language.LATIN,
						// });
						// } catch (ex) {
						// console.error(ex);
						// }
					}}>
					Translate
				</button>
			</div>
		</GenericPageContainer>
	);
}
