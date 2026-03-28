import { useState } from "react";

type Item = {
    id: number;
    name: string;
};

export default function ShoppingCart() {
    const [cart, setCart] = useState<Item[]>([]);

    const cartHtml = cart.map((item) =>
    <li key={item.id}>{item.name}</li>);

    function addItems() {
        const input = document.getElementById("items") as HTMLInputElement;

        const items = structuredClone(cart);

        const newItem = {
            id: items.length + 1,
            name: input.value
        };
        items.push(newItem);
        setCart(items);

        input.value = "";
    }

    return (
        <div>
            <h2>Shopping Cart</h2>

            <fieldset>
                <input type="text" id="items" />
                <input type="button" value="Go!" onClick={addItems} />
            </fieldset>
            <ul>{cartHtml}</ul>
        </div>
    )
}