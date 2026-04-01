let databaseRiwayatLokal = [];

async function muatRiwayat() {
    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) return;
    const userData = JSON.parse(userDataStr);

    try {
        let response = await GetHistory(JSON.stringify({ user_id: userData.user_id }));
        while (typeof response === 'string') response = JSON.parse(response);

        const listContainer = document.getElementById("history_list_container");
        if (!listContainer) return; 

        listContainer.innerHTML = ""; 
        databaseRiwayatLokal = response; 

        if (!response || response.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align:center; padding: 40px 20px; background: rgba(255,255,255,0.5); border-radius: 20px;">
                    <p style="color:#6D6B8C; font-weight: 600; font-family: 'Open Sans', sans-serif;">Belum ada riwayat kalkulasi.</p>
                </div>
            `;
            return;
        }

        response.forEach((item) => {
            const card = document.createElement("div");
            card.className = "history-card";
            
            card.onclick = () => bukaPopupRiwayat(item.history_id);

            const hargaIdeal = Number(item.ideal_selling_price) || 0;
            const formatRp = 'Rp ' + hargaIdeal.toLocaleString('id-ID');

            card.innerHTML = `
                <div class="history-card-content">
                    <p class="history-item-name">${item.item_name}</p>
                </div>
                <button class="history-delete-btn" onclick="hapusRiwayat(event, ${item.history_id})">
                    <svg viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            `;
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error GetHistory:", error);
    }
}

function bukaPopupRiwayat(historyId) {
    const item = databaseRiwayatLokal.find(x => x.history_id === historyId);
    if (!item) return;

    const formatRp = (angka) => 'Rp ' + Number(angka).toLocaleString('id-ID');

    const strHPP = formatRp(item.cogs);
    const strHJI = formatRp(item.ideal_selling_price);
    const strBEPUnit = item.bep_units + ' Unit';
    const strBEPRevenue = formatRp(item.bep_revenue);

    document.getElementById('popup-riwayat-title').innerText = item.item_name;
    document.getElementById('popup-riwayat-hpp').value = strHPP;
    document.getElementById('popup-riwayat-hji').value = strHJI;
    document.getElementById('popup-riwayat-bep').value = `${strBEPUnit} / ${strBEPRevenue}`;

    const kalimatUtama = `Dari modal per produk sebesar <b>${strHPP}</b> (HPP), kamu disarankan menjualnya dengan harga <b>${strHJI}</b> (HJI).`;
    
    const kalimatTarget = `Target penjualan minimal yang perlu kamu raih agar tidak rugi adalah sebanyak <b>${strBEPUnit}</b> atau setara dengan omzet <b>${strBEPRevenue}</b>.`;
    
    document.getElementById('popup-riwayat-insight-main').innerHTML = kalimatUtama;
    document.getElementById('popup-riwayat-insight-target').innerHTML = kalimatTarget;

    const popup = document.getElementById('popup-riwayat');
    popup.style.display = 'flex';
    setTimeout(() => { popup.classList.add('show-popup'); }, 10);
}

function tutupPopupRiwayat() {
    const popup = document.getElementById('popup-riwayat');
    popup.classList.remove('show-popup');
    setTimeout(() => { popup.style.display = 'none'; }, 300);
}

async function hapusRiwayat(event, historyId) {
    event.stopPropagation(); 

    if (!confirm("Yakin ingin menghapus riwayat produk ini?")) return;

    try {
        let response = await DeleteHistory(JSON.stringify({ history_id: historyId }));
        while (typeof response === 'string') response = JSON.parse(response);

        if (response.success) {
            muatRiwayat();
        } else {
            alert("Gagal menghapus: " + response.message);
        }
    } catch (error) {
        console.error("Error DeleteHistory:", error);
    }
}