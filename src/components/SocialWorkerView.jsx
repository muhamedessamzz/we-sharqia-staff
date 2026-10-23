import React from 'react';
import SocialWorkerFeature from '../features/social-worker';

/**
 * SocialWorkerView Facade
 * Refactored into Feature-Driven modular architecture under `src/features/social-worker/`
 * Preserves 100% backward compatibility with App.jsx
 */
export default function SocialWorkerView(props) {
  return <SocialWorkerFeature {...props} />;
}
