export default function EditUserForm({ user, token, onCancel, onSaved }) {
  const [userName, setUserName] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append("userId", user.id);

    if (userName.trim()) formData.append("userName", userName);
    if (email.trim()) formData.append("email", email);
    if (phoneNumber.trim()) formData.append("phoneNumber", phoneNumber);
    if (password.trim()) formData.append("password", password);

    try {
      const response = await fetch("http://localhost:5000/api/Auth/edit-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      onSaved(data);
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        className="border rounded p-2"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />

      <input
        className="border rounded p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        className="border rounded p-2"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />

      <input
        type="password"
        className="border rounded p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password (optional)"
      />

      <div className="col-span-full flex gap-3 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
