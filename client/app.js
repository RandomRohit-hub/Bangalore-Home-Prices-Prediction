function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i in uiBathrooms) {
        if (uiBathrooms[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1; // Invalid Value
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i in uiBHK) {
        if (uiBHK[i].checked) {
            return parseInt(i) + 1;
        }
    }
    return -1; // Invalid Value
}

function showLoading() {
    var btn = document.getElementById("estimateBtn");
    btn.classList.add("loading");
    btn.disabled = true;
}

function hideLoading() {
    var btn = document.getElementById("estimateBtn");
    btn.classList.remove("loading");
    btn.disabled = false;
}

function showError(message) {
    var resultContainer = document.getElementById("uiEstimatedPrice");
    var resultValue = document.getElementById("resultValue");

    resultContainer.className = "result-container show error";
    resultContainer.style.background = "linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)";
    resultValue.textContent = message || "Error occurred";
    resultValue.style.fontSize = "18px";
}

function showResult(price) {
    var resultContainer = document.getElementById("uiEstimatedPrice");
    var resultValue = document.getElementById("resultValue");

    resultContainer.className = "result-container show";
    resultContainer.style.background = "linear-gradient(135deg, #FF6B6B 0%, #FFA07A 50%, #FF8C42 100%)";
    resultValue.textContent = price.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    resultValue.style.fontSize = "32px";
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");

    // Validation
    if (!sqft.value || parseFloat(sqft.value) <= 0) {
        showError("Please enter a valid area");
        return;
    }

    if (bhk === -1) {
        showError("Please select BHK");
        return;
    }

    if (bathrooms === -1) {
        showError("Please select number of bathrooms");
        return;
    }

    if (!location.value || location.value === "") {
        showError("Please select a location");
        location.focus();
        return;
    }

    showLoading();

    var url = "http://127.0.0.1:5000/predict_home_price";

    $.ajax({
        url: url,
        type: "POST",
        data: {
            total_sqft: parseFloat(sqft.value),
            bhk: bhk,
            bath: bathrooms,
            location: location.value
        },
        success: function (data, status) {
            console.log("Prediction successful:", data);
            hideLoading();

            if (data && data.estimated_price !== undefined) {
                showResult(data.estimated_price);
            } else {
                showError("Invalid response from server");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            console.error("Status:", status);
            hideLoading();

            var errorMessage = "Unable to connect to server";
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            } else if (xhr.status === 0) {
                errorMessage = "Server is not running. Please start the Flask server.";
            } else if (xhr.status === 404) {
                errorMessage = "Endpoint not found";
            } else if (xhr.status >= 500) {
                errorMessage = "Server error occurred";
            }

            showError(errorMessage);
        }
    });
}

function loadLocations() {
    console.log("Loading locations...");

    var url = "http://127.0.0.1:5000/get_location_names";
    var locationSelect = document.getElementById("uiLocations");
    var statusDiv = document.getElementById("locationStatus");

    if (!locationSelect) {
        console.error("Location select element not found!");
        return;
    }

    // Show loading state
    locationSelect.disabled = true;
    locationSelect.innerHTML = '<option value="">Loading locations...</option>';
    if (statusDiv) {
        statusDiv.textContent = "Loading...";
        statusDiv.className = "location-status loading";
    }

    $.ajax({
        url: url,
        type: "GET",
        timeout: 10000, // 10 second timeout
        success: function (data, status) {
            console.log("Got response for get_location_names request:", data);

            if (data && data.locations && Array.isArray(data.locations) && data.locations.length > 0) {
                var locations = data.locations;

                // Clear the select completely
                while (locationSelect.firstChild) {
                    locationSelect.removeChild(locationSelect.firstChild);
                }

                // Add placeholder option
                var placeholderOpt = document.createElement('option');
                placeholderOpt.value = "";
                placeholderOpt.textContent = "Choose a Location";
                placeholderOpt.selected = true;
                locationSelect.appendChild(placeholderOpt);

                // Sort locations alphabetically
                locations.sort();

                console.log("Adding " + locations.length + " locations to dropdown");

                // Add each location
                for (var i = 0; i < locations.length; i++) {
                    // Format location name: capitalize first letter of each word
                    var formattedLocation = locations[i].split(' ').map(function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }).join(' ');

                    var opt = document.createElement('option');
                    opt.value = locations[i]; // Use original lowercase value for API
                    opt.textContent = formattedLocation; // Show formatted name
                    locationSelect.appendChild(opt);
                }

                locationSelect.disabled = false;
                console.log("Locations loaded successfully. Total options:", locationSelect.options.length);

                // Update status
                if (statusDiv) {
                    statusDiv.textContent = locations.length + " locations loaded";
                    statusDiv.className = "location-status success";
                    setTimeout(function () {
                        statusDiv.textContent = "";
                        statusDiv.className = "location-status";
                    }, 3000);
                }

                // Verify options were added
                if (locationSelect.options.length <= 1) {
                    console.error("No location options were added!");
                    locationSelect.innerHTML = '<option value="">Error: No locations found</option>';
                    if (statusDiv) {
                        statusDiv.textContent = "Error: No locations found";
                        statusDiv.className = "location-status error";
                    }
                } else {
                    // Force a re-render by toggling disabled state
                    locationSelect.style.display = 'none';
                    locationSelect.offsetHeight; // Trigger reflow
                    locationSelect.style.display = '';
                }
            } else {
                console.error("Invalid or empty locations data:", data);
                locationSelect.innerHTML = '<option value="">No locations available</option>';
                locationSelect.disabled = false;
                if (statusDiv) {
                    statusDiv.textContent = "No locations available";
                    statusDiv.className = "location-status error";
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading locations:", {
                status: status,
                error: error,
                xhr: xhr,
                responseText: xhr.responseText
            });

            var errorMsg = "Error loading locations";
            if (xhr.status === 0) {
                errorMsg = "Server not running. Please start the Flask server.";
            } else if (xhr.status === 404) {
                errorMsg = "Endpoint not found";
            } else if (xhr.status >= 500) {
                errorMsg = "Server error";
            }

            locationSelect.innerHTML = '<option value="">' + errorMsg + '</option>';
            locationSelect.disabled = false;

            if (statusDiv) {
                statusDiv.textContent = errorMsg;
                statusDiv.className = "location-status error";
            }

            // Retry after 3 seconds
            setTimeout(function () {
                console.log("Retrying to load locations...");
                loadLocations();
            }, 3000);
        }
    });
}

function onPageLoad() {
    console.log("Document loaded");

    // Wait a bit to ensure DOM is fully ready
    setTimeout(function () {
        loadLocations();
    }, 100);
}

// Allow Enter key to submit form
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("predictionForm");
    if (form) {
        form.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                onClickedEstimatePrice();
            }
        });
    }
});

// Wavy Background Effect
function initWavyBackground() {
    console.log("Initializing Wavy Background");
    var canvas = document.getElementById("wavyCanvas");
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }

    if (typeof SimplexNoise === 'undefined') {
        console.error("SimplexNoise library not loaded");
        return;
    }

    var ctx = canvas.getContext("2d");
    var noise = new SimplexNoise();
    var w, h, nt, i, x;

    var config = {
        blur: 10,
        speed: "fast",
        waveWidth: 50,
        colors: [
            "#38bdf8",
            "#818cf8",
            "#c084fc",
            "#e879f9",
            "#22d3ee"
        ],
        waveOpacity: 0.5,
        backgroundFill: "black"
    };

    var getSpeed = function () {
        return config.speed === "fast" ? 0.002 : 0.001;
    };

    var drawWave = function (n) {
        nt += getSpeed();
        for (i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = config.waveWidth;
            ctx.strokeStyle = config.colors[i % config.colors.length];
            for (x = 0; x < w; x += 5) {
                // noise3D equivalent roughly: noise.noise3D(x, y, z)
                // 2.4.0 supports noise3D(x, y, z)
                var y = noise.noise3D(x / 800, 0.3 * i, nt) * 100;
                ctx.lineTo(x, y + h * 0.5);
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    var render = function () {
        // Use simpler clearing if fillStyle causes issues with transparency
        // For our case, we want transparent background but with waves
        // The original React component fills with "black". 
        // We set canvas background to transparent in CSS, so maybe we want to CLEAR it.
        ctx.clearRect(0, 0, w, h);

        // Actually, the original effect fills the background. 
        // Let's assume we want just the waves on the dark background we set in CSS CSS.
        // ctx.fillStyle = config.backgroundFill;
        // ctx.globalAlpha = config.waveOpacity;
        // ctx.fillRect(0, 0, w, h);

        ctx.globalAlpha = config.waveOpacity;
        drawWave(5);
        requestAnimationFrame(render);
    };

    var init = function () {
        w = ctx.canvas.width = window.innerWidth;
        h = ctx.canvas.height = window.innerHeight;
        ctx.filter = "blur(" + config.blur + "px)";
        nt = 0;

        window.onresize = function () {
            w = ctx.canvas.width = window.innerWidth;
            h = ctx.canvas.height = window.innerHeight;
            ctx.filter = "blur(" + config.blur + "px)";
        };

        render();
    };

    init();
}

window.addEventListener('load', initWavyBackground);
