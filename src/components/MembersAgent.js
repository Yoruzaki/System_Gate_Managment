import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const MembersAgent = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    fetch("http://127.0.0.1:5000/members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching members:", err));
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Members Table */}
      {loading ? (
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      ) : (
        <table className="w-full border-collapse border mt-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Photo</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Car Plate</th>
            </tr>
          </thead>
          <tbody>
            {members
              .filter(
                (m) =>
                  m.name.toLowerCase().includes(search.toLowerCase()) ||
                  m.carPlate.includes(search)
              )
              .map((member) => (
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
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MembersAgent;