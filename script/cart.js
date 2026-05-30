const STORAGE_KEY = "cart";

function getApiPath() {
  const path = window.location.pathname;

  if (path.includes("/view/")) {
    return "../data/Product.json";
  }

  return "../data/Product.json";
}

function getCart() {
  const storedCart = sessionStorage.getItem(STORAGE_KEY);

  if (!storedCart) {
    return [];
  }

  try {
    const cart = JSON.parse(storedCart);

    if (Array.isArray(cart)) {
      return cart;
    }
  } catch (error) {
    console.error("Gagal membaca keranjang dari sessionStorage:", error);
  }

  sessionStorage.removeItem(STORAGE_KEY);
  return [];
}

function saveCart(cartItems) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

function toNumber(value) {
  return Number(value);
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getCartCount(cartItems) {
  let total = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    total += item.quantity || 1;
  }

  return total;
}

function renderCartIfExists() {
  if (typeof renderCart === "function") {
    renderCart();
  }
}

function buildCartItem(product) {
  return {
    id: product.id,
    nama_barang: product.nama_barang,
    gambar_barang: product.gambar_barang,
    harga_barang: product.harga_barang,
    kategori: product.kategori,
    quantity: 1,
  };
}

async function fetchProduct(productId) {
  const response = await fetch(getApiPath());
  const data = await response.json();
  const products = data.products || [];
  const id = toNumber(productId);

  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }

  return null;
}

window.tambahKeranjang = async function (productId) {
  const product = await fetchProduct(productId);

  if (!product) {
    console.error("Produk tidak ditemukan untuk id:", productId);
    return;
  }

  const cartItems = getCart();
  let foundItem = null;

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].id === product.id) {
      foundItem = cartItems[i];
      break;
    }
  }

  if (foundItem) {
    foundItem.quantity = (foundItem.quantity || 1) + 1;
  } else {
    cartItems.push(buildCartItem(product));
  }

  saveCart(cartItems);
  renderCartIfExists();
  alert(product.nama_barang + " ditambahkan ke keranjang!");
};

window.ubahJumlah = function (productId, delta) {
  const id = toNumber(productId);
  const cartItems = getCart();

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].id === id) {
      const item = cartItems[i];
      item.quantity = (item.quantity || 1) + delta;

      if (item.quantity <= 0) {
        cartItems.splice(i, 1);
      }

      break;
    }
  }

  saveCart(cartItems);
  renderCartIfExists();
};

window.hapusProduk = function (productId) {
  const id = toNumber(productId);
  const cartItems = getCart();
  const newCart = [];

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].id !== id) {
      newCart.push(cartItems[i]);
    }
  }

  saveCart(newCart);
  renderCartIfExists();
};

window.kosongkanKeranjang = function () {
  saveCart([]);
  renderCartIfExists();
};

function renderCart() {
  const container = document.getElementById("Cart");

  if (!container) {
    return;
  }

  const cartItems = getCart();

  if (cartItems.length === 0) {
    container.innerHTML =
      "" +
      '<div class="mx-10 my-10 rounded-2xl bg-white p-8 shadow-lg">' +
      '<h2 class="text-2xl font-bold mb-3">Keranjang anda masih kosong</h2>' +
      '<p class="text-gray-600 mb-6">Tambahkan produk favorit kamu untuk melihatnya di sini.</p>' +
      '<a href="./product.html" class="inline-block rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800 hover:scale-105 transition-all duration-200">' +
      "Lihat Produk</a>" +
      "</div>";
    return;
  }

  let subtotal = 0;
  let itemRows = "";

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const quantity = item.quantity || 1;
    const itemTotal = item.harga_barang * quantity;
    subtotal += itemTotal;

    itemRows +=
      "" +
      '<div class="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg md:flex-row md:items-center">' +
      '<img src="' +
      item.gambar_barang +
      '" alt="' +
      item.nama_barang +
      '" class="h-32 w-32 rounded-xl object-cover" />' +
      '<div class="flex-1">' +
      '<p class="text-sm text-gray-500">' +
      item.kategori +
      "</p>" +
      '<h3 class="text-lg font-bold">' +
      item.nama_barang +
      "</h3>" +
      '<p class="text-red-500 font-semibold">' +
      formatRupiah(item.harga_barang) +
      "</p>" +
      "</div>" +
      '<div class="flex items-center gap-3">' +
      '<button onclick="ubahJumlah(' +
      item.id +
      ', -1)" class="rounded-full border px-3 py-1">-</button>' +
      '<span class="min-w-8 text-center">' +
      quantity +
      "</span>" +
      '<button onclick="ubahJumlah(' +
      item.id +
      ', 1)" class="rounded-full border px-3 py-1">+</button>' +
      "</div>" +
      '<div class="text-right">' +
      '<p class="font-semibold">' +
      formatRupiah(itemTotal) +
      "</p>" +
      '<button onclick="hapusProduk(' +
      item.id +
      ')" class="mt-2 text-sm text-red-500">Hapus</button>' +
      "</div>" +
      "</div>";
  }

  container.innerHTML =
    "" +
    '<div class="mx-10 my-10 grid gap-6 lg:grid-cols-[2fr,1fr]">' +
    '<div class="space-y-4">' +
    itemRows +
    "</div>" +
    '<aside class="rounded-2xl bg-white p-6 shadow-lg">' +
    '<h2 class="text-xl font-bold mb-4">Ringkasan</h2>' +
    '<div class="flex justify-between text-sm text-gray-600">' +
    "<span>Total item</span>" +
    "<span>" +
    getCartCount(cartItems) +
    "</span>" +
    "</div>" +
    '<div class="flex justify-between mt-3 text-lg font-bold">' +
    "<span>Subtotal</span>" +
    "<span>" +
    formatRupiah(subtotal) +
    "</span>" +
    "</div>" +
    '<button class="mt-6 w-full rounded-xl bg-black px-4 py-3 text-white hover:bg-zinc-800">Checkout</button>' +
    '<button onclick="kosongkanKeranjang()" class="mt-3 w-full rounded-xl border px-4 py-3 text-gray-700 hover:bg-gray-100">Kosongkan Keranjang</button>' +
    "</aside>" +
    "</div>";
}

if (document.getElementById("Cart")) {
  renderCart();
}
