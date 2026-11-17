import { useState, useReducer, useEffect } from "react"
import styles from "./ShoppingCart.module.css"
import type { Product, Cart, CartProduct, CartAction } from "./types"

const API_URL = "https://fakestoreapi.com/products"

export default function ShoppingCart() {

    // Swapping out useState for useReducer:

    // define a useReducer function with a reducer function and initial state
    // reducer unction takes in state and action, uses a switch statement that takes in action.type
        // case {{type}} return new state
        // dont forget to include a default, which can also just throw an error
    // destructure state and disaptch function, apply dispatch to a node
    // 

    const [products, setProducts] = useState<Product[]>([])
    // const [cart, setCart] = useState({})

    const [state, dispatch] = useReducer(reducer, {} as Cart)

    const cartProducts = getProductsArrayFromCart()
    // Best to memoize this in production
    const cartTotal = cartProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(API_URL)
                if (!response.ok) {
                    throw new Error("Couldn't fetch products")
                }
                const data: Product[] = await response.json()
                setProducts(data)
            } catch (err) {
                console.error("Err: ", err)
            }
        }
        fetchProducts()
    }, [])

    function reducer(state: Cart, action: CartAction) {
        switch(action.type) {
            case "INCREMENT": {
                const newCart = {...state}
                const newQty = (newCart[action.id] || 0) + 1
                newCart[action.id] = newQty
                return newCart
            }
            case "DECREMENT": {
                const newCart = {...state}
                const newQty = (newCart[action.id] || 0) - 1
                if (newQty <= 0) {
                    delete newCart[action.id] // Remove from cart
                } else {
                    newCart[action.id] = newQty
                }
                return newCart
            }
            default:
                return state
                // throw new Error("Invalid action: " +  action.type + " For id: " + action.id)
        }
    }

    function getProductsArrayFromCart(): CartProduct[] {
        const prodArray = Object.keys(state).map(id => {
            const prod = products.find(x => Number(x.id) === Number(id)) 
            if (!prod) return null
            const prodCopy = {...prod, quantity: state[id]}
            return prodCopy
        }).filter((p): p is CartProduct => p !== null)
        return prodArray
    }

    // function handleAddToCart(id) {
    //     setCart(prev => {
    //         const newCart = {...prev}
    //         newCart[id] = (newCart[id] || 0) + 1
    //         return newCart
    //     })
    // }

    // function handleIncreaseCartQuantity(id, operator) {
    //     const newQtyFn = (q) => operator === "+" ? q + 1 : q - 1
    //     setCart(prev => {
    //         const newCart = {...prev}
    //         const newQty = newQtyFn(newCart[id])
    //         if (newQty <= 0) {
    //             delete newCart[id] // Remove from cart
    //         } else {
    //             newCart[id] = newQty
    //         }
    //         return newCart
    //     })
    // }

    return (
        <div className={styles.container}>
            <div className={styles.productsWrapper}>
                <h2 style={{marginBottom: "15px"}}>Products</h2>
                {
                    products.map(p => {
                        return (
                            <div key={p.id} className={styles.prodWrapper}>
                                <img className={styles.prodImage} src={p.image} alt="" />
                                <div>
                                    <div className={styles.prodTitle}>{p.title}</div>
                                    <div className={styles.prodDescription}>{p.description}</div>
                                    <div className={styles.prodPrice}>${p.price}</div>
                                    <div className={styles.prodRating}>{p.rating.rate}</div>
                                    <button onClick={() => dispatch({type: "INCREMENT", id: p.id})}>add to cart</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.cartwrapper}>
                <h2 style={{marginBottom: "15px"}}>Cart</h2>
                <div>
                    {
                        cartProducts.map(p => {
                            return (
                                <div key={p.id} className={styles.prodWrapper}>
                                    <img className={styles.prodImage} src={p.image} alt="" />
                                    <div>
                                        <div className={styles.prodTitle}>{p.title}</div>
                                        <div className={styles.prodPrice}>${p.price}</div>
                                        <div className={styles.quantityWrapper}>
                                            <button className={styles.quantityBtn} onClick={() => dispatch({type: "DECREMENT", id: p.id})}>-</button>
                                            <span style={{marginInline: "10px"}}>{p.quantity}</span>
                                            <button className={styles.quantityBtn} onClick={() => dispatch({type: "INCREMENT", id: p.id})}>+</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div>
                    <h2>Total: ${cartTotal}</h2>
                </div>
            </div>
        </div>
    )
}