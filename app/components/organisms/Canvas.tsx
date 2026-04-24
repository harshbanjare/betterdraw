"use client";

import { useEffect, useRef } from "react";
import { useCanvasCamera } from "@/app/hooks/useCanvasCamera";
import { useCanvasRenderer } from "@/app/hooks/useCanvasRenderer";
import { useCanvasInput } from "@/app/hooks/useCanvasInput";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    cameraRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
  } = useCanvasCamera({ canvasRef });

  const { invalidate, cancelRender } = useCanvasRenderer({
    canvasRef,
    cameraRef,
  });

  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    onKeyDown,
    onKeyUp,
  } = useCanvasInput({
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    invalidate,
    handleKeyDown,
    handleKeyUp,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    invalidate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      invalidate();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelRender();
    };
  }, []);

  return <canvas ref={canvasRef} className="block h-screen w-screen" />;
}
