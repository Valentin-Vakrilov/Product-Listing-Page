window.addEventListener("load", solve);

function solve() {
    let BASE_URL = "http://127.0.0.1:5500/Product%20Listing%20Page/server/data/";
    let productsContainers = document.getElementById("products-container");
    let watchesCategory = document.getElementById("watches");
    let glassesCategory = document.getElementById("glasses");
    let shoesCategory = document.getElementById("shoes");
    let priceSlider = document.getElementById("price-slider");
    let priceLabel = document.getElementById("price-label");
    let ratingSelect = document.getElementById("rating-select");
    let allProducts = [];
    let sortingSelect = document.getElementById("sorting-select");
    let totalProducts = 0;
    let filteredItems = [];
    let loadMoreBtn = document.getElementById("load-more");
    let productsDisplayed = 0;
    let categoryNameContainer = document.getElementById("category-name");

    watchesCategory.addEventListener("click", function () {
        loadProductsHandler("watches");
    });

    glassesCategory.addEventListener("click", function () {
        loadProductsHandler("glasses");
    });

    shoesCategory.addEventListener("click", function () {
        loadProductsHandler("shoes");
    });

    priceSlider.addEventListener("input", function () {
        priceLabel.textContent = `${priceSlider.value}`;
        applyFilters();
    });

    ratingSelect.addEventListener("change", function () {
        applyFilters();
    });

    sortingSelect.addEventListener("change", function () {
        applyFilters();
    });

    function loadProductsHandler(category) {
        productsContainers.innerHTML = "";
        categoryNameContainer.innerHTML = "";
        allProducts = [];
        filteredItems = [];
        loadMoreBtn.disabled = false;
        productsDisplayed = 0;

        fetch(`${BASE_URL}/${category}.json`, { method: "GET" })
            .then((result) => result.json())
            .then((data) => {
                totalProducts = Object.keys(data).length;
                let categoryName = document.createElement("h1");
                categoryName.textContent = `${category.toUpperCase()}`;
                let categoryDescription = document.createElement("p");
                categoryDescription.textContent = `explore our trendy models`;
                categoryNameContainer.appendChild(categoryName);
                categoryNameContainer.appendChild(categoryDescription);
                for (const item in data) {
                    allProducts.push(data[item]);
                    let newDiv = document.createElement("div");
                    newDiv.classList.add("tile");
                    let itemImg = document.createElement("img");
                    itemImg.src = data[item].image;
                    let itemName = document.createElement("h3");
                    itemName.textContent = data[item].name;
                    let itemDescription = document.createElement("p");
                    itemDescription.textContent = data[item].description;
                    let itemPrice = document.createElement("div");
                    itemPrice.textContent = data[item].price;
                    itemPrice.textContent += ` BGN`;
                    let itemRatings = createStarsRating(data[item].rating);
                    let addToCartBtn = document.createElement("button");
                    addToCartBtn.textContent = "Add to Cart";
                    addToCartBtn.addEventListener("click", addToCartHandler);

                    newDiv.appendChild(itemImg);
                    newDiv.appendChild(itemName);
                    newDiv.appendChild(itemDescription);
                    newDiv.appendChild(itemPrice);
                    newDiv.appendChild(itemRatings);
                    newDiv.appendChild(addToCartBtn);
                    productsContainers.appendChild(newDiv);
                }
                applyFilters();
                updateProductCounter();
            })
            .catch((error) => console.error(error))
    }

    function createStarsRating(rating) {
        let starContainer = document.createElement("div");
        starContainer.classList.add("rating-stars");

        for (let i = 1; i <= 5; i++) {
            let star = document.createElement("i");

            if (i <= rating) {
                star.classList.add("fas", "fa-star");
            } else {
                star.classList.add("far", "fa-star");
            }
            starContainer.appendChild(star);
        }

        return starContainer;
    }

    function addToCartHandler(event) {
        let addToCartBtn = event.target;
        let successAlert = document.createElement("p");
        successAlert.innerHTML = "Successfully added to cart!";
        successAlert.style.display = "block";

        let successContainer = document.createElement("div");
        successContainer.appendChild(successAlert);

        addToCartBtn.insertAdjacentElement("afterend", successContainer);

        setTimeout(function () {
            successAlert.style.display = "none";
        }, 2000)
    }

    function applyFilters() {
        productsContainers.innerHTML = "";
        let minPrice = 0;
        let maxPrice = parseFloat(priceSlider.value);
        let selectedRating = parseInt(ratingSelect.value);
        productsDisplayed = 0;

        filteredItems = allProducts.filter((product) => {
            let price = parseFloat(product.price);
            let rating = parseInt(product.rating);
            return price >= minPrice && price <= maxPrice && (selectedRating === 0 || rating === selectedRating);
        })

        let selectedSortType = sortingSelect.value;

        switch (selectedSortType) {
            case "az":
                filteredItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "za":
                filteredItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "price-asc":
                filteredItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "price-desc":
                filteredItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            default:
                break;
        }

        let start = 0;
        let end = 9;

        for (const item of filteredItems.slice(start, end)) {
            let newDiv = document.createElement("div");
            newDiv.classList.add("tile");
            let itemImg = document.createElement("img");
            itemImg.src = item.image;
            let itemName = document.createElement("h3");
            itemName.textContent = item.name;
            let itemDescription = document.createElement("p");
            itemDescription.textContent = item.description;
            let itemPrice = document.createElement("div");
            itemPrice.textContent = item.price;
            itemPrice.textContent += ` BGN`
            let itemRatings = createStarsRating(item.rating);
            let addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "Add to Cart";
            addToCartBtn.addEventListener("click", addToCartHandler);
            productsDisplayed++;

            newDiv.appendChild(itemImg);
            newDiv.appendChild(itemName);
            newDiv.appendChild(itemDescription);
            newDiv.appendChild(itemPrice);
            newDiv.appendChild(itemRatings);
            newDiv.appendChild(addToCartBtn);
            productsContainers.appendChild(newDiv);
        }

        loadMoreBtn.addEventListener("click", loadMoreHandler);

        updateProductCounter();
    }

    function loadMoreHandler() {
        let start = document.querySelectorAll(".tile").length;
        let end = start + 9;

        for (const item of filteredItems.slice(start, end)) {
            let newDiv = document.createElement("div");
            newDiv.classList.add("tile");
            let itemImg = document.createElement("img");
            itemImg.src = item.image;
            let itemName = document.createElement("h3");
            itemName.textContent = item.name;
            let itemDescription = document.createElement("p");
            itemDescription.textContent = item.description;
            let itemPrice = document.createElement("div");
            itemPrice.textContent = item.price;
            itemPrice.textContent += ` BGN`;
            let itemRatings = createStarsRating(item.rating);
            let addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "Add to Cart";
            addToCartBtn.addEventListener("click", addToCartHandler);
            productsDisplayed++;

            newDiv.appendChild(itemImg);
            newDiv.appendChild(itemName);
            newDiv.appendChild(itemDescription);
            newDiv.appendChild(itemPrice);
            newDiv.appendChild(itemRatings);
            newDiv.appendChild(addToCartBtn);
            productsContainers.appendChild(newDiv);
        }

        if (end >= filteredItems.length) {
            loadMoreBtn.disabled = true;
        }

        updateProductCounter();
    }

    function updateProductCounter() {
        let productCounter = document.getElementById("products-counter");
        productCounter.textContent = `Showing ${productsDisplayed} out of ${totalProducts} products`;
    }

    watchesCategory.click();
}
