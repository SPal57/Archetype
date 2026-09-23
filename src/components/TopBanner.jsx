import React from 'react';
import { User, ChevronDown } from 'lucide-react';

export default function TopBanner({ currentUser, setCurrentUser, onUserSwitch }) {
  const users = ['Andres Simar', 'Lisa Chen', 'Anna Mueller', 'Guest (not approver)'];

  const handleChange = (e) => {
    const newUser = e.target.value;
    setCurrentUser(newUser);
    if (onUserSwitch) {
      onUserSwitch(newUser);
    }
  };

  return (
    <header className="top-banner">
      <div className="top-banner-left">
        <div className="brand-logo">
          <span className="brand-bold">J&J</span>{' '}
          <span className="brand-light">MedTech</span>
        </div>
        <div className="brand-divider" />
        <div className="brand-title">
          Archetype Provisioning Hub
        </div>
      </div>

      <div className="top-banner-right">
        <div className="user-dropdown-container">
          <User size={15} className="user-icon" />
          <select value={currentUser} onChange={handleChange} className="user-select">
            {users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="dropdown-arrow" />
        </div>
      </div>
    </header>
  );
}
