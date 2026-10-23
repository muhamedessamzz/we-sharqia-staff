import React from 'react';
import AdminFeature from '../features/admin';

/**
 * AdminView Facade
 * Refactored into Feature-Driven modular architecture under `src/features/admin/`
 * Preserves 100% backward compatibility with App.jsx
 */
export default function AdminView(props) {
  return <AdminFeature {...props} />;
}
