async function prosesRegister(event) {
    event.preventDefault();

    const payload = {
        username: document.getElementById('reg_username').value,
        password: document.getElementById('reg_password').value,
        email: document.getElementById('reg_email').value,
        phone_number: document.getElementById('reg_phone').value,
        umkm_name: document.getElementById('reg_umkm').value
    };

    try {
        let response = await Register(JSON.stringify(payload));
        
        while (typeof response === 'string') {
            response = JSON.parse(response);
        }

        if (response.success) {
            alert("Registrasi Berhasil! Silakan Login.");
            
            bukaHalaman('view-login');
            
        } else {
            alert("Registrasi Gagal: " + response.message);
        }
    } catch (error) {
        console.error("Error Register:", error);
        alert("Terjadi kesalahan sistem saat registrasi.");
    }
}

async function prosesLogin(event) {
    event.preventDefault(); 

    const payload = {
        username: document.getElementById('login_username').value,
        password: document.getElementById('login_password').value
    };

    try {
        let response = await Login(JSON.stringify(payload));
        
        while (typeof response === 'string') {
            response = JSON.parse(response);
        }

        if (response.success) {
            alert("Login Berhasil! Selamat datang, " + response.data.umkm_name);
            
            localStorage.setItem("user_data", JSON.stringify(response.data));
            
            bukaHalaman('view-kalkulator');
            
        } else {
            alert("Login Gagal: " + response.message);
        }
    } catch (error) {
        console.error("Error Login:", error);
        alert("Terjadi kesalahan sistem saat login.");
    }
}

function prosesLogout() {
    localStorage.removeItem("user_data");
    alert("Anda telah logout.");
}