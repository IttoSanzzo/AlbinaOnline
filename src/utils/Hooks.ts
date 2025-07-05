import { useEffect, useState } from "react";

export function useVisibleSections(ids: string[]) {
	const [visibleId, setVisibleId] = useState<string | null>(null);

	useEffect(() => {
		if (ids.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible.length > 0) {
					setVisibleId(visible[0].target.id);
				}
			},
			{
				rootMargin: "0px 0px -80% 0px",
				threshold: 0.1,
			}
		);

		const elements = ids
			.map((id) => document.getElementById(id))
			.filter((element): element is HTMLElement => element !== null);

		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, [ids]);

	return visibleId;
}
