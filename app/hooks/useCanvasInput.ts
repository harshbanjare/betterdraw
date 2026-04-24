"use client";

type CanvasInputParams = {
  handlePointerDown: (event: PointerEvent) => void;
  handlePointerMove: (event: PointerEvent) => void;
  handlePointerUp: (event: PointerEvent) => void;
  handleWheel: (event: WheelEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  invalidate: () => void;
};

export function useCanvasInput({
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleWheel,
  handleKeyDown,
  handleKeyUp,
  invalidate,
}: CanvasInputParams) {
  const onPointerDown = (event: PointerEvent) => {
    handlePointerDown(event);
    invalidate();
  };

  const onPointerMove = (event: PointerEvent) => {
    handlePointerMove(event);
    invalidate();
  };

  const onPointerUp = (event: PointerEvent) => {
    handlePointerUp(event);
    invalidate();
  };

  const onWheel = (event: WheelEvent) => {
    handleWheel(event);
    invalidate();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    handleKeyDown(event);
    invalidate();
  };
  const onKeyUp = (event: KeyboardEvent) => {
    handleKeyUp(event);
    invalidate();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    onKeyDown,
    onKeyUp,
  };
}
