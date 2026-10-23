import React from 'react';
import StudentAffairsFeature from '../features/student-affairs';

/**
 * StudentAffairsView Facade
 * Refactored into Feature-Driven modular architecture under `src/features/student-affairs/`
 * Preserves 100% backward compatibility with App.jsx
 */
export default function StudentAffairsView(props) {
  return <StudentAffairsFeature {...props} />;
}
