import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../config/api";

export default function UserProfile() {
  const userId = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.userRole);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [editUser, setEditUser] = useState({
    userId: "",
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    fullName: "",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const response = await api.get(`/auth/get-user-profile/${userId}`);
        if (response.data.success) {
          setEditUser({
            userId: response.data.user.id,
            userName: response.data.user.userName,
            password: "",
            email: response.data.user.email,
            phoneNumber: response.data.user.phoneNumber ?? "",
            fullName: response.data.customer.fullName ?? "",
          });
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchPhoto = async () => {
      try {
        const { data } = await api.get(`/auth/users/${userId}/photo`);
        if (data.success && data.photo) {
          setPhotoUrl(`data:${data.photoType};base64,${data.photo}`);
        } else {
          setPhotoUrl(null);
        }
      } catch (err) {
        console.error("Failed to fetch photo:", err);
        setPhotoUrl(null);
      }
    };

    fetchPhoto();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post("/auth/edit-user", {
        ...editUser,
        password: editUser.password || null,
      });
      console.log("Response", response.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    try {
      const formData = new FormData();
      formData.append("photo", photo);
      await api.post(`/auth/uploadPhoto/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Photo uploaded successfully");
      setPhoto(null);
      const { data } = await api.get(`/auth/users/${userId}/photo`);
      if (data.success && data.photo) {
        setPhotoUrl(`data:${data.photoType};base64,${data.photo}`);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <img
              src={photoUrl || "/avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            />
            <h2 className="text-2xl font-semibold">{editUser.fullName}</h2>
            <p className="text-gray-500">{editUser.email}</p>
            <p className="text-sm text-gray-400">Role: {role}</p>
          </div>

          <div className="w-full mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full border rounded-lg px-3 py-2 mb-2"
            />
            <button
              onClick={uploadPhoto}
              disabled={!photo}
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Upload Photo
            </button>
          </div>

          <div className="mt-6 space-y-1 text-sm text-gray-700 w-full">
            <div>
              <strong>ID:</strong> {editUser.userId}
            </div>
            <div>
              <strong>Username:</strong> {editUser.userName}
            </div>
            <div>
              <strong>Phone:</strong> {editUser.phoneNumber || "N/A"}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2">Edit Profile</h2>

          <input
            name="fullName"
            value={editUser.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            name="userName"
            value={editUser.userName}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="email"
            name="email"
            value={editUser.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="password"
            name="password"
            value={editUser.password}
            onChange={handleChange}
            placeholder="New password (optional)"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            name="phoneNumber"
            value={editUser.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
