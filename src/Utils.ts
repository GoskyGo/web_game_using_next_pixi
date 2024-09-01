import { Graphics } from "pixi.js";

export function drawBackgroundLines(graphics: Graphics, width: number, height: number, margin: number = 50) {
    graphics.clear();
    graphics.lineStyle(1, 0xE4E4E4, 1);

    for (let x = 0; x <= width; x += margin) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += margin) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
  };