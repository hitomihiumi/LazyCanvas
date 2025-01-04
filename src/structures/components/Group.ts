import { IGroup } from "../../types/components/Group";
import {AnyLayer, LayerType} from "../../types/types";
import {generateID} from "../../utils/utils";

export class Group implements IGroup {
    id: string;
    visible: boolean;
    components: Array<any>;

    constructor() {
        this.id = generateID(LayerType.Group);
        this.visible = true;
        this.components = [];
    }

    /**
     * Set the ID of the group
     * @param id {string} - The `id` of the group
     */
    setID(id: string) {
        this.id = id;
        return this;
    }

    /**
     * Set the visibility of the group
     * @param visible {boolean} - The `visibility` of the group
     */
    setVisible(visible: boolean) {
        this.visible = visible;
        return this;
    }

    /**
     * Add a component to the group
     * @param components {any[]} - The `components` to add to the group
     */
    add(...components: AnyLayer[]) {
        this.components.push(...components);
        return this;
    }

    /**
     * Remove a component from the group
     * @param id {any} - The `id` of the component to remove
     */
    remove(id: string) {
        this.components = this.components.filter(c => c.id !== id);
        return this;
    }

    /**
     * Clear all components from the group
     */
    clear() {
        this.components = [];
        return this;
    }

    /**
     * Get a component from the group
     * @param id {string} - The `id` of the component to get
     */
    get(id: string) {
        return this.components.find(c => c.id === id);
    }

    /**
     * Get all components from the group
     */
    getAll() {
        return this.components;
    }

    /**
     * Get the length of the components
     */
    get length() {
        return this.components.length;
    }
}
