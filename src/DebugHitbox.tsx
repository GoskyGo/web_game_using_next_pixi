import { Graphics } from "@pixi/react";
import { Polygon } from "pixi.js"

interface DebugHitboxProps {
    hitbox: Polygon
    x: number
    y: number
}

const DebugHitbox = (props: DebugHitboxProps) => {
    return (
        <Graphics
            draw={g => {
            g.clear();
            g.lineStyle(2, 0xFF0000);
            g.beginFill(0xFF0000, 0.2);
            g.drawPolygon(props.hitbox);
            g.endFill();
            }}
            x={props.x}
            y={props.y}
        />
    )
}

export default DebugHitbox