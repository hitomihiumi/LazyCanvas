import { AnyLayer } from "../types";
import { Group } from "../../structures/components/Group";

export interface ILayersManager {
    map: Map<string, AnyLayer | Group>;
}
