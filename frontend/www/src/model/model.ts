import { User } from "./user";

/**
 * Our readonly single source of truth model
 */
export interface Model {
    readonly users: User[]
}