// document.getElementById('loadProducts').addEventListener('click', () => {
//     // Step 1 Ask the server for the data
//     fetch('/api/products')
//     .then(response => response.json()) //Step 2 : Conver the response to Json
//     .then(data => {
//         //Show the data on the page
//         let html = '<ul>';
//         data.forEach(p => {
//             html += `<li>${p.name} - ${p.manufacturer} (£${p.price})</li>`;
//         });
//         html += '</ul>';
//         document.getElementById('results').innerHTML = html;
//     });
// });

async function loadProducts() {
    const response = await fetch('/api/products');
    const data = await response.json();

    let html = '<ul>';
        data.forEach(p => {
            html += `<li>${p.name} - ${p.manufacturer} (£${p.price})</li>`;
        });
        html += '</ul>';
        document.getElementById('results').innerHTML = html;
}

document.getElementById('loadProducts').addEventListener('click', loadProducts)

// Access the element to add a product in
document.getElementById("addProduct").addEventListener('click', async () => {
    const name = document.getElementById("name").value;
    const manufacturer = document.getElementById("manufacturer").value;
    const price = document.getElementById("price").value;

    const product = {name, manufacturer, price};
    
    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(product)
    });
    const result = await response.json();
    document.getElementById('message').innerText = result.message || result.error;

    loadProducts();
});
