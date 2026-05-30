const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const api = "../Product.json";

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    const products = data.products || [];
    let hasil = "";
    const product = products.find((p) => p.id === parseInt(id));

    if (product) {
      hasil += `
        <div class="bg-white rounded-lg shadow-md overflow-hidden flex p-4">
          <img src="${product.gambar_barang}" alt="${product.nama_barang}" class="w-145 h-145 m-3 object-cover rounded-lg outline-gray-300 " />
          <div class="mt-4 ">
            <h3 class="text-2xl font-bold mb-2">${product.nama_barang}</h3>
            <p class="text-gray-500 mb-2">Kategori: ${product.kategori}</p>
            <p class="text-gray-600 mb-4">${product.deskripsi_barang}</p>
            <p class="text-xl font-semibold text-red-500">Rp ${product.harga_barang.toLocaleString("id-ID")}</p>
            <p class="text-sm text-gray-500 mt-2">Stok: ${product.stock_barang}</p>
            <button
      onclick="tambahKeranjang(${product.id})"
      class="w-full mt-4 bg-black text-white py-3 rounded-xl shadow-lg
      hover:bg-zinc-800 hover:scale-[1.02]
      transition-all duration-300 ">

      + Tambah ke Keranjang

    </button>
          </div>
        </div>
      `;
    } else {
      hasil = `<p class="text-red-500">Produk tidak ditemukan. Periksa kembali tautan atau id produk.</p>`;
    }

    document.getElementById("Detail-produk").innerHTML = hasil;
  })
  .catch((error) => {
    console.error("Gagal memuat detail produk:", error);
    document.getElementById("Detail-produk").innerHTML =
      `<p class="text-red-500">Terjadi kesalahan memuat detail produk.</p>`;
  });

