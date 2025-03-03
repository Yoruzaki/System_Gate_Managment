import React, { useState } from "react";

const Members = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      photo: "https://via.placeholder.com/50",
      mobile: "123-456-7890",
      address: "123 Street, City",
      carName: "Toyota Corolla",
      carPlate: "ABC-1234",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    photo: "",
    mobile: "",
    address: "",
    carName: "",
    carPlate: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMember = () => {
    if (!form.name || !form.mobile || !form.carPlate) {
      return alert("Name, Mobile, and Car Plate are required!");
    }

    if (editingId) {
      // Update member
      setMembers(members.map(m => (m.id === editingId ? { ...m, ...form } : m)));
      setEditingId(null);
    } else {
      // Add new member
      setMembers([...members, { id: members.length + 1, ...form }]);
    }

    setForm({ name: "", photo: "", mobile: "", address: "", carName: "", carPlate: "" });
  };

  const editMember = (member) => {
    setForm(member);
    setEditingId(member.id);
  };

  const deleteMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Members Management</h2>

      {/* Member Form */}
      <div className="mb-5 p-4 bg-gray-100 rounded">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 mr-2"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="photo"
          placeholder="Photo URL"
          className="border p-2 mr-2"
          value={form.photo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          className="border p-2 mr-2"
          value={form.mobile}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="border p-2 mr-2"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="carName"
          placeholder="Car Name"
          className="border p-2 mr-2"
          value={form.carName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="carPlate"
          placeholder="Car Plate"
          className="border p-2 mr-2"
          value={form.carPlate}
          onChange={handleChange}
        />
        <button onClick={addMember} className="bg-blue-500 text-white px-4 py-2 ml-2">
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </div>

      {/* Members Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Photo</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Car Name</th>
            <th className="border p-2">Car Plate</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td className="border p-2">
                <img src={member.photo} alt="Member" className="w-10 h-10 rounded-full" />
              </td>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.mobile}</td>
              <td className="border p-2">{member.address}</td>
              <td className="border p-2">{member.carName}</td>
              <td className="border p-2">{member.carPlate}</td>
              <td className="border p-2">
                <button onClick={() => editMember(member)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Edit</button>
                <button onClick={() => deleteMember(member.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Members;
