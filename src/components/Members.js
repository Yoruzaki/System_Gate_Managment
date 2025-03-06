import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { FaSearch, FaUpload, FaEdit, FaTrash } from "react-icons/fa";
import debounce from "lodash.debounce";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", photo: "", mobile: "", address: "", carName: "", carPlate: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    fetch("http://127.0.0.1:5000/members")
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching members:", err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      photo: member.photo,
      mobile: member.mobile,
      address: member.address,
      carName: member.carName,
      carPlate: member.carPlate
    });
  };

  const addOrUpdateMember = async () => {
    if (!form.name || !form.mobile || !form.carPlate) {
      return toast.error("Name, Mobile, and Car Plate are required!");
    }

    let photoFilename = form.photo || "default-avatar.png";
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("http://127.0.0.1:5000/upload", { method: "POST", body: formData });
      const data = await response.json();
      photoFilename = data.filename;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `http://127.0.0.1:5000/members/${editingId}` : "http://127.0.0.1:5000/members";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, photo: photoFilename }),
    })
      .then(res => res.json())
      .then(() => {
        setForm({ name: "", photo: "", mobile: "", address: "", carName: "", carPlate: "" });
        setSelectedFile(null);
        setEditingId(null);
        toast.success(editingId ? "Member updated!" : "Member added!");
        fetchMembers();
      })
      .catch(err => console.error("Error adding/updating member:", err));
  };

  const deleteMember = (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    fetch(`http://127.0.0.1:5000/members/${id}`, { method: "DELETE" })
      .then(() => {
        setMembers(members.filter(member => member.id !== id));
        toast.info("Member deleted!");
      })
      .catch(err => console.error("Error deleting member:", err));
  };

  return (
    <div className="p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Members Management</h2>
      
      {/* Search Bar */}
      <div className="flex items-center border p-2 mb-4 w-full rounded-lg bg-blue-50">
        <FaSearch className="text-blue-500 mr-2" />
        <input
          type="text"
          placeholder="Search Members..."
          className="bg-transparent w-full outline-none"
          onChange={(e) => debounce(() => setSearch(e.target.value), 300)()}
        />
      </div>

      {/* Input Fields in a Single Row */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(form).map((key) => (
          key !== "photo" && (
            <input
              key={key}
              name={key}
              placeholder={key}
              className="border p-2 rounded flex-1 min-w-[150px]"
              value={form[key]}
              onChange={handleChange}
            />
          )
        ))}
      </div>

      {/* Upload Image and Add Member Buttons in the Same Row */}
      <div className="flex gap-2 mb-5">
        <label className="border p-2 flex items-center cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300">
          <FaUpload className="mr-2" /> Upload Image
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>
        <button
          onClick={addOrUpdateMember}
          className={`px-4 py-2 rounded ${
            form.name && form.mobile && form.carPlate ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          } text-white transition duration-300`}
          disabled={!form.name || !form.mobile || !form.carPlate}
        >
          {editingId ? "Update Member" : "Add Member"}
        </button>
      </div>

      {selectedFile && <p className="text-sm text-gray-600 mb-2">{selectedFile.name}</p>}

      {/* Members Table */}
      {loading ? <ClipLoader size={50} color={"#123abc"} loading={loading} /> : (
        <table className="w-full border-collapse border mt-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Car Plate</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.carPlate.includes(search))
              .map(member => (
                <tr key={member.id} className="hover:bg-gray-50 transition duration-300">
                  <td className="border p-2 w-20">
                    <img
                      src={`http://127.0.0.1:5000/uploads/${member.photo}`}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="border p-2">{member.name}</td>
                  <td className="border p-2">{member.mobile}</td>
                  <td className="border p-2">{member.carPlate}</td>
                  <td className="border p-2 w-40"> {/* Fixed width for Actions column */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleEdit(member)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300 flex items-center mx-1"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 flex items-center mx-1"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Members;