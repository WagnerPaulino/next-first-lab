export interface Ingredient {
    _key: string;
    unit: string;
    wholeNumber: number;
    fraction: number
    ingredient: {
        name: string;
    }
}