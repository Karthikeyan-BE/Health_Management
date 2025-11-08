import Spinner from './Spinner';

/**
 * A full-page loading screen, used for initial auth check.
 */
const FullPageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Spinner size="lg" />
  </div>
);

export default FullPageSpinner;