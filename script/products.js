const api = "../data/Product.json";

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    const products = data.products || [];
    let hasil = "";

    products.slice(0, 6).forEach((product) => {
      hasil += `
        <div class="rounded-lg overflow-hidden shadow-lg p-4 
hover:scale-103 transition-all duration-300 
bg-white/20 outline-3 outline-gray-300">

    <img
    src="${product.gambar_barang}"
    alt="${product.nama_barang}"
    class="w-full h-130  rounded-lg"/>

    <p class="text-gray-500 mt-3">
      ${product.kategori}
    </p>

    <a href="./view/detail.html?id=${product.id}" class="font-bold mt-2 block hover:underline">
      ${product.nama_barang}
    </a>

    <p class="text-red-500 font-semibold mt-2">
      Rp ${product.harga_barang.toLocaleString("id-ID")}
    </p>


    <button
      onclick="tambahKeranjang(${product.id})"
      class="w-full mt-4 bg-black text-white py-3 rounded-xl shadow-lg
      hover:bg-zinc-800 hover:scale-[1.02]
      transition-all duration-300 ">

      + Tambah ke Keranjang

    </button>

</div>
      `;
    });

    document.getElementById("product-card").innerHTML = hasil;
  })
  .catch((error) => {
    console.error("Gagal memuat data produk:", error);
  });
