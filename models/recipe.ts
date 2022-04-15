import { Ingredient } from "./ingredient";

export interface Recipe {
    _id: string;
    name: string;
    slug: { current: any };
    mainImage: string;
    ingredient: Ingredient[];
    instructions: any[];
    likes: number;
}