document.addEventListener("DOMContentLoaded", function () {
  const cartItems = typeof getCart === "function" ? getCart() : [];

  if (!cartItems || cartItems.length === 0) {
    alert("Keranjang anda kosong. Tambahkan produk terlebih dahulu.");
    window.location.href = "../view/cart.html";
    return;
  }

  const itemsList = document.getElementById("itemsList");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");

  const totals =
    typeof calculateTotal === "function"
      ? calculateTotal(cartItems)
      : { subtotal: 0, tax: 0, shippingCost: 0, total: 0 };

  function formatRupiahSafe(v) {
    if (typeof formatRupiah === "function") return formatRupiah(v);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v);
  }

  // render item
  itemsList.innerHTML = "";
  cartItems.forEach(function (it) {
    const div = document.createElement("div");
    div.className = "flex items-center justify-between";
    div.innerHTML = `<div class="flex items-center gap-3"><img src="${it.gambar_barang}" class="w-14 h-14 object-cover rounded" alt=""/><div><div class="font-medium">${it.nama_barang}</div><div class="text-sm text-gray-600">x ${it.quantity || 1}</div></div></div><div class="font-semibold">${formatRupiahSafe((it.harga_barang || 0) * (it.quantity || 1))}</div>`;
    itemsList.appendChild(div);
  });

  subtotalEl.textContent = formatRupiahSafe(totals.subtotal);
  taxEl.textContent = formatRupiahSafe(totals.tax);
  shippingEl.textContent = formatRupiahSafe(totals.shippingCost);
  totalEl.textContent = formatRupiahSafe(totals.total);

  
  const user = sessionStorage.getItem("user");
  if (user) {
    try {
      const u = JSON.parse(user);
      if (u.name) document.getElementById("name").value = u.name;
      if (u.email) document.getElementById("email").value = u.email;
    } catch (e) {
    }
  }

  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const payment = document.getElementById("payment").value;

    if (!name || !email || !address) {
      alert("Lengkapi nama, email, dan alamat pengiriman.");
      return;
    }

    const order = {
      id: Date.now(),
      customer: { name: name, email: email, address: address, phone: phone },
      items: cartItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shippingCost: totals.shippingCost,
      total: totals.total,
      paymentMethod: payment,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const existingOrders = JSON.parse(sessionStorage.getItem("orders") || "[]");
    existingOrders.push(order);
    sessionStorage.setItem("orders", JSON.stringify(existingOrders));

    if (typeof saveCart === "function") saveCart([]);

    window.location.href = "../view/confirmation.html?orderId=" + order.id;
  });
});
