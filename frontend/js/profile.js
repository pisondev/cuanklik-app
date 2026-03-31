function muatDataProfilKeForm() {
    const userDataStr = localStorage.getItem("user_data");
    if (!userDataStr) return;
    const userData = JSON.parse(userDataStr);

    const inputEmail = document.getElementById('prof_email');
    const inputUmkm = document.getElementById('prof_umkm');

    if (inputEmail) inputEmail.value = userData.email;
    if (inputUmkm) inputUmkm.value = userData.umkm_name;
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
        let response = await UpdateProfile(JSON.stringify(payload));
        while (typeof response === 'string') response = JSON.parse(response);

        if (response.success) {
            alert("Profil berhasil diperbarui!");
            
            userData.email = payload.email;
            userData.umkm_name = payload.umkm_name;
            localStorage.setItem("user_data", JSON.stringify(userData));

        } else {
            alert("Gagal memperbarui profil: " + response.message);
        }
    } catch (error) {
        console.error("Error UpdateProfile:", error);
        alert("Terjadi kesalahan sistem saat memperbarui profil.");
    }
}