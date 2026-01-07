"""
Utility functions for home price prediction
Handles model loading and price prediction
"""
import json
import pickle
import numpy as np
import os

__locations = None
__data_columns = None
__model = None

# Get the directory where this script is located
__script_dir = os.path.dirname(os.path.abspath(__file__))
COLUMNS_PATH = os.path.join(__script_dir, "artifacts", "columns.json")
MODEL_PATH = os.path.join(__script_dir, "artifacts", "banglore_home_prices_model.pickle")


def get_estimated_price(location, sqft, bhk, bath):
    """
    Estimate home price based on location, area, BHK, and bathrooms
    
    Args:
        location (str): Location name (case-insensitive)
        sqft (float): Total square feet
        bhk (int): Number of bedrooms
        bath (int): Number of bathrooms
    
    Returns:
        float: Estimated price in lakhs, or None if error
    """
    try:
        if __model is None or __data_columns is None:
            print("Error: Model or data columns not loaded")
            return None
        
        if not location:
            print("Error: Location is required")
            return None
        
        # Convert location to lowercase for matching
        location_lower = location.lower().strip()
        
        # Find location index
        try:
            loc_index = __data_columns.index(location_lower)
        except ValueError:
            print(f"Warning: Location '{location}' not found in data columns")
            loc_index = -1
        
        # Create feature vector
        X = np.zeros(len(__data_columns))
        X[0] = sqft
        X[1] = bath
        X[2] = bhk
        
        if loc_index >= 0:
            X[loc_index] = 1
        
        # Predict price
        prediction = __model.predict([X])[0]
        estimated_price = round(float(prediction), 2)
        
        # Ensure price is non-negative
        if estimated_price < 0:
            print(f"Warning: Negative price predicted: {estimated_price}")
            estimated_price = 0
        
        return estimated_price
        
    except Exception as e:
        print(f"Error in get_estimated_price: {str(e)}")
        return None


def get_location_names():
    """
    Get list of all available locations
    
    Returns:
        list: List of location names, or None if not loaded
    """
    if __locations is None:
        print("Warning: Locations not loaded yet")
        return None
    return __locations.copy()  # Return a copy to prevent external modification


def load_saved_artifacts():
    """
    Load the saved model and data columns from files
    """
    global __data_columns
    global __locations
    global __model
    
    try:
        print("Loading saved artifacts...")
        
        # Check if files exist
        if not os.path.exists(COLUMNS_PATH):
            raise FileNotFoundError(f"Columns file not found: {COLUMNS_PATH}")
        
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        
        # Load columns
        print(f"Loading columns from: {COLUMNS_PATH}")
        with open(COLUMNS_PATH, "r") as f:
            data = json.load(f)
            __data_columns = data.get('data_columns', [])
            
            if not __data_columns:
                raise ValueError("Data columns are empty")
            
            # Extract locations (skip first 3 columns: total_sqft, bath, bhk)
            __locations = __data_columns[3:] if len(__data_columns) > 3 else []
            
            print(f"Loaded {len(__data_columns)} data columns")
            print(f"Loaded {len(__locations)} locations")
        
        # Load model
        print(f"Loading model from: {MODEL_PATH}")
        with open(MODEL_PATH, "rb") as f:
            __model = pickle.load(f)
            print("Model loaded successfully")
        
        print("All artifacts loaded successfully!")
        return True
        
    except FileNotFoundError as e:
        print(f"File not found error: {str(e)}")
        print("Please ensure the artifacts folder contains:")
        print("  - columns.json")
        print("  - banglore_home_prices_model.pickle")
        return False
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        return False
    except Exception as e:
        print(f"Error loading artifacts: {str(e)}")
        return False


# Test the module if run directly
if __name__ == "__main__":
    print("Testing util module...")
    
    if load_saved_artifacts():
        print("\nLocations sample (first 10):")
        locations = get_location_names()
        if locations:
            for i, loc in enumerate(locations[:10]):
                print(f"  {i+1}. {loc}")
        
        print("\nTesting price predictions:")
        test_cases = [
            ('1st phase jp nagar', 1000, 3, 3),
            ('1st phase jp nagar', 1000, 2, 2),
            ('electronic city', 1500, 3, 2),
            ('whitefield', 2000, 4, 3),
        ]
        
        for location, sqft, bhk, bath in test_cases:
            price = get_estimated_price(location, sqft, bhk, bath)
            if price is not None:
                print(f"  {location}, {sqft} sqft, {bhk} BHK, {bath} bath: {price} Lakh")
            else:
                print(f"  {location}: Error predicting price")
    else:
        print("Failed to load artifacts. Cannot run tests.")
