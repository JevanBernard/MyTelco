import sys
import json

# Kita pakai try-except agar kalau error tidak bikin server crash
try:
    # Data dikirim dari Node.js sebagai argumen ke-2 (index 1)
    # Contoh command: python predict.py '{"internet": 50, "call": 100}'
    raw_input = sys.argv[1]
    
    # Parsing string JSON menjadi Dictionary Python
    input_data = json.loads(raw_input)

    # --- SIMULASI PREDIKSI (Nanti diganti model asli) ---
    # Logika dummy: Jika internet > 50GB, prediksi churn = "Yes"
    internet_usage = int(input_data.get('internet', 0))
    prediction = "Yes" if internet_usage > 50 else "No"
    # ----------------------------------------------------

    # Siapkan hasil untuk dikirim balik ke Node.js
    result = {
        "status": "success",
        "input_received": input_data,
        "prediction": prediction
    }

    # Print hasil dalam format JSON (Ini yang akan dibaca Node.js)
    print(json.dumps(result))

except Exception as e:
    # Kalau error, print errornya dalam format JSON juga
    error_response = {"status": "error", "message": str(e)}
    print(json.dumps(error_response))