"use client";

import { useEffect, useRef, useState } from "react";
import { useCanvasCamera } from "@/app/hooks/useCanvasCamera";
import { useCanvasRenderer } from "@/app/hooks/useCanvasRenderer";
import { useCanvasInput } from "@/app/hooks/useCanvasInput";
import type { CanvasElement } from "@/app/types/elements";
import type { Tool } from "@/app/types/tools";
import type { Point } from "@/app/types/point";
import { screenToWorld } from "@/app/lib/camera";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTool = useRef<Tool>("rectangle");

  const draftStartPointRef = useRef<Point | null>(null);
  const draftRectangleRef = useRef<CanvasElement | null>(null);

  const elementsRef = useRef<CanvasElement[]>([
    {
      id: "1",
      type: "rectangle",
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      color: "green",
    },
  ]);

  const {
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
  } = useCanvasCamera({ canvasRef });

  const { invalidate, cancelRender } = useCanvasRenderer({
    canvasRef,
    cameraRef,
    elementsRef,
    draftRectangleRef,
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

    const handleCanvasPointerDown = (event: PointerEvent) => {
      if (isPanModeActive.current) {
        onPointerDown(event);
      } else if (currentTool.current === "rectangle") {
        let point = screenToWorld(cameraRef.current, {
          x: event.clientX,
          y: event.clientY,
        });

        draftStartPointRef.current = point;
        draftRectangleRef.current = {
          id: Math.random().toString(),
          x: point.x,
          y: point.y,
          type: "rectangle",
          width: 0,
          height: 0,
          color: "red",
        };
        invalidate();
      }
    };
    const handleCanvasPointerMove = (event: PointerEvent) => {
      if (isDraggingRef.current) {
        onPointerMove(event);
        return;
      }

      if (currentTool.current !== "rectangle") return;
      if (!draftStartPointRef.current) return;
      if (!draftRectangleRef.current) return;

      const currentPoint = screenToWorld(cameraRef.current, {
        x: event.clientX,
        y: event.clientY,
      });

      const startPoint = draftStartPointRef.current;

      draftRectangleRef.current = {
        ...draftRectangleRef.current,
        x: Math.min(startPoint.x, currentPoint.x),
        y: Math.min(startPoint.y, currentPoint.y),
        width: Math.abs(currentPoint.x - startPoint.x),
        height: Math.abs(currentPoint.y - startPoint.y),
      };

      invalidate();
    };
    const handleCanvasPointerUp = (event: PointerEvent) => {
      if (isDraggingRef.current) {
        onPointerUp(event);
        return;
      }

      if (currentTool.current !== "rectangle") return;
      if (!draftRectangleRef.current) return;

      elementsRef.current.push(draftRectangleRef.current);

      draftRectangleRef.current = null;
      draftStartPointRef.current = null;
      invalidate();
    };

    const handleCanvasPointerCancel = (event: PointerEvent) => {
      if (isDraggingRef.current) {
        onPointerUp(event);
        return;
      }

      if (!draftRectangleRef.current) return;

      draftRectangleRef.current = null;
      draftStartPointRef.current = null;

      invalidate();
    };
    canvas.addEventListener("pointerdown", handleCanvasPointerDown);
    canvas.addEventListener("pointermove", handleCanvasPointerMove);
    canvas.addEventListener("pointerup", handleCanvasPointerUp);
    canvas.addEventListener("pointercancel", handleCanvasPointerCancel);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      canvas.removeEventListener("pointerdown", handleCanvasPointerDown);
      canvas.removeEventListener("pointermove", handleCanvasPointerMove);
      canvas.removeEventListener("pointerup", handleCanvasPointerUp);
      canvas.removeEventListener("pointercancel", handleCanvasPointerCancel);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelRender();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      className="block h-screen w-screen"
      style={{ cursor }}
    />
  );
}
