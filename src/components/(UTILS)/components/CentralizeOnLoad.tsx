"use client";

import { useEffect, useRef } from "react";

export function CentralizeOnLoad() {
	const ref = useRef<HTMLSpanElement | null>(null);

	useEffect(() => {
		if (!ref.current) return;
		ref.current.scrollIntoView({
			block: "center",
			inline: "center",
			behavior: "instant",
		});
	}, [ref.current]);

	return <span ref={ref} />;
}
