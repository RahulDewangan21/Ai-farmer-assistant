import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlineCheck,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(form);
      setEditing(false);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Name', icon: HiOutlineUser, value: form.name, editable: true },
    { name: 'email', label: 'Email', icon: HiOutlineEnvelope, value: user?.email || '', editable: false },
    { name: 'phone', label: 'Phone', icon: HiOutlinePhone, value: form.phone, editable: true },
    { name: 'location', label: 'Location', icon: HiOutlineMapPin, value: form.location, editable: true },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl shadow-primary-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-2xl font-bold text-surface-900">{user?.name}</h1>
          <p className="text-surface-400 text-sm">{user?.email}</p>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-surface-900">Profile Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <HiOutlinePencilSquare className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-1 px-4 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
                >
                  <HiOutlineCheck className="w-4 h-4" />
                  {loading ? '...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center flex-shrink-0">
                  <field.icon className="w-5 h-5 text-surface-500" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-surface-400 font-medium">{field.label}</label>
                  {editing && field.editable ? (
                    <input
                      name={field.name}
                      value={field.value}
                      onChange={handleChange}
                      className="w-full py-1.5 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:border-primary-500 transition-all mt-1"
                    />
                  ) : (
                    <p className="text-sm text-surface-800 mt-0.5">{field.value || '—'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account info */}
        <div className="mt-6 bg-white border border-surface-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-surface-900 mb-4">Account</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-surface-100">
              <span className="text-surface-500">Account Created</span>
              <span className="text-surface-700">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-surface-500">Plan</span>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                Free
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
