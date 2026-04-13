export function tapProps(fn: () => void) {
    return {
      onClick: fn,
      onPointerDown: (e: React.PointerEvent) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
      },
      onPointerUp: (e: React.PointerEvent) => {
        e.preventDefault();
        fn();
      },
      style: { touchAction: "manipulation", userSelect: "none" as const },
    };
  }