import { useState, useEffect } from "react"
import styles from "./ShoppingCart.module.css"

const API_URL = "https://fakestoreapi.com/products"

export default function ShoppingCart() {

    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})

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
                const data = await response.json()
                setProducts(data)
            } catch (err) {
                console.err("Err: ", err.message)
            }
        }
        fetchProducts()
    }, [])

    function getProductsArrayFromCart() {
        const prodArray = Object.keys(cart).map(id => {
            const prod = products.find(x => Number(x.id) === Number(id))
            const prodCopy = {...prod, quantity: cart[id]}
            return prodCopy
        })
        return prodArray
    }

    function handleAddToCart(id) {
        setCart(prev => {
            const newCart = {...prev}
            newCart[id] = (newCart[id] || 0) + 1
            return newCart
        })
    }

    function handleIncreaseCartQuantity(id, operator) {
        const newQtyFn = (q) => operator === "+" ? q + 1 : q - 1
        setCart(prev => {
            const newCart = {...prev}
            const newQty = newQtyFn(newCart[id])
            if (newQty <= 0) {
                delete newCart[id] // Remove from cart
            } else {
                newCart[id] = newQty
            }
            return newCart
        })
    }

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
                                    <button onClick={() => handleAddToCart(p.id)}>add to cart</button>
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
                                            <button className={styles.quantityBtn} onClick={() => handleIncreaseCartQuantity(p.id, "-")}>-</button>
                                            <span style={{marginInline: "10px"}}>{p.quantity}</span>
                                            <button className={styles.quantityBtn} onClick={() => handleIncreaseCartQuantity(p.id, "+")}>+</button>
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