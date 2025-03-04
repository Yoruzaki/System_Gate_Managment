import cv2
import numpy as np
import easyocr
import requests
import re
import time

# Initialize EasyOCR for text detection
reader = easyocr.Reader(['en'])

# Flask Backend API URL
API_URL = "http://127.0.0.1:5000/check_plate"

# Function to find the first available camera index
def find_camera():
    for i in range(5):  # Try different indexes
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f" Camera found at index {i}")
            cap.release()
            return i
    print(" No camera found. Exiting...")
    exit()

# Function to extract a valid 10-digit license plate
def extract_plate(text):
    digits_only = re.sub(r"\D", "", text)  # Remove non-numeric characters
    return digits_only if len(digits_only) == 10 else None

# Find the camera index
camera_index = find_camera()
cap = cv2.VideoCapture(camera_index)

if not cap.isOpened():
    print(" Failed to open camera. Exiting...")
    exit()
else:
    print(" Camera opened successfully!")

# Main loop for plate recognition
while True:
    ret, frame = cap.read()
    if not ret:
        print(" Failed to capture frame.")
        break

    # Convert image to grayscale for better OCR detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # OCR - Detect text (license plate)
    results = reader.readtext(gray)

    detected_texts = []
    valid_plate = None

    for (bbox, text, prob) in results:
        detected_texts.append(text.upper())  # Store detected text
        plate_number = extract_plate(text)  # Extract only 10 digits

        if plate_number:
            valid_plate = plate_number  # Save valid plate number
            
            try:
                # Send request to Flask API to check if the plate is allowed
                response = requests.post(API_URL, json={"carPlate": plate_number})
                
                if response.status_code == 200:
                    data = response.json()
                    allowed = data.get("allowed", False)
                    message = data.get("message", "Unknown")
                else:
                    print(f" Backend returned {response.status_code}: {response.text}")
                    continue
            except requests.exceptions.RequestException as e:
                print(f" Request failed: {e}")
                continue
            except ValueError as e:
                print(f" JSON decode error: {e}")
                print(f" Response content: {response.text}")
                continue

            # Draw bounding box and text on the frame
            color = (0, 255, 0) if allowed else (0, 0, 255)  # Green for allowed, red for denied
            cv2.rectangle(frame, tuple(map(int, bbox[0])), tuple(map(int, bbox[2])), color, 2)
            cv2.putText(frame, f"Plate: {plate_number} - {message}", 
                        (bbox[0][0], bbox[0][1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # Display detected texts on the screen
    y_offset = 50
    for detected_text in detected_texts:
        cv2.putText(frame, f"Detected: {detected_text}", (20, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        y_offset += 30

    # Show message if no valid plate was found
    if valid_plate is None:
        cv2.putText(frame, "No valid plate detected", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

    # Show the camera feed
    cv2.imshow("License Plate Recognition", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
