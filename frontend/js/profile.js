let isEditMode = false;

function muatDataProfilKeForm() {
    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) return;
    const userData = JSON.parse(userDataStr);

    const inputUsername = document.getElementById('prof_username');
    const inputEmail = document.getElementById('prof_email');
    const inputUmkm = document.getElementById('prof_umkm');
    const inputPhone = document.getElementById('prof_phone');

    if (inputUsername) inputUsername.value = userData.username || "-";
    if (inputEmail) inputEmail.value = userData.email || "";
    if (inputUmkm) inputUmkm.value = userData.umkm_name || "";
    if (inputPhone) inputPhone.value = userData.phone_number || "";

    if (isEditMode) toggleEditProfil(); 
}

window.toggleEditProfil = function() {
    isEditMode = !isEditMode;
    
    const inputs = ['prof_umkm', 'prof_email', 'prof_phone'].map(id => document.getElementById(id));
    const btnSimpan = document.getElementById('btn-simpan-profil');
    const btnEdit = document.getElementById('btn-edit-profil');
    
    const sectionLogout = document.querySelector('.profile-logout-section');

    if (isEditMode) {
        inputs.forEach(el => {
            el.removeAttribute('readonly');
            el.closest('.profile-field-pill').classList.add('editing-mode');
        });
        inputs[0].focus();
        
        btnSimpan.style.display = 'block';
        if (sectionLogout) sectionLogout.style.display = 'none';
        
        btnEdit.style.background = '#EAEAEA'; 
        btnEdit.style.color = '#6D6B8C';
        btnEdit.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`; 
    } else {
        inputs.forEach(el => {
            el.setAttribute('readonly', true);
            el.closest('.profile-field-pill').classList.remove('editing-mode');
        });
        
        btnSimpan.style.display = 'none';
        if (sectionLogout) sectionLogout.style.display = 'flex';
        
        btnEdit.style.background = '#F4F5FA';
        btnEdit.style.color = '#6D6B8C';
        btnEdit.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`; 
        
        muatDataProfilKeForm();
    }
}

async function simpanProfil(event) {
    event.preventDefault();

    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) {
        alert("Sesi telah habis. Silakan login ulang.");
        return;
    }
    const userData = JSON.parse(userDataStr);

    const payload = {
        user_id: userData.user_id,
        email: document.getElementById('prof_email').value,
        phone_number: document.getElementById('prof_phone').value,
        umkm_name: document.getElementById('prof_umkm').value
    };

    try {
        const btnSimpan = document.getElementById('btn-simpan-profil');
        btnSimpan.innerText = "Menyimpan...";
        
        let response = await UpdateProfile(JSON.stringify(payload));
        while (typeof response === 'string') response = JSON.parse(response);

        if (response.success) {
            userData.email = payload.email;
            userData.umkm_name = payload.umkm_name;
            userData.phone_number = payload.phone_number;
            localStorage.setItem("user_data", JSON.stringify(userData));

            toggleEditProfil();
            
            const btnEdit = document.getElementById('btn-edit-profil');
            btnEdit.style.background = '#D4EDDA';
            btnEdit.style.color = '#28A745';
            setTimeout(() => {
                btnEdit.style.background = '#F4F5FA';
                btnEdit.style.color = '#6D6B8C';
            }, 1000);

            aturTombolKalkulator(); 

        } else {
            alert("Gagal memperbarui profil: " + response.message);
        }
    } catch (error) {
        console.error("Error UpdateProfile:", error);
        alert("Terjadi kesalahan sistem saat memperbarui profil.");
    } finally {
        document.getElementById('btn-simpan-profil').innerText = "Simpan Perubahan";
    }
}