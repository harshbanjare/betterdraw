import type { RectangleElement } from "../types/elements";
import type { Camera } from "../types/camera";
import { worldToScreen } from "./camera";

type RenderRectangleParams = {
  element: RectangleElement;
  camera: Camera;
  ctx: CanvasRenderingContext2D;
};

const renderRectangle = ({ element, ctx, camera }: RenderRectangleParams) => {
  const position = worldToScreen(camera, { x: element.x, y: element.y });
  ctx.fillStyle = element.color;
  ctx.fillRect(
    position.x,
    position.y,
    element.width * camera.zoom,
    element.height * camera.zoom,
  );
};

export default renderRectangle;
