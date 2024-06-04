document.addEventListener('DOMContentLoaded', (event) => {
    const productNameInput = document.getElementById('productNameInput');
    const addButton = document.getElementById('addButton');
    const productList = document.getElementById('productList');
    const remainingProducts = document.getElementById('remainingProducts');
    const purchasedProducts = document.getElementById('purchasedProducts');

    let products = [
        { name: 'Помідори', quantity: 2, purchased: true },
        { name: 'Печиво', quantity: 2, purchased: false },
        { name: 'Сир', quantity: 1, purchased: false }
    ];

    function renderProducts() {
        productList.innerHTML = '';
        remainingProducts.innerHTML = '';
        purchasedProducts.innerHTML = '';

        let remainingCount = 0;
        let purchasedCount = 0;

        products.forEach((product, index) => {
            const productElement = document.createElement('figure');
            productElement.className = 'product';
            productElement.innerHTML = `
                <div class="productName" contenteditable="${!product.purchased}">${product.purchased ? `<s>${product.name}</s>` : product.name}</div>
                <div class="figureCenter">
                    ${!product.purchased ? `
                    <button class="minusButton tooltip" data-tooltip="Зменшити кількість" ${product.quantity === 1 ? 'disabled' : ''}>-<span class="tooltiptext"></span></button>
                    <div class="productQuantity">${product.quantity}</div>
                    <button class="plusButton tooltip" data-tooltip="Збільшити кількість">+<span class="tooltiptext"></span></button>
                    ` : `<div class="productQuantity">${product.quantity}</div>`}
                </div>
                <div class="quantityContainer">
                    ${product.purchased ? '<button class="productStatus tooltip" data-tooltip="Купити" >Не куплено</button>' : '<button class="productStatus tooltip" data-tooltip="Не покупати">Куплено</button>'}
                    ${!product.purchased ? '<button class="closeButton tooltip" data-tooltip="Видалити товар"><span class="tooltiptext"></span></button>' : ''}
                </div>
            `;

            productList.appendChild(productElement);

            // Event listeners
            if (!product.purchased) {
                productElement.querySelector('.plusButton').addEventListener('click', () => changeQuantity(index, 1));
                productElement.querySelector('.minusButton').addEventListener('click', () => changeQuantity(index, -1));
                productElement.querySelector('.closeButton').addEventListener('click', () => removeProduct(index));
                productElement.querySelector('.productName').addEventListener('blur', (e) => editProductName(index, e.target.textContent));
            }
            productElement.querySelector('.productStatus').addEventListener('click', () => togglePurchased(index));

            // Update statistics
            if (product.purchased) {
                purchasedProducts.innerHTML += `<span class="product-item"><s>${product.name}</s><span class="amount"><s>${product.quantity}</s></span></span>`;
                purchasedCount++;
            } else {
                remainingProducts.innerHTML += `<span class="product-item">${product.name}<span class="amount">${product.quantity}</span></span>`;
                remainingCount++;
            }
        });

        if (remainingCount === 0) {
            remainingProducts.previousElementSibling.previousElementSibling.style.display = 'none';
        } else {
            remainingProducts.previousElementSibling.previousElementSibling.style.display = 'block';
        }
    }

    function addProduct() {
        const productName = productNameInput.value.trim();
        if (productName) {
            if (isValidProductName(productName)) {
                products.push({ name: productName, quantity: 1, purchased: false });
                productNameInput.value = '';
                productNameInput.focus();
                renderProducts();
            } else {
                alert('Назва продукту не повинна перевищувати 40 символів.');
            }
        } else {
            alert('Назва продукту не може бути порожньою.');
        }
    }

    function removeProduct(index) {
        products.splice(index, 1);
        renderProducts();
    }

    function togglePurchased(index) {
        products[index].purchased = !products[index].purchased;
        renderProducts();
    }

    function changeQuantity(index, amount) {
        if (products[index].quantity + amount > 0) {
            products[index].quantity += amount;
            renderProducts();
        }
    }

    function editProductName(index, newName) {
        if (isValidProductName(newName)) {
            products[index].name = newName;
            renderProducts();
        } else {
            alert('Назва продукту не повинна перевищувати 40 символів.');
            renderProducts();
        }
    }

    function isValidProductName(name) {
        return name.length <= 40;
    }

    // Event listeners
    addButton.addEventListener('click', (e) => {
        e.preventDefault();
        addProduct();
    });

    productNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addProduct();
        }
    });

    // Initial render
    renderProducts();
});
