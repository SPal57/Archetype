import React from 'react';

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
    <div className="top-banner">
      <span className="logged-in-label">Demo — Logged in as:</span>
      <select value={currentUser} onChange={handleChange}>
        {users.map((user) => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>
      <span className="switch-hint">Switch user to test approve permissions</span>
    </div>
  );
}
