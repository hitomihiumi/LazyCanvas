import { ILayersManager } from "../../types/managers/LayersManager";
import { AnyLayer } from "../../types/types";
import { Group } from "../components/Group";

export class LayersManager implements ILayersManager {
    map: Map<string, AnyLayer | Group>;

    constructor() {
        this.map = new Map();
    }

    /**
     * Add a layer to the map
     * @param layers {AnyLayer[] | Group[]} - The `layer` or `group` to add to the map
     */
    public add(...layers: AnyLayer[] | Group[]): void {
        for (const layer of layers) {
            if (this.map.has(layer.id)) throw new Error("Layer already exists");
            this.map.set(layer.id, layer);
        }
    }

    /**
     * Remove a layer from the map
     * @param ids {string[]} - The `id` of the layer or group to remove
     */
    public remove(...ids: string[]): void {
        for (const id of ids) {
            this.map.delete(id);
        }
    }

    /**
     * Clear all layers from the map
     */
    public clear(): void {
        this.map.clear();
    }

    /**
     * Get a layer from the map
     * @param id {string} - The `id` of the layer or group to get
     */
    public get(id: string): AnyLayer | Group | undefined {
        return this.map.get(id);
    }

    /**
     * Check if a layer exists in the map
     * @param id {string} - The `id` of the layer or group to check
     */
    public has(id: string): boolean {
        return this.map.has(id);
    }

    /**
     * Get the size of the map
     */
    public size(): number {
        return this.map.size;
    }

    /**
     * Get the values of the map
     */
    public values(): IterableIterator<AnyLayer | Group> {
        return this.map.values();
    }

    /**
     * Get the keys of the map
     */
    public keys(): IterableIterator<string> {
        return this.map.keys();
    }

    /**
     * Get the entries of the map
     */
    public entries(): IterableIterator<[string, AnyLayer | Group]> {
        return this.map.entries();
    }

    /**
     * For each layer in the map
     * @param callbackfn {Function} - The `callback` function to execute
     */
    public forEach(callbackfn: (value: AnyLayer | Group, key: string, map: Map<string, AnyLayer | Group>) => void) {
        this.map.forEach(callbackfn);
    }

    /**
     * Convert the map to a JSON object
     */
    public toJSON(): object {
        return Object.fromEntries(this.map);
    }

    /**
     * Convert a JSON object to the map
     * @param json {object} - The `json` object to convert
     */
    public fromJSON(json: object): void {
        this.map = new Map(Object.entries(json));
    }

    /**
     * Convert the map to an array
     */
    public toArray(): Array<AnyLayer | Group> {
        return Array.from(this.map.values());
    }

    /**
     * Convert an array to the map
     * @param array {Array<AnyLayer | Group>} - The `array` to convert
     */
    public fromArray(array: Array<AnyLayer | Group>): void {
        this.map = new Map(array.map(l => [l.id, l]));
    }
}
