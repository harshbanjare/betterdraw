"use client";

import { useRef, useState } from "react";
import { zoomAtPoint, clampZoom } from "@/app/lib/camera";
import type { Camera } from "@/app/types/camera";
import type { Point } from "@/app/types/point";

type CanvasCameraParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

type CursorState = "grabbing" | "grab" | "default";

export function useCanvasCamera({ canvasRef }: CanvasCameraParams) {
  const cameraRef = useRef<Camera>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const lastPointerPositionRef = useRef<Point | null>(null);
  const isDraggingRef = useRef(false);
  const isSpacePressedRef = useRef(false);

  const isPanModeActive = useRef(false);

  const [cursor, setCursor] = useState<CursorState>("default");

  const minZoom = 0.15;
  const maxZoom = 4;

  const handlePointerDown = (event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isSpacePressedRef.current) return;

    isDraggingRef.current = true;
    setCursor("grabbing");

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    canvas.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDraggingRef.current) return;
    if (!lastPointerPositionRef.current) return;

    const deltaX = event.clientX - lastPointerPositionRef.current.x;
    const deltaY = event.clientY - lastPointerPositionRef.current.y;

    cameraRef.current.x -= deltaX / cameraRef.current.zoom;
    cameraRef.current.y -= deltaY / cameraRef.current.zoom;

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDraggingRef.current = false;
    lastPointerPositionRef.current = null;

    if (isSpacePressedRef.current) {
      setCursor("grab");
    } else {
      setCursor("default");
    }

    canvas.releasePointerCapture(event.pointerId);
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    const zoomFactor = 1.1;
    const point: Point = { x: event.clientX, y: event.clientY };

    let nextZoom = cameraRef.current.zoom;

    if (event.deltaY < 0) {
      nextZoom *= zoomFactor;
    } else {
      nextZoom /= zoomFactor;
    }

    nextZoom = clampZoom(nextZoom, minZoom, maxZoom);
    cameraRef.current = zoomAtPoint(cameraRef.current, point, nextZoom);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;

    event.preventDefault();
    isSpacePressedRef.current = true;

    if (!isDraggingRef.current) {
      setCursor("grab");
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;

    isSpacePressedRef.current = false;

    if (isDraggingRef.current) {
      setCursor("grabbing");
    } else {
      setCursor("default");
    }
  };

  isPanModeActive.current = isSpacePressedRef.current;

  return {
    cameraRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    handleKeyDown,
    handleKeyUp,
    cursor,
    isPanModeActive,
    isDraggingRef,
  };
}
