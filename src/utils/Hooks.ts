import { useEffect, useRef, useState } from "react";

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
			},
		);

		const elements = ids
			.map((id) => document.getElementById(id))
			.filter((element): element is HTMLElement => element !== null);

		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, [ids]);

	return visibleId;
}

export function useRendersPerSecond(): number {
	const renders = useRef<number[]>([]);
	const [rendersPerSecond, setRendersPerSecond] = useState(0);

	renders.current.push(Date.now());

	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			renders.current = renders.current.filter((time) => now - time <= 3000);
			setRendersPerSecond(renders.current.length / 3);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return rendersPerSecond;
}
