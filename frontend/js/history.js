async function muatRiwayat() {
    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) {
        console.warn("User belum login, menghentikan muat riwayat.");
        return;
    }
    const userData = JSON.parse(userDataStr);

    try {
        let response = await GetHistory(JSON.stringify({ user_id: userData.user_id }));
        
        while (typeof response === 'string') {
            response = JSON.parse(response);
        }

        console.log("Data riwayat diterima:", response);

        const tbody = document.getElementById("tabel_riwayat_body");
        if (!tbody) return; 

        tbody.innerHTML = ""; 

        if (response.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Belum ada riwayat kalkulasi.</td></tr>";
            return;
        }

        response.forEach((item, index) => {
            const tr = document.createElement("tr");
            
            const tanggal = new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.item_name}</td>
                <td>Rp ${item.selling_price.toLocaleString('id-ID')}</td>
                <td>${tanggal}</td>
                <td>
                    <button onclick="hapusRiwayat(${item.history_id})">Hapus</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error GetHistory:", error);
    }
}

async function hapusRiwayat(historyId) {
    if (!confirm("Yakin ingin menghapus riwayat ini? Data akan dipindah ke tempat sampah.")) {
        return;
    }

    try {
        let response = await DeleteHistory(JSON.stringify({ history_id: historyId }));
        while (typeof response === 'string') response = JSON.parse(response);

        if (response.success) {
            alert("Riwayat berhasil dihapus.");
            muatRiwayat(); 
        } else {
            alert("Gagal menghapus: " + response.message);
        }
    } catch (error) {
        console.error("Error DeleteHistory:", error);
        alert("Terjadi kesalahan sistem saat menghapus.");
    }
}