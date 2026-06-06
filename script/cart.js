const STORAGE_KEY = "cart";
const API_PATH = "../data/Product.json";

const getCart = () => JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
const saveCart = (cart) =>
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
const refresh = () => typeof renderCart === "function" && renderCart();

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const getCartCount = (cart) =>
  cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

const fetchProduct = async (productId) => {
  const data = await fetch(API_PATH).then((r) => r.json());
  return (data.products || []).find((p) => p.id === Number(productId)) || null;
};

window.tambahKeranjang = async (productId) => {
  const product = await fetchProduct(productId);
  if (!product) {
    console.error("Produk tidak ditemukan:", productId);
    return;
  }

  const cart = getCart();
  const item = cart.find((i) => i.id === product.id);

  if (item) {
    item.quantity = (item.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      nama_barang: product.nama_barang,
      gambar_barang: product.gambar_barang,
      harga_barang: product.harga_barang,
      kategori: product.kategori,
      quantity: 1,
    });
  }

  saveCart(cart);
  refresh();
  alert(product.nama_barang + " ditambahkan ke keranjang!");
};

window.ubahJumlah = (productId, delta) => {
  const cart = getCart();
  const item = cart.find((i) => i.id === Number(productId));
  if (!item) return;

  item.quantity = (item.quantity || 1) + delta;
  if (item.quantity <= 0) {
    saveCart(cart.filter((i) => i.id !== Number(productId)));
  } else {
    saveCart(cart);
  }
  refresh();
};

window.hapusProduk = (productId) => {
  saveCart(getCart().filter((i) => i.id !== Number(productId)));
  refresh();
};

window.kosongkanKeranjang = () => {
  saveCart([]);
  refresh();
};

window.checkout = () => {
  if (getCart().length === 0) {
    alert("Keranjang anda kosong!");
    return;
  }
  window.location.href = "../view/checkout.html";
};

function renderCart() {
  const container = document.getElementById("Cart");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="mx-10 my-10 rounded-2xl bg-white p-8 shadow-lg">
        <h2 class="text-2xl font-bold mb-3">Keranjang anda masih kosong</h2>
        <p class="text-gray-600 mb-6">Tambahkan produk favorit kamu untuk melihatnya di sini.</p>
        <a href="./product.html" class="inline-block rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800 hover:scale-105 transition-all duration-200">
          Lihat Produk
        </a>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.harga_barang * (item.quantity || 1),
    0,
  );

  const itemRows = cart
    .map(
      (item) => `
        <div class="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg md:flex-row md:items-center">
          <img src="${item.gambar_barang}" alt="${item.nama_barang}" class="h-32 w-32 rounded-xl object-cover" />
          <div class="flex-1">
            <p class="text-sm text-gray-500">${item.kategori}</p>
            <h3 class="text-lg font-bold">${item.nama_barang}</h3>
            <p class="text-red-500 font-semibold">${formatRupiah(item.harga_barang)}</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="ubahJumlah(${item.id}, -1)" class="rounded-full border px-3 py-1">-</button>
            <span class="min-w-8 text-center">${item.quantity || 1}</span>
            <button onclick="ubahJumlah(${item.id}, 1)" class="rounded-full border px-3 py-1">+</button>
          </div>
          <div class="text-right">
            <p class="font-semibold">${formatRupiah(item.harga_barang * (item.quantity || 1))}</p>
            <button onclick="hapusProduk(${item.id})" class="mt-2 text-sm text-red-500">Hapus</button>
          </div>
        </div>
      `,
    )
    .join("");

  container.innerHTML = `
    <div class="mx-10 my-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div class="space-y-4">${itemRows}</div>
      <aside class="rounded-2xl bg-white p-6 shadow-lg">
        <h2 class="text-xl font-bold mb-4">Ringkasan</h2>
        <div class="flex justify-between text-sm text-gray-600">
          <span>Total item</span>
          <span>${getCartCount(cart)}</span>
        </div>
        <div class="flex justify-between mt-3 text-lg font-bold">
          <span>Subtotal</span>
          <span>${formatRupiah(subtotal)}</span>
        </div>
        <button onclick="checkout()" class="mt-6 w-fit rounded-xl bg-black px-6 py-3 text-xl text-white hover:bg-zinc-800 transition-colors duration-300">
          Checkout
        </button>
        <button onclick="kosongkanKeranjang()" class="mt-3 w-fit flex rounded-xl border px-4 py-3 text-gray-700 hover:bg-gray-300 hover:text-gray-800 transition-colors duration-300">
          Kosongkan Keranjang
        </button>
      </aside>
    </div>
  `;
}

if (document.getElementById("Cart")) {
  renderCart();
}
