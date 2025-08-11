import React, { useState, useRef, useEffect } from 'react';
import '~/assets/css/user/dual-range-container.css';

const DualRangeSlider = ({
  min = 0,
  max = 50000,
  initialMin = 10,
  initialMax = 49990,
  step = 0.1,
  unit = "$",
  formatType = "usd",
  handlePriceChange,
  className = ""
}) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);

  useEffect(() => {
    setMinValue(initialMin);
    setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  const sliderRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  const formatNumber = (num) => {
    if (formatType === "usd") {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 3,
      }).format(num);
    } else {
      return (num / 1000).toFixed(1).replace('.', ',');
    }
  };

  const parseNumber = (str) => {
    if (formatType === "usd") {
      // Parse USD format: remove commas, convert to float
      const cleanStr = str.replace(/,/g, '');
      const num = parseFloat(cleanStr);
      return isNaN(num) ? 0 : num;
    } else {
      // Parse VND format: replace comma with dot, multiply by 1000
      const cleanStr = str.replace(/,/g, '.');
      const num = parseFloat(cleanStr);
      return isNaN(num) ? 0 : num * 1000;
    }
  };

  // Validate input characters
  const validateInput = (value) => {
    if (formatType === "usd") {
      // Allow numbers, commas, and one decimal point for USD
      return value.replace(/[^0-9,.]/g, '').replace(/(\..*)\./g, '$1');
    } else {
      // Allow numbers and dots for VND
      return value.replace(/[^0-9.]/g, '');
    }
  };

  // Handle input changes
  const handleMinInputChange = (e) => {
    const value = validateInput(e.target.value);
    e.target.value = value; // Update input display immediately

    const numValue = parseNumber(value);
    if (numValue <= maxValue && numValue >= min) {
      setMinValue(numValue);
      handlePriceChange({ min: numValue, max: maxValue });
    }
  };

  const handleMaxInputChange = (e) => {
    const value = validateInput(e.target.value);
    e.target.value = value; // Update input display immediately

    const numValue = parseNumber(value);
    if (numValue >= minValue) {
      setMaxValue(numValue);
      handlePriceChange({ min: minValue, max: numValue });
    }
  };

  // Calculate percentages for positioning
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  // Handle mouse events for dragging
  const handleMouseDown = (e, thumb) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveThumb(thumb);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !activeThumb || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width * 100), 100);
    const value = Math.round((percent / 100) * (max - min) + min);

    if (activeThumb === 'min') {
      const newMinValue = Math.min(value, maxValue - step);
      setMinValue(Math.max(newMinValue, min));
      handlePriceChange({ min: Math.max(newMinValue, min), max: maxValue });
    } else {
      const newMaxValue = Math.max(value, minValue + step);
      setMaxValue(Math.min(newMaxValue, max));
      handlePriceChange({ min: minValue, max: Math.min(newMaxValue, max) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveThumb(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, activeThumb, minValue, maxValue]);

  return (
    <div className={`dual-range-container ${className}`}>

      <div className="range-inputs">
        <div className="range-input-group">
          <input
            type="text"
            className={`range-input ${formatType}`}
            value={formatNumber(minValue)}
            onChange={handleMinInputChange}
            placeholder={formatType === "usd" ? "Min price" : "Giá tối thiểu"}
          />
          <span className="range-label">{unit}</span>
        </div>
        <div className="d-flex align-items-center justify-content-center">~</div>
        <div className="range-input-group">
          <input
            type="text"
            className={`range-input ${formatType}`}
            value={formatNumber(maxValue)}
            onChange={handleMaxInputChange}
            placeholder={formatType === "usd" ? "Max price" : "Giá tối đa"}
          />
          <span className="range-label">{unit}</span>
        </div>
      </div>

      <div className="slider-container" ref={sliderRef}>
        <div
          className="slider-track"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent > 100 ? (100 - minPercent) : (maxPercent - minPercent)}%`
          }}
        />

        <div
          ref={minThumbRef}
          className={`slider-thumb ${activeThumb === 'min' ? 'active' : ''} ${isDragging && activeThumb === 'min' ? 'dragging' : ''}`}
          style={{ left: `${minPercent}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
        />

        <div
          ref={maxThumbRef}
          className={`slider-thumb ${activeThumb === 'max' ? 'active' : ''} ${isDragging && activeThumb === 'max' ? 'dragging' : ''}`}
          style={{ left: `${maxPercent > 100 ? 100 : maxPercent}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;