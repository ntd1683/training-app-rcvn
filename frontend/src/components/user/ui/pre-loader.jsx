import { useEffect, useState } from 'react';
import '../../../assets/css/user/pre-loader.css';

const PreLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide preloader after 500ms
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures this runs once on mount

  if (!isVisible) return null; // Don't render anything if preloader is hidden

  return (
    <div className="preloader" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}>
      <div className="preloader-inner">
        <div className="preloader-icon">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;