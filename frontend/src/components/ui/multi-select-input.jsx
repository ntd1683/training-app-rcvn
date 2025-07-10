import React, { useState, useRef, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const MultiSelectInput = ({ 
  selectedItems,
  setSelectedItems,
  onSelectionChange, 
  label, 
  placeholder, 
  error, 
  handleSearch, 
  selectedAll 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue === '') {
        if (showDropdown) {
          handleSearch('', selectedItems, setFilteredOptions, setLoading);
        }
      } else {
        handleSearch(inputValue, selectedItems, setFilteredOptions, setLoading);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, selectedItems, showDropdown, handleSearch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selection change callback
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems.map(item => ({ id: item.id, name: item.name })));
    }
  }, [selectedItems, onSelectionChange]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  }, []);

  const handleSelectItem = useCallback((item) => {
    if (!selectedItems.find(selected => selected.id === item.id)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
    }
    setInputValue('');
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [selectedItems, setSelectedItems]);

  const handleRemoveItem = useCallback((itemToRemove) => {
    const newSelectedItems = selectedItems.filter(item => item.id !== itemToRemove.id);
    setSelectedItems(newSelectedItems);
  }, [selectedItems, setSelectedItems]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      handleSelectItem(filteredOptions[0]);
    } else if (e.key === 'Backspace' && inputValue === '' && selectedItems.length > 0) {
      handleRemoveItem(selectedItems[selectedItems.length - 1]);
    }
  }, [filteredOptions, inputValue, selectedItems, handleSelectItem, handleRemoveItem]);

  const handleFocus = useCallback(() => {
    setShowDropdown(true);
    if (filteredOptions.length === 0) {
      handleSearch('', selectedItems, setFilteredOptions, setLoading);
    }
  }, [filteredOptions.length, handleSearch, selectedItems]);

  const handleSelectAll = useCallback(() => {
    selectedAll(selectedItems, setSelectedItems, setLoading);
  }, [selectedAll, selectedItems, setSelectedItems]);

  return (
    <div className="mb-3">
      <label className="form-label fw-bold">{label}</label>
      <div className="position-relative" ref={dropdownRef}>
        <div className="form-control min-height-input min-height-input-multi-select d-flex flex-wrap align-items-center gap-2 p-2">
          {selectedItems.map((item, index) => (
            <span key={`${item.id}-${index}`} className="badge bg-primary d-flex align-items-center gap-1">
              {item.name}
              <button
                type="button"
                className="btn-close btn-close-input-multi-select btn-close-white"
                style={{ fontSize: '10px' }}
                onClick={() => handleRemoveItem(item)}
                aria-label="Remove item"
              />
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            className={`border-0 outline-0 outline-0-input-multi-select flex-grow-1 ${error ? 'is-invalid' : ''}`}
            style={{ minWidth: '120px' }}
          />
          {loading && (
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>

        {showDropdown && filteredOptions.length > 0 && (
          <ul 
            className="list-group position-absolute w-100 mt-1 shadow-lg bg-white" 
            style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
          >
            <li
              className="list-group-item list-group-item-action cursor-pointer cursor-pointer-input-multi-select"
              onClick={handleSelectAll}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectAll();
                }
              }}
            >
              Chọn tất cả
            </li>
            {loading ? (
              <li className="list-group-item text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Đang tải...</span>
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={`${option.id}-${index}`}
                  className="list-group-item list-group-item-action cursor-pointer cursor-pointer-input-multi-select"
                  onClick={() => handleSelectItem(option)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectItem(option);
                    }
                  }}
                >
                  {option.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      <div className="form-text">
        Chọn từ danh sách gợi ý hoặc nhập để tìm kiếm
      </div>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default MultiSelectInput;