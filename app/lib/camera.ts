import type { Camera } from "../types/camera";
import type { Point } from "../types/point";

export function worldToScreen(camera: Camera, point: Point): Point {
  return {
    x: (point.x - camera.x) * camera.zoom,
    y: (point.y - camera.y) * camera.zoom,
  };
}

export function screenToWorld(camera: Camera, point: Point): Point {
  return {
    x: point.x / camera.zoom + camera.x,
    y: point.y / camera.zoom + camera.y,
  };
}

export function zoomAtPoint(
  camera: Camera,
  point: Point,
  nextZoom: number,
): Camera {
  const worldPoint = screenToWorld(camera, point);
  return {
    x: worldPoint.x - point.x / nextZoom,
    y: worldPoint.y - point.y / nextZoom,
    zoom: nextZoom,
  };
}

export function clampZoom(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
