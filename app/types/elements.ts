export type BaseElement = {
  id: string;
  x: number;
  y: number;
};

export type RectangleElement = BaseElement & {
  type: "rectangle";
  width: number;
  height: number;
  color: string;
};

export type CanvasElement = RectangleElement;
