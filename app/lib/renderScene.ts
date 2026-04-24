import type { Camera } from "../types/camera";
import { worldToScreen } from "./camera";

type RenderSceneParams = {
  ctx: CanvasRenderingContext2D;
  camera: Camera;
};
export function renderScene({ ctx, camera }: RenderSceneParams) {
  const screenPoint = worldToScreen(camera, {
    x: 100,
    y: 100,
  });

  ctx.fillStyle = "red";

  ctx.fillRect(
    screenPoint.x,
    screenPoint.y,
    200 * camera.zoom,
    200 * camera.zoom,
  );
}
