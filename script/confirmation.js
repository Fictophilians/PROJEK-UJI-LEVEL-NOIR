const orderId = new URLSearchParams(window.location.search).get("orderId");
const orders = JSON.parse(sessionStorage.getItem("orders") || "[]");
const order = orders.find((o) => String(o.id) === String(orderId));
const confirmation = document.getElementById("confirmation");

const money = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const orderItems = (order.items || [])
  .map(
    (item) => `
      <div class="flex justify-between py-2 border-b">
        <div>
          <div class="font-medium">${item.nama_barang}</div>
          <div class="text-sm text-gray-600">x ${item.quantity || 1}</div>
        </div>
        <div class="font-semibold">${money((item.harga_barang || 0) * (item.quantity || 1))}</div>
      </div>
    `,
  )
  .join("");

const missingOrderHtml = `
  <h2 class="text-xl font-bold">Pesanan tidak ditemukan</h2>
  <p class="mt-3">Pastikan Anda membuat pesanan terlebih dahulu.</p>
  <a href="../view/cart.html" class="text-blue-600 underline mt-4 inline-block">Kembali ke keranjang</a>
`;

const renderConfirmation = () => {
  if (!order) {
    confirmation.innerHTML = missingOrderHtml;
    return;
  }

  const tax = order.tax || 0;
  const subtotal = order.subtotal || 0;

  confirmation.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">Terima kasih! Pesanan Anda diterima.</h2>
    <p class="text-sm text-gray-600 mb-4">ID Pesanan: <strong>${order.id}</strong></p>
    <div class="mb-4">
      Nama: <strong>${order.customer?.name || "-"}</strong><br />
      Email: <strong>${order.customer?.email || "-"}</strong>
    </div>
    <div class="bg-gray-50 rounded p-4 mb-4">
      ${orderItems}
      <div class="flex justify-between text-lg mt-3 pb-2 border-b">
        <span>Subtotal:</span><span>${money(subtotal)}</span>
      </div>
      <div class="flex justify-between text-lg py-2 border-b">
        <span>Pajak 10%:</span><span>${money(tax)}</span>
      </div>
      <div class="flex justify-between font-semibold text-lg mt-3 pt-2">
        Total:<span>${money(order.total)}</span>  
      </div>
    </div>
    <a href="../Homepage.html" class="rounded-xl bg-black px-6 py-3 text-white inline-block hover:bg-zinc-800 transition-colors duration-300">Kembali ke Beranda</a>
    <a href="../view/product.html" class="ml-3 text-gray-700 hover:underline">Lanjutkan Belanja</a>
  `;
};

document.addEventListener("DOMContentLoaded", renderConfirmation);
