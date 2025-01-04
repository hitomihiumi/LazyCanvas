import { GradientColorStop, GradientPoint, IGradient } from "../../types/helpers/Gradient";
import { GradientType } from "../../types/types";

export class Gradient implements IGradient {
    type: GradientType;
    points: Array<GradientPoint>;
    stops: Array<GradientColorStop>;

    constructor() {
        this.type = GradientType.Linear;
        this.points = [];
        this.stops = [];
    }

    /**
     * Set the type of the gradient
     * @param type {GradientType} - The `type` of the gradient. Can be `linear`, `radial`, or `conic`
     */
    setType(type: GradientType) {
        this.type = type;
        return this;
    }

    /**
     * Add a point to the gradient
     * @param points {GradientPoint[]} - The `points` to add to the gradient. `{ x: number, y: number }`
     */
    addPoints(...points: GradientPoint[]) {
        this.points.push(...points);
        return this;
    }

    /**
     * Add a stop to the gradient
     * @param stops {GradientColorStop[]} - The `stops` to add to the gradient. `{ color: string, position: number }`
     */
    addStops(...stops: GradientColorStop[]) {
        this.stops.push(...stops);
        return this;
    }

    /**
     * @returns {IGradient}
     */
    toJSON(): IGradient {
        return {
            type: this.type,
            points: this.points,
            stops: this.stops,
        };
    }
}
