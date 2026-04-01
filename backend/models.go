package main

type ProfitRequest struct {
	ItemName     string  `json:"item_name"`
	FixedCost    float64 `json:"fixed_cost"`
	VariableCost float64 `json:"variable_cost"`
	TargetMargin float64 `json:"target_margin_percentage"`
}

type ProfitResponse struct {
	ItemName          string  `json:"item_name"`
	COGS              float64 `json:"cogs"`
	IdealSellingPrice float64 `json:"ideal_selling_price"`
	BEPUnits          int     `json:"bep_units"`
	BEPRevenue        float64 `json:"bep_revenue"`
}

type GetHistoryRequest struct {
	UserID int `json:"user_id"`
}

type HistoryItem struct {
	HistoryID         int     `json:"history_id"`
	ItemName          string  `json:"item_name"`
	COGS              float64 `json:"cogs"`
	IdealSellingPrice float64 `json:"ideal_selling_price"`
	BEPUnits          int     `json:"bep_units"`
	BEPRevenue        float64 `json:"bep_revenue"`
	CreatedAt         string  `json:"created_at"`
	UpdatedAt         string  `json:"updated_at"`
}

type DeleteHistoryRequest struct {
	HistoryID int `json:"history_id"`
}

type StandardResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type RegisterRequest struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	UMKMName    string `json:"umkm_name"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success bool      `json:"success"`
	Message string    `json:"message"`
	Data    *UserData `json:"data,omitempty"`
}

type UserData struct {
	UserID      int    `json:"user_id"`
	Username    string `json:"username"`
	UMKMName    string `json:"umkm_name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
}

type UpdateProfileRequest struct {
	UserID      int    `json:"user_id"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	UMKMName    string `json:"umkm_name"`
}

type SaveHistoryRequest struct {
	UserID            int     `json:"user_id"`
	ItemName          string  `json:"item_name"`
	FixedCost         float64 `json:"fixed_cost"`
	VariableCost      float64 `json:"variable_cost"`
	TargetMargin      float64 `json:"target_margin_percentage"`
	COGS              float64 `json:"cogs"`
	IdealSellingPrice float64 `json:"ideal_selling_price"`
	BEPUnits          int     `json:"bep_units"`
	BEPRevenue        float64 `json:"bep_revenue"`
}
