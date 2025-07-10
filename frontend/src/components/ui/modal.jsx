import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title = "Modal title", 
  children, 
  size = "",
  showCloseButton = true,
  backdrop = true,
  keyboard = true,
  footer = null,
  modalId = "modal"
}) => {
  const handleBackdropClick = (e) => {
    if (backdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (keyboard && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, keyboard, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`modal fade ${isOpen ? 'show' : ''}`}
      id={modalId}
      tabIndex="-1"
      aria-hidden={!isOpen}
      style={{ display: isOpen ? 'block' : 'none' }}
      onClick={handleBackdropClick}
    >
      <div className={`modal-dialog ${size}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}Label`}>{title}</h5>
            {showCloseButton && (
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            )}
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;