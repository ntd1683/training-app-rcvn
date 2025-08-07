import React, { useState, useRef, useEffect } from 'react';
import product1 from "../../../assets/images/products/product-1.jpg";

const MagnifyingGallery = ({image_url, images = []}) => {
  const defaultImage = image_url && image_url.trim() !== '' ? image_url : product1;
  const [currentImage, setCurrentImage] = useState(defaultImage);
  
  useEffect(() => {
    const newImage = image_url && image_url.trim() !== '' ? image_url : product1;
    setCurrentImage(newImage);
  }, [image_url]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ backgroundPosition: '0% 0%' });
  const imageRef = useRef(null);


  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    // Tính vị trí chuột relative đến ảnh (0-1)
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    // Giới hạn trong khung ảnh
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));
    
    // Chuyển đổi thành percentage để sử dụng với background-position
    const xPercent = clampedX * 100;
    const yPercent = clampedY * 100;
    
    setZoomPosition({
      backgroundPosition: `${xPercent}% ${yPercent}%`
    });
  };

  return (
    <div className="container mt-4">
      <main id="gallery">
        {/* Main Image with Magnifying Effect */}
        <div className="row justify-content-center">
          <div className="col-12">
            <div
              className="main-img position-relative"
              style={{
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                overflow: 'visible'
              }}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imageRef}
                src={currentImage}
                id="current"
                alt="Main product image"
                className="img-fluid"
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  cursor: 'crosshair',
                  borderRadius: '8px'
                }}
              />

              {/* Zoomed Image Display - Sử dụng background-image */}
              {showZoom && (
                <div
                  className="position-absolute border border-white rounded shadow-lg"
                  style={{
                    top: '10px',
                    right: '10px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: `url(${currentImage})`,
                    backgroundSize: '400% 400%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#fff',
                    zIndex: 20,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    ...zoomPosition
                  }}
                >
                  {/* Zoom indicator */}
                  <div
                    className="position-absolute bg-dark text-white px-2 py-1 rounded"
                    style={{
                      bottom: '5px',
                      right: '5px',
                      fontSize: '10px',
                      opacity: 0.8
                    }}
                  >
                    4x Zoom
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Images */}
        <div className="images d-flex gap-2 justify-content-center flex-wrap mt-4">
          {/* Luôn hiển thị ảnh chính */}
          <img
            src={currentImage}
            className={`img border rounded border-primary border-3`}
            alt="Main product thumbnail"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: 1
            }}
            onClick={() => setCurrentImage(currentImage)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.opacity = '1';
            }}
          />
          {/* Hiển thị các ảnh phụ nếu có */}
          {images.filter(image => image && image.trim() !== '' && image !== currentImage).map((image, index) => (
            <img
              key={index}
              src={image}
              className={`img border rounded border-secondary`}
              alt={`Product thumbnail ${index + 2}`}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: 0.7
              }}
              onClick={() => setCurrentImage(image)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '0.7';
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MagnifyingGallery;