import { useEffect, useRef, useState } from "react";

export const GlidingText = ({ children, className = "", textClassName = "" }) => {
	const containerRef = useRef(null);
	const textRef = useRef(null);
	const [scrollDistance, setScrollDistance] = useState(0);

	useEffect(() => {
		const container = containerRef.current;
		const text = textRef.current;
		if (!container || !text) return undefined;

		const measureText = () => {
			setScrollDistance(Math.max(text.scrollWidth - container.clientWidth, 0));
		};

		measureText();

		const resizeObserver = new ResizeObserver(measureText);
		resizeObserver.observe(container);
		resizeObserver.observe(text);

		return () => resizeObserver.disconnect();
	}, [children]);

	return (
		<div ref={containerRef} className={`min-w-0 overflow-hidden whitespace-nowrap ${className}`}>
			<span
				ref={textRef}
				className={`inline-block ${scrollDistance > 0 ? "animate-[textGlide_14s_ease-in-out_infinite]" : ""} ${textClassName}`}
				style={{ "--text-glide-distance": `-${scrollDistance}px` }}
			>
				{children}
			</span>
		</div>
	);
};
