let dataKalkulasiSementara = null;

function formatRupiah(angka, prefix) {
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
}

setTimeout(() => {
    ['fixed_cost', 'variable_cost'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('keyup', function(e) {
                this.value = formatRupiah(this.value, 'Rp ');
                this.classList.remove('input-error');
            });
        }
    });

    ['item_name', 'margin'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', function() {
                this.classList.remove('input-error');
            });
        }
    });
}, 500);

async function hitungProfit() {
    const itemName = document.getElementById('item_name');
    const fixedCost = document.getElementById('fixed_cost');
    const variableCost = document.getElementById('variable_cost');
    const margin = document.getElementById('margin');

    let isValid = true;
    [itemName, fixedCost, variableCost, margin].forEach(el => {
        if (!el.value.trim() || el.value === 'Rp ') {
            el.classList.add('input-error');
            isValid = false;
        }
    });

    if (!isValid) {
        alert("Mohon lengkapi form yang ditandai merah.");
        return;
    }

    const parseCurrency = (val) => parseFloat(val.replace(/Rp\s?|\./g, '')) || 0;
    const payload = {
        item_name: itemName.value,
        fixed_cost: parseCurrency(fixedCost.value),
        variable_cost: parseCurrency(variableCost.value),
        target_margin_percentage: parseFloat(margin.value)
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

        document.getElementById('popup-hpp').value = `Rp ${response.cogs.toLocaleString('id-ID')}`;
        document.getElementById('popup-hji').value = `Rp ${response.ideal_selling_price.toLocaleString('id-ID')}`;
        document.getElementById('popup-bep').value = `${response.bep_units} Unit / Rp ${response.bep_revenue.toLocaleString('id-ID')}`;

        const saveBtn = document.getElementById('btn-save-popup');
        if (saveBtn) {
            saveBtn.innerText = "Simpan Kalkulasi";
            saveBtn.style.background = "linear-gradient(90deg, #4624C2 0%, #7F5BFF 100%)";
            saveBtn.style.cursor = "pointer";
            saveBtn.disabled = false;
        }

        if (!isGuestMode && localStorage.getItem('user_data')) {
            document.getElementById('popup-footer-action').style.display = 'block';
        } else {
            document.getElementById('popup-footer-action').style.display = 'none';
        }

        const popup = document.getElementById('popup-hasil');
        popup.style.display = 'flex';
        setTimeout(() => { popup.classList.add('show-popup'); }, 10);

    } catch (error) {
        console.error("Error Hitung Profit:", error);
        alert("Terjadi kesalahan komputasi.");
    }
}

function tutupPopup() {
    const popup = document.getElementById('popup-hasil');
    popup.classList.remove('show-popup');
    
    setTimeout(() => { 
        popup.style.display = 'none'; 
    }, 300); 
}

async function simpanKeRiwayat() {
    if (!dataKalkulasiSementara) return;
    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) return;

    const payload = {
        user_id: JSON.parse(userDataStr).user_id,
        ...dataKalkulasiSementara
    };

    try {
        let response = await SaveHistory(JSON.stringify(payload));
        while (typeof response === 'string') response = JSON.parse(response);

        if (response.success) {
            const saveBtn = document.getElementById('btn-save-popup');
            saveBtn.innerText = "Kalkulasi Tersimpan";
            saveBtn.style.background = "#A0A0A0";
            saveBtn.style.cursor = "not-allowed";
            saveBtn.disabled = true;

            document.getElementById('item_name').value = '';
            document.getElementById('fixed_cost').value = '';
            document.getElementById('variable_cost').value = '';
            document.getElementById('margin').value = '';
            
            dataKalkulasiSementara = null;
        } else {
            alert("Gagal menyimpan: " + response.message);
        }
    } catch (error) {
        console.error("Error Save History:", error);
    }
}

window.bersihkanInput = function(id) {
    const el = document.getElementById(id);
    if (el) {
        el.value = ''; 
        el.focus();    
        el.classList.remove('input-error'); 
    }
}