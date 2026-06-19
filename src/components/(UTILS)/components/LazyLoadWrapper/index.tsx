import { ReactNode, useLayoutEffect, useRef, useState } from "react";

interface LazyLoadWrapperProps {
	children: ReactNode;
}
export function LazyLoadWrapper({ children }: LazyLoadWrapperProps) {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setVisible(true);
				observer.disconnect();
			}
		});

		if (ref.current) observer.observe(ref.current);

		return () => observer.disconnect();
	}, []);

	if (!visible)
		return (
			<div
				ref={ref}
				style={{ display: "flex", width: "1px", height: "1px" }}
			/>
		);
	return children;
}
