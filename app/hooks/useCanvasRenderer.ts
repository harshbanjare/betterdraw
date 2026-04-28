"use client";

import { useRef } from "react";
import { drawGrid } from "@/app/lib/drawGrid";
import { renderScene } from "@/app/lib/renderScene";
import type { Camera } from "@/app/types/camera";
import type { CanvasElement } from "../types/elements";

type CanvasRendererParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraRef: React.RefObject<Camera>;
  elementsRef: React.RefObject<CanvasElement[]>;
  draftRectangleRef: React.RefObject<CanvasElement | null>;
};

export function useCanvasRenderer({
  canvasRef,
  cameraRef,
  elementsRef,
  draftRectangleRef,
}: CanvasRendererParams) {
  const rafIdRef = useRef<number | null>(null);
  const isRenderScheduledRef = useRef(false);

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawGrid({
      ctx,
      width: canvas.width,
      height: canvas.height,
      camera: cameraRef.current,
    });

    const draftElements = draftRectangleRef.current
      ? [draftRectangleRef.current]
      : [];

    renderScene({
      ctx,
      camera: cameraRef.current,
      elements: elementsRef.current,
      draftElements: draftElements,
    });
  };

  const invalidate = () => {
    if (isRenderScheduledRef.current) return;

    isRenderScheduledRef.current = true;

    rafIdRef.current = window.requestAnimationFrame(() => {
      isRenderScheduledRef.current = false;
      render();
    });
  };

  const cancelRender = () => {
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
    }
  };

  return {
    invalidate,
    cancelRender,
  };
}
