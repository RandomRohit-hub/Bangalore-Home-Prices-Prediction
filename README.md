# Bangalore Home Prices Prediction System

A Machine Learning project that predicts home prices in Bangalore based on various input features like location, size, number of bedrooms, etc.

Built using Python, Flask for the backend, Scikit-learn for the Machine Learning model, and simple HTML/CSS/JavaScript for the frontend.

---

## 🚀 Project Overview

This system allows users to input home features and get a predicted price for properties in Bangalore.  
It consists of three main components:
1. **Client** – User interface to input data and display predictions.
2. **Server** – Flask-based backend API that processes requests and interacts with the ML model.
3. **Model** – Pre-trained Scikit-learn regression model for predicting home prices, now with improved analysis.

### ✨ Recent Improvements
- **Exploratory Data Analysis (EDA)**: Added comprehensive data visualization (Histograms, Scatter Plots) to understand price distributions and correlations.
- **Advanced Model Selection**: Integrated **Random Forest** and **Gradient Boosting** regressors alongside Linear Regression to experiment with better accuracy.
- **Improved File Structure**: Organized datasets into a dedicated directory for better project management.

---

## ✅ Folder Structure

```
Bangalore Home Prices/
├── client/                 # Frontend files
│   ├── app.html           # Main UI
│   ├── app.css
│   └── app.js
│
├── server/                 # Flask server code
│   ├── app.py             # Main application entry point
│   ├── util.py            # Utility functions (loads model, predicts)
│   └── artifacts/         # Serialized model and column data
│       ├── banglore_home_prices_model.pickle
│       └── columns.json
│
├── model/                  # Machine Learning environment
│   ├── datasets/          # Raw and processed data
│   │   ├── Bengaluru_House_Data.csv
│   │   └── bhp.csv
│   ├── Bangalore Home Price Prediction.ipynb          # Original notebook
│   └── Bangalore_Home_Price_Prediction_Improved.ipynb # Improved notebook with EDA & new models
│
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation
```

---

## 🎯 Features

- Predicts home prices based on user input.
- **New**: Visual insights into the housing data (in the improved notebook).
- **New**: Comparison of multiple regression algorithms.
- Easy-to-use web interface.
- Lightweight and easy to deploy.
- Uses a pre-trained ML model for fast predictions.

---

## ⚡ How to Run Locally

1️⃣ Clone the repository:
```bash
git clone https://github.com/Rajdeep-183/Bangalore-Home-Prices-Preduction.git
```

2️⃣ Navigate into the project directory:
```bash
cd "Bangalore Home Prices"
```

3️⃣ Install dependencies:
```bash
pip install -r requirements.txt
```

4️⃣ Run the Flask server:
```bash
python server/app.py
```

5️⃣ Open `client/app.html` in your browser to use the application.

---

## 🔧 Technologies Used

- **Language**: Python
- **Backend**: Flask
- **ML Libraries**: Scikit-learn, Pandas, Numpy, Matplotlib, Seaborn
- **Frontend**: HTML, CSS, JavaScript

---

## 📄 License

MIT License

---

## 📧 Contact

Rajdeep Yadav  
GitHub: [https://github.com/Rajdeep-183](https://github.com/Rajdeep-183)
Linkedin: [www.linkedin.com/in/rajdeep183](www.linkedin.com/in/rajdeep183)
