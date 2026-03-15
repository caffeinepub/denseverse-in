import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Watch {
    id: bigint;
    name: string;
    description: string;
    specs: Specs;
    category: string;
    brand: string;
    image: string;
    price: bigint;
}
export interface Specs {
    movement: string;
    caseSize: string;
    strap: string;
    waterResistance: string;
    crystal: string;
    material: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addWatch(name: string, brand: string, category: string, price: bigint, image: string, description: string, specs: Specs): Promise<Watch>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteWatch(id: bigint): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWatch(id: bigint): Promise<Watch | null>;
    getWatches(): Promise<Array<Watch>>;
    initializeWatchesIfEmpty(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateWatch(id: bigint, name: string, brand: string, category: string, price: bigint, image: string, description: string, specs: Specs): Promise<Watch>;
}
