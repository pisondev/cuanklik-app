let dataKalkulasiSementara = null; 

async function hitungProfit() {
    const payload = {
        item_name: document.getElementById('item_name').value,
        fixed_cost: parseFloat(document.getElementById('fixed_cost').value),
        variable_cost: parseFloat(document.getElementById('variable_cost').value),
        target_margin_percentage: parseFloat(document.getElementById('margin').value)
    };

    try {
        let response = await CalculateProfit(JSON.stringify(payload));
        while (typeof response === 'string') response = JSON.parse(response);

        dataKalkulasiSementara = {
            item_name: payload.item_name,
            fixed_cost: payload.fixed_cost,
            variable_cost: payload.variable_cost,
            target_margin_percentage: payload.target_margin_percentage,
            cogs: response.cogs,
            ideal_selling_price: response.ideal_selling_price,
            bep_units: response.bep_units,
            bep_revenue: response.bep_revenue
        };

        document.getElementById('area-hasil').style.display = 'block';
        document.getElementById('hasil-teks').innerHTML = `
            <b>Produk:</b> ${response.item_name} <br>
            <b>HPP:</b> Rp ${response.cogs.toLocaleString('id-ID')} <br>
            <b>Harga Jual Ideal:</b> Rp ${response.ideal_selling_price.toLocaleString('id-ID')} <br>
            <b>BEP (Unit):</b> ${response.bep_units} <br>
            <b>BEP (Rupiah):</b> Rp ${response.bep_revenue.toLocaleString('id-ID')}
        `;

        if (!isGuestMode && localStorage.getItem('user_data')) {
            document.getElementById('btn-simpan').style.display = 'inline-block';
        }

    } catch (error) {
        console.error("Error Hitung Profit:", error);
        alert("Terjadi kesalahan komputasi.");
    }
}

async function simpanKeRiwayat() {
    if (!dataKalkulasiSementara) return;

    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) {
        alert("Silakan login terlebih dahulu.");
        return;
    }
    const userData = JSON.parse(userDataStr);

    const payload = {
        user_id: userData.user_id,
        ...dataKalkulasiSementara
    };

    try {
        let response = await SaveHistory(JSON.stringify(payload));
        while (typeof response === 'string') response = JSON.parse(response);

        if (response.success) {
            alert("Data berhasil disimpan ke riwayat!");
            document.getElementById('btn-simpan').style.display = 'none'; 
            dataKalkulasiSementara = null; 
        } else {
            alert("Gagal menyimpan: " + response.message);
        }
    } catch (error) {
        console.error("Error Save History:", error);
        alert("Terjadi kesalahan sistem saat menyimpan.");
    }
}