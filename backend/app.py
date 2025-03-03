from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Change if you have a different MySQL user
    password="",  # Change if you set a MySQL password
    database="gate_system"
)

cursor = db.cursor()

# Delete a user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id = %s"
    cursor.execute(sql, (user_id,))
    db.commit()
    return jsonify({"message": "User deleted successfully"}), 200



# Route to get all users
@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT id, name, role, password FROM users")
    users = cursor.fetchall()
    user_list = [{"id": row[0], "name": row[1], "role": row[2], "password": row[3]} for row in users]
    return jsonify(user_list)


# Route to add a new user
@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    cursor = db.cursor()  # Create a new cursor for each request
    sql = "INSERT INTO users (name, role, password) VALUES (%s, %s, %s)"
    cursor.execute(sql, (data['name'], data['role'], data['password']))
    db.commit()
    cursor.close()
    return jsonify({"message": "User added successfully!"})

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    cursor = db.cursor()
    sql = "UPDATE users SET name = %s, role = %s, password = %s WHERE id = %s"
    cursor.execute(sql, (data['name'], data['role'], data['password'], user_id))
    db.commit()
    cursor.close()
    return jsonify({"message": "User updated successfully!"})




# ------------------ MEMBERS ROUTES ------------------

# 1. Get all members
@app.route('/members', methods=['GET'])
def get_members():
    cursor.execute("SELECT id, name, photo, mobile, address, carName, carPlate FROM members")
    members = cursor.fetchall()
    member_list = [
        {"id": row[0], "name": row[1], "photo": row[2], "mobile": row[3], "address": row[4], "carName": row[5], "carPlate": row[6]}
        for row in members
    ]
    return jsonify(member_list)

# 2. Add a new member
@app.route('/members', methods=['POST'])
def add_member():
    data = request.json
    sql = "INSERT INTO members (name, photo, mobile, address, carName, carPlate) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(sql, (data['name'], data['photo'], data['mobile'], data['address'], data['carName'], data['carPlate']))
    db.commit()
    return jsonify({"message": "Member added successfully!"})

# 3. Update a member
@app.route('/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    data = request.json
    sql = "UPDATE members SET name=%s, photo=%s, mobile=%s, address=%s, carName=%s, carPlate=%s WHERE id=%s"
    cursor.execute(sql, (data['name'], data['photo'], data['mobile'], data['address'], data['carName'], data['carPlate'], member_id))
    db.commit()
    return jsonify({"message": "Member updated successfully!"})

# 4. Delete a member
@app.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    sql = "DELETE FROM members WHERE id = %s"
    cursor.execute(sql, (member_id,))
    db.commit()
    return jsonify({"message": "Member deleted successfully!"})

# ------------------ RUN SERVER ------------------

# Check if a license plate is registered
@app.route('/check_plate', methods=['POST'])
def check_plate():
    data = request.json
    plate = data.get("carPlate")

    cursor.execute("SELECT * FROM members WHERE carPlate = %s", (plate,))
    member = cursor.fetchone()

    if member:
        # Insert into 'entry_logs' table
        cursor.execute("INSERT INTO entry_logs (carPlate, status) VALUES (%s, %s)", (plate, "Inside"))
        db.commit()
        return jsonify({"allowed": True, "message": "Access Granted", "member": member})
    else:
        return jsonify({"allowed": False, "message": "Access Denied"})
    
    
if __name__ == '__main__':
    app.run(debug=True)
