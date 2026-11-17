export interface Product {
    id: number,
    category: string,
    description: string,
    image: string,
    price: number,
    rating: Rating,
    title: string
}

export interface Rating {
    count: number,
    rate: number
}

export type Cart = Record<string, number>

export type CartProduct = Product & {
    quantity: number
}

export type CartAction = 
    | { type: "INCREMENT", id: number }
    | { type: "DECREMENT", id: number }