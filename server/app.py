"""
Flask application for Bangalore Home Price Prediction
Run this file to start the Flask server
"""
from flask import Flask, request, jsonify, send_from_directory
import os
import util

app = Flask(__name__)

# Load artifacts when the module is imported
print("Loading saved artifacts...")
util.load_saved_artifacts()
print("Artifacts loaded successfully!")

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    """Get list of all available locations"""
    try:
        locations = util.get_location_names()
        if locations is None:
            return jsonify({
                'error': 'Locations not loaded. Please check server logs.'
            }), 500
        
        response = jsonify({
            'locations': locations
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error in get_location_names: {str(e)}")
        return jsonify({
            'error': 'Failed to get location names',
            'details': str(e)
        }), 500

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    """Predict home price based on input parameters"""
    try:
        # Get form data
        total_sqft = float(request.form.get('total_sqft', 0))
        location = request.form.get('location', '').strip()
        bhk = int(request.form.get('bhk', 0))
        bath = int(request.form.get('bath', 0))
        
        # Validate inputs
        if total_sqft <= 0:
            return jsonify({
                'error': 'Invalid area. Area must be greater than 0.'
            }), 400
        
        if not location:
            return jsonify({
                'error': 'Location is required.'
            }), 400
        
        if bhk <= 0 or bhk > 10:
            return jsonify({
                'error': 'Invalid BHK. BHK must be between 1 and 10.'
            }), 400
        
        if bath <= 0 or bath > 10:
            return jsonify({
                'error': 'Invalid number of bathrooms. Must be between 1 and 10.'
            }), 400
        
        # Get price prediction
        estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
        
        if estimated_price is None or estimated_price < 0:
            return jsonify({
                'error': 'Failed to predict price. Please check your inputs.'
            }), 500
        
        response = jsonify({
            'estimated_price': estimated_price
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
        
    except ValueError as e:
        return jsonify({
            'error': 'Invalid input format',
            'details': str(e)
        }), 400
    except Exception as e:
        print(f"Error in predict_home_price: {str(e)}")
        return jsonify({
            'error': 'An error occurred while predicting price',
            'details': str(e)
        }), 500

@app.route('/')
def root():
    """Serve the main HTML page"""
    try:
        client_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'client')
        return send_from_directory(client_dir, 'app.html')
    except Exception as e:
        return f"Error serving file: {str(e)}", 500

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files from client directory"""
    try:
        client_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'client')
        return send_from_directory(client_dir, filename)
    except Exception as e:
        return f"Error serving file: {str(e)}", 404

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Server is running'
    }), 200

if __name__ == "__main__":
    print("=" * 50)
    print("Starting Python Flask Server For Home Price Prediction...")
    print("=" * 50)
    print(f"Server will be available at: http://127.0.0.1:5000")
    print(f"Health check: http://127.0.0.1:5000/health")
    print("=" * 50)
    
    # Run the Flask app
    app.run(debug=True, host='127.0.0.1', port=5000)

