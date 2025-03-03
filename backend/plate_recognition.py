import cv2
import numpy as np
import easyocr
import requests

# Initialize EasyOCR for text detection
reader = easyocr.Reader(['en'])

# Open the webcam
cap = cv2.VideoCapture(1)  # Try a different camera index


cap = cv2.VideoCapture(0)  # Try 1, -1 if 0 doesn't work

if not cap.isOpened():
    print("Failed to open camera")
else:
    print(" Camera opened successfully")

cap.release()
cv2.destroyAllWindows()


import cv2

def find_cameras():
    for i in range(5):  # Check up to 5 possible camera indexes
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            print(f"Camera found at index {i}")
            cap.release()

find_cameras()




# Backend API URL (Flask)
API_URL = "http://127.0.0.1:5000/check_plate"

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert image to grayscale for better OCR results
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # OCR - Detect text (license plate)
    results = reader.readtext(gray)

    for (bbox, text, prob) in results:
        # Filter only alphanumeric plate numbers
        plate_number = text.upper().replace(" ", "")
        
        # Send request to Flask API to check if the plate is allowed
        response = requests.post(API_URL, json={"carPlate": plate_number})
        data = response.json()

        # Display result on the camera feed
        color = (0, 255, 0) if data["allowed"] else (0, 0, 255)
        cv2.rectangle(frame, tuple(map(int, bbox[0])), tuple(map(int, bbox[2])), color, 2)
        cv2.putText(frame, f"{plate_number}: {data['message']}", 
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

    # Show the camera feed
    cv2.imshow("License Plate Recognition", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
