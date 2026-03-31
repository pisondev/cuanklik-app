async function hitungProfit() {
    console.log("1. Tombol ditekan! Mengambil data dari layar...");

    const payload = {
        item_name: document.getElementById('item_name').value,
        fixed_cost: parseFloat(document.getElementById('fixed_cost').value),
        variable_cost: parseFloat(document.getElementById('variable_cost').value),
        target_margin_percentage: parseFloat(document.getElementById('margin').value)
    };

    console.log("2. Data siap dikirim ke Go:", payload);

  try {
        let response = await webui.call('CalculateProfit', JSON.stringify(payload));
        
        console.log("3. Balasan Mentah dari Go:", response);

        while (typeof response === 'string') {
            response = JSON.parse(response);
        }

        console.log("4. Object siap dipakai:", response);

        document.getElementById('area-hasil').style.display = 'block';
        document.getElementById('hasil-teks').innerHTML = `
            <b>Produk:</b> ${response.item_name} <br>
            <b>HPP:</b> Rp ${response.cogs.toLocaleString('id-ID')} <br>
            <b>Harga Jual Ideal:</b> Rp ${response.ideal_selling_price.toLocaleString('id-ID')} <br>
            <b>BEP (Unit):</b> ${response.bep_units} porsi/barang <br>
            <b>BEP (Rupiah):</b> Rp ${response.bep_revenue.toLocaleString('id-ID')}
        `;
        console.log("5. Sukses menampilkan hasil di layar!");

    } catch (error) {
        console.error("Gagal terhubung ke Go Backend atau Parse JSON:", error);
        alert("Terjadi kesalahan komputasi! Cek Console (F12).");
    }
}