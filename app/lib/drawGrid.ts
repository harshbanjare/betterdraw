import { worldToScreen } from "./camera";
import type { Camera } from "../types/camera";

type DrawGridParams = {
  camera: Camera;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export function drawGrid({ camera, ctx, width, height }: DrawGridParams) {
  const gridSize = 40;

  //Background
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, width, height);

  //Grid color and width
  ctx.strokeStyle = "#1e1e1e";
  ctx.lineWidth = 1;

  const left = camera.x;
  const top = camera.y;
  const right = camera.x + width / camera.zoom;
  const bottom = camera.y + height / camera.zoom;

  const startX = Math.floor(left / gridSize) * gridSize;
  const endX = Math.ceil(right / gridSize) * gridSize;

  const startY = Math.floor(top / gridSize) * gridSize;
  const endY = Math.floor(bottom / gridSize) * gridSize;

  for (let worldX = startX; worldX <= endX; worldX += gridSize) {
    const screenPoint = worldToScreen(camera, { x: worldX, y: 0 });
    ctx.beginPath();
    ctx.moveTo(screenPoint.x, 0);
    ctx.lineTo(screenPoint.x, height);
    ctx.stroke();
  }
  for (let worldY = startY; worldY <= endY; worldY += gridSize) {
    const screenPoint = worldToScreen(camera, { x: 0, y: worldY });
    ctx.beginPath();
    ctx.moveTo(0, screenPoint.y);
    ctx.lineTo(width, screenPoint.y);
    ctx.stroke();
  }
}
