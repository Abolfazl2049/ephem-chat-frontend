import React, { useEffect, useId, useRef } from "react";

export default function OnViewEnter({
  children = <div className="size-0.5"></div>,
  root: rootId,
  onViewEnter,
}: {
  children?: React.ReactNode;
  onViewEnter: () => void;
  root?: string;
}) {
  const observer = useRef<IntersectionObserver>(null);
  const id = useId();

  useEffect(() => {
    const el = document.getElementById(id);
    const root = rootId ? document.getElementById(rootId) : document.body;
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onViewEnter();
        }
      },
      { threshold: 0.1, root },
    );
    if (el) observer.current.observe(el);
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return <div id={id}>{children}</div>;
}
