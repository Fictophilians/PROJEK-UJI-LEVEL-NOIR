const SHIPPING_COST = 25000;
const TAX_RATE = 0.1;

const $ = (id) => document.getElementById(id);
const getFormValues = () => ({
  name: $("name").value.trim(),
  email: $("email").value.trim(),
  address: $("address").value.trim(),
  phone: $("phone").value.trim(),
  payment: $("payment").value,
});

document.addEventListener("DOMContentLoaded", () => {
  const cart = getCart();

  if (!cart.length) {
    alert("Keranjang anda kosong!");
    return (window.location.href = "../view/cart.html");
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.harga_barang * (item.quantity || 1),
    0,
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  // Render items
  $("itemsList").innerHTML = cart
    .map(
      (item) => `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${item.gambar_barang}" class="w-14 h-14 object-cover rounded" alt="" />
            <div>
              <div class="font-medium">${item.nama_barang}</div>
              <div class="text-sm text-gray-600">x ${item.quantity || 1}</div>
            </div>
          </div>
          <div class="font-semibold">${formatRupiah(item.harga_barang * (item.quantity || 1))}</div>
        </div>
      `,
    )
    .join("");

  // Show totals
  $("subtotal").textContent = formatRupiah(subtotal);
  $("tax").textContent = formatRupiah(tax);
  $("shipping").textContent = formatRupiah(SHIPPING_COST);
  $("total").textContent = formatRupiah(total);

  // Load user data
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user.name) $("name").value = user.name;
    if (user.email) $("email").value = user.email;
  } catch {}

  // Handle submission
  $("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const { name, email, address, phone, payment } = getFormValues();

    if (!name || !email || !address) {
      alert("Lengkapi nama, email, dan alamat!");
      return;
    }

    const order = {
      id: Date.now(),
      customer: { name, email, address, phone },
      items: cart,
      subtotal,
      tax,
      shippingCost: SHIPPING_COST,
      total,
      paymentMethod: payment,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const orders = JSON.parse(sessionStorage.getItem("orders") || "[]");
    orders.push(order);
    sessionStorage.setItem("orders", JSON.stringify(orders));
    saveCart([]);

    window.location.href = `../view/confirmation.html?orderId=${order.id}`;
  });
});
