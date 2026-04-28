import type { Camera } from "../types/camera";
import { worldToScreen } from "./camera";
import type { CanvasElement } from "../types/elements";
import renderRectangle from "./renderRectangle";

type RenderSceneParams = {
  ctx: CanvasRenderingContext2D;
  camera: Camera;
  elements: CanvasElement[];
  draftElements: CanvasElement[];
};
export function renderScene({
  ctx,
  camera,
  elements,
  draftElements,
}: RenderSceneParams) {
  for (const element of elements) {
    if (element.type === "rectangle") renderRectangle({ element, ctx, camera });
  }

  for (const element of draftElements) {
    if (element.type === "rectangle") renderRectangle({ element, ctx, camera });
  }
}
