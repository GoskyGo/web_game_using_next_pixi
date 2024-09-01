import { Point, Polygon } from 'pixi.js';
import config from './config';


export interface Tile {
    x: number
    y: number
    block: Block
}

export interface Block {
    url: string
    offset: number
    hitboxOffset: number
}

export function screenToIso(x: number, y: number, width: number, height: number) {
    const isoX = (x - y) * (width / 2);
    const isoY = (x + y) * (height / 4.15);
    return [isoX, isoY];
}

export function createHitbox() {
    const hitboxes = []
    for (const point of config.hitbox) {
        hitboxes.push(new Point(point[0], point[1]));
    }
    
    return new Polygon(hitboxes);
}

export function generateGrid(rows: number, cols: number, block: Block) {
    const grid: Tile[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid.push({ x: i, y: j, block });
        }
    }
    return grid;
}