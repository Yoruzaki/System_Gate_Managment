from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import requests
ESP32_IP = "http://192.168.1.100"  # Change this to your ESP32 IP Address



app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # Change if you have a different MySQL user
    'password': '',  # Change if you set a MySQL password
    'database': 'gate_system'
}


def open_gate():
    try:
        response = requests.get(f"{ESP32_IP}/open_gate")
        if response.status_code == 200:
            print("Gate opened successfully")
        else:
            print("Failed to open gate:", response.text)
    except requests.exceptions.RequestException as e:
        print("Error communicating with ESP32:", e)

        
def get_db_connection():
    """Helper function to create and return a database connection."""
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to the database: {e}")
        return None

# ------------------ USERS ROUTES ------------------

# Delete a user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    try:
        sql = "DELETE FROM users WHERE id = %s"
        cursor.execute(sql, (user_id,))
        db.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while deleting the user"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, name, role, password FROM users")
        users = cursor.fetchall()
        return jsonify(users)
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while fetching users"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# Add a new user
@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    if not data or 'name' not in data or 'role' not in data or 'password' not in data:
        return jsonify({"error": "Invalid request: missing required fields"}), 400

    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    try:
        sql = "INSERT INTO users (name, role, password) VALUES (%s, %s, %s)"
        cursor.execute(sql, (data['name'], data['role'], data['password']))
        db.commit()
        return jsonify({"message": "User added successfully!"}), 201
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while adding the user"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# Update a user
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    if not data or 'name' not in data or 'role' not in data or 'password' not in data:
        return jsonify({"error": "Invalid request: missing required fields"}), 400

    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    try:
        sql = "UPDATE users SET name = %s, role = %s, password = %s WHERE id = %s"
        cursor.execute(sql, (data['name'], data['role'], data['password'], user_id))
        db.commit()
        return jsonify({"message": "User updated successfully!"}), 200
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while updating the user"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# ------------------ MEMBERS ROUTES ------------------

# Get all members
@app.route('/members', methods=['GET'])
def get_members():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, name, photo, mobile, address, carName, carPlate FROM members")
        members = cursor.fetchall()
        return jsonify(members)
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while fetching members"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# Add a new member
@app.route('/members', methods=['POST'])
def add_member():
    data = request.json
    if not data or 'name' not in data or 'carPlate' not in data:
        return jsonify({"error": "Invalid request: missing required fields"}), 400

    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    try:
        sql = "INSERT INTO members (name, photo, mobile, address, carName, carPlate) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (data['name'], data.get('photo'), data.get('mobile'), data.get('address'), data.get('carName'), data['carPlate']))
        db.commit()
        return jsonify({"message": "Member added successfully!"}), 201
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while adding the member"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# Update a member
@app.route('/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    data = request.json
    if not data or 'name' not in data or 'carPlate' not in data:
        return jsonify({"error": "Invalid request: missing required fields"}), 400

    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    try:
        sql = "UPDATE members SET name=%s, photo=%s, mobile=%s, address=%s, carName=%s, carPlate=%s WHERE id=%s"
        cursor.execute(sql, (data['name'], data.get('photo'), data.get('mobile'), data.get('address'), data.get('carName'), data['carPlate'], member_id))
        db.commit()
        return jsonify({"message": "Member updated successfully!"}), 200
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while updating the member"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# Delete a member
@app.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    try:
        sql = "DELETE FROM members WHERE id = %s"
        cursor.execute(sql, (member_id,))
        db.commit()
        return jsonify({"message": "Member deleted successfully!"}), 200
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while deleting the member"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()

# ------------------ LICENSE PLATE CHECK ROUTE ------------------

@app.route('/check_plate', methods=['POST'])
def check_plate():
    data = request.json
    if not data or 'carPlate' not in data:
        return jsonify({"error": "Invalid request: 'carPlate' key is missing"}), 400

    plate = data['carPlate']
    print(f"Checking plate: {plate}")  # Log the plate being checked

    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM members WHERE carPlate = %s", (plate,))
        member = cursor.fetchone()
        print(f"Query result: {member}")  # Log the query result

        if member:
            # Log entry into the database
            cursor.execute("INSERT INTO entry_logs (carPlate, status) VALUES (%s, %s)", (plate, "Inside"))
            db.commit()

            # **Send a request to ESP32 to open the gate**
            try:
                response = requests.get(f"{ESP32_IP}/open_gate", timeout=5)
                print(f"ESP32 Response: {response.text}")
            except requests.RequestException as e:
                print(f"Failed to send request to ESP32: {e}")
            open_gate()


            return jsonify({"allowed": True, "message": "Access Granted", "member": member})
        else:
            return jsonify({"allowed": False, "message": "Access Denied"}), 404
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while processing your request"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


    


# ------------------ RUN SERVER ------------------

@app.route('/stats', methods=['GET'])
def get_statistics():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)
    try:
        # Fetching total members
        cursor.execute("SELECT COUNT(*) AS total_members FROM members")
        total_members = cursor.fetchone()['total_members']

        # Fetching total cars
        cursor.execute("SELECT COUNT(DISTINCT carPlate) AS total_cars FROM members")
        total_cars = cursor.fetchone()['total_cars']

        # Fetching today's entries
        cursor.execute("SELECT COUNT(*) AS today_entries FROM entry_logs WHERE DATE(entry_time) = CURDATE()")
        today_entries = cursor.fetchone()['today_entries']

        # Fetching monthly entries
        cursor.execute("SELECT COUNT(*) AS monthly_entries FROM entry_logs WHERE MONTH(entry_time) = MONTH(CURDATE())")
        monthly_entries = cursor.fetchone()['monthly_entries']

        return jsonify({
            "totalMembers": total_members,
            "totalCars": total_cars,
            "todayEntries": today_entries,
            "monthlyEntries": monthly_entries
        })
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch statistics"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


@app.route('/logs', methods=['GET'])
def get_logs():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, carPlate, status, entry_time FROM entry_logs ORDER BY entry_time DESC")

        logs = cursor.fetchall()
        return jsonify(logs)
    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Failed to fetch logs"}), 500
    finally:
        if db.is_connected():
            cursor.close()
            db.close()


import cv2
from flask import Response

camera = cv2.VideoCapture(0)  # Change index if using an external camera

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/camera')
def camera_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate_frames():
    cap = cv2.VideoCapture(0)  # Change to your camera source
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')




if __name__ == '__main__':
    app.run(debug=True)