package main

import (
	"encoding/json"
	"fmt"
	"math"

	"github.com/webui-dev/go-webui/v2"
	"golang.org/x/crypto/bcrypt"
)

func CalculateProfit(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)

	var req ProfitRequest
	err := json.Unmarshal([]byte(payloadJSON), &req)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return `{"error": "Invalid payload"}`
	}

	cogs := req.VariableCost
	idealSellingPrice := cogs + (cogs * req.TargetMargin / 100)
	bepUnits := math.Ceil(req.FixedCost / (idealSellingPrice - cogs))
	bepRevenue := bepUnits * idealSellingPrice

	res := ProfitResponse{
		ItemName:          req.ItemName,
		COGS:              cogs,
		IdealSellingPrice: idealSellingPrice,
		BEPUnits:          int(bepUnits),
		BEPRevenue:        bepRevenue,
	}

	responseJSON, _ := json.Marshal(res)
	return string(responseJSON)
}

func GetHistory(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)

	var req GetHistoryRequest
	json.Unmarshal([]byte(payloadJSON), &req)

	rows, err := DB.Query(`
		SELECT history_id, item_name, ideal_selling_price, created_at, updated_at 
		FROM calculation_history 
		WHERE user_id = ? AND deleted_at IS NULL
		ORDER BY created_at DESC
	`, req.UserID)

	historyList := []HistoryItem{}

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var item HistoryItem
			rows.Scan(&item.HistoryID, &item.ItemName, &item.SellingPrice, &item.CreatedAt, &item.UpdatedAt)
			historyList = append(historyList, item)
		}
	} else {
		fmt.Println("DB Query Error:", err)
	}

	responseJSON, _ := json.Marshal(historyList)
	return string(responseJSON)
}

func DeleteHistory(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)

	var req DeleteHistoryRequest
	json.Unmarshal([]byte(payloadJSON), &req)

	_, err := DB.Exec(`
		UPDATE calculation_history 
		SET deleted_at = CURRENT_TIMESTAMP 
		WHERE history_id = ?
	`, req.HistoryID)

	res := StandardResponse{
		Success: true,
		Message: "Data moved to trash",
	}

	if err != nil {
		fmt.Println("DB Delete Error:", err)
		res.Success = false
		res.Message = "Failed to delete data"
	}

	responseJSON, _ := json.Marshal(res)
	return string(responseJSON)
}

func HandleRegister(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)
	var req RegisterRequest
	json.Unmarshal([]byte(payloadJSON), &req)

	res := StandardResponse{Success: false}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		res.Message = "Gagal memproses password"
		responseJSON, _ := json.Marshal(res)
		return string(responseJSON)
	}

	_, err = DB.Exec(`
		INSERT INTO users (username, email, phone_number, umkm_name, password_hash) 
		VALUES (?, ?, ?, ?, ?)
	`, req.Username, req.Email, req.PhoneNumber, req.UMKMName, string(hashedPassword))

	if err != nil {
		res.Message = "Username atau Email sudah terdaftar"
	} else {
		res.Success = true
		res.Message = "Account created successfully"
	}

	responseJSON, _ := json.Marshal(res)
	return string(responseJSON)
}

func HandleLogin(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)
	var req LoginRequest
	json.Unmarshal([]byte(payloadJSON), &req)

	res := LoginResponse{Success: false}

	var user UserData
	var hashFromDB string

	err := DB.QueryRow(`
		SELECT user_id, umkm_name, email, password_hash 
		FROM users WHERE username = ?
	`, req.Username).Scan(&user.UserID, &user.UMKMName, &user.Email, &hashFromDB)

	if err != nil {
		res.Message = "Username tidak ditemukan"
		responseJSON, _ := json.Marshal(res)
		return string(responseJSON)
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashFromDB), []byte(req.Password))
	if err != nil {
		res.Message = "Password salah"
	} else {
		res.Success = true
		res.Message = "Login successful"
		res.Data = &user
	}

	responseJSON, _ := json.Marshal(res)
	return string(responseJSON)
}

func UpdateProfile(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)
	var req UpdateProfileRequest
	json.Unmarshal([]byte(payloadJSON), &req)

	_, err := DB.Exec(`
		UPDATE users 
		SET email = ?, phone_number = ?, umkm_name = ?, updated_at = CURRENT_TIMESTAMP 
		WHERE user_id = ?
	`, req.Email, req.PhoneNumber, req.UMKMName, req.UserID)

	res := StandardResponse{Success: true, Message: "Profile updated successfully"}
	if err != nil {
		fmt.Println("DB Update Error:", err)
		res.Success = false
		res.Message = "Failed to update profile"
	}

	responseJSON, _ := json.Marshal(res)
	return string(responseJSON)
}

func SaveHistory(e webui.Event) string {
	payloadJSON, _ := webui.GetArg[string](e)
	var req SaveHistoryRequest
	json.Unmarshal([]byte(payloadJSON), &req)

	_, err := DB.Exec(`
		INSERT INTO calculation_history 
		(user_id, item_name, fixed_cost, variable_cost, target_margin_percentage, cogs, ideal_selling_price, bep_units, bep_revenue) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, req.UserID, req.ItemName, req.FixedCost, req.VariableCost, req.TargetMargin, req.COGS, req.IdealSellingPrice, req.BEPUnits, req.BEPRevenue)

	res := StandardResponse{Success: true, Message: "Data saved successfully"}
	if err != nil {
		fmt.Println("DB Save Error:", err)
		res.Success = false
		res.Message = "Failed to save data"
	}

	responseJSON, _ := json.Marshal(res)
	return string(responseJSON)
}
