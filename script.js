const SUPABASE_URL = "https://hmpwdrxyskganqfrmiqk.supabase.co";
const SUPABASE_KEY = "sb_publishable_TZ_z47yt2SIzkrimNyfMbQ_2jxG0I7y";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const food = document.getElementById("food");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const total = document.getElementById("total");
const customerName = document.getElementById("customerName");
const placeOrder = document.getElementById("placeOrder");
const message = document.getElementById("message");

function calculateTotal() {

    const selectedFood = food.options[food.selectedIndex];

    if (!selectedFood || !selectedFood.dataset.price) {
        price.value = "₱0.00";
        total.value = "₱0.00";
        return;
    }

    const foodPrice = Number(selectedFood.dataset.price);
    const qty = Number(quantity.value);

    price.value = "₱" + foodPrice.toFixed(2);

    const totalPrice = foodPrice * qty;

    total.value = "₱" + totalPrice.toFixed(2);
}

food.addEventListener("change", calculateTotal);
quantity.addEventListener("input", calculateTotal);

placeOrder.addEventListener("click", async function () {

    const name = customerName.value.trim();
    const selectedFood = food.options[food.selectedIndex];

    if (name === "") {
        message.textContent = "Please enter customer name.";
        message.style.color = "red";
        return;
    }

    if (food.value === "") {
        message.textContent = "Please select a food.";
        message.style.color = "red";
        return;
    }

    const foodName = selectedFood.value;
    const foodPrice = Number(selectedFood.dataset.price);
    const qty = Number(quantity.value);
    const totalPrice = foodPrice * qty;

    if (qty < 1) {
        message.textContent = "Quantity must be at least 1.";
        message.style.color = "red";
        return;
    }

    const { error } = await supabaseClient
        .from("orders")
        .insert([
            {
                customer_name: name,
                food_name: foodName,
                price: foodPrice,
                quantity: qty,
                total: totalPrice
            }
        ]);

    if (error) {
        console.error(error);

        message.textContent = "Failed to place order.";
        message.style.color = "red";

        return;
    }

    message.textContent = "Order successfully placed!";
    message.style.color = "green";

    customerName.value = "";
    food.value = "";
    quantity.value = 1;

    calculateTotal();
});
