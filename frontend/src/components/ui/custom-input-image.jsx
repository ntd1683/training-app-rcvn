import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

const CustomInputImage = ({
    value,
    setValue,
    errorImage,
    setErrorImage,
    maxFileSize = 2, // in MB
    maxImageSize = 1024, // in pixels (width or height)
    previewImage = null,
    setPreviewImage = () => {},
}) => {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        setPreview(previewImage);
    }, [previewImage]);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (value) {
            const fileExtension = value.name.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        if (img.width > maxImageSize || img.height > maxImageSize) {
                            setErrorImage('Image dimensions must not exceed ' + maxImageSize + ' px in width or height.');
                            setValue(null);
                            setPreview(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                            }
                        } else {
                            setPreview(e.target.result);
                        }
                    };
                    img.onerror = () => {
                        setErrorImage('Invalid image file.');
                        setValue(null);
                        setPreview(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                        }
                    };
                    img.src = e.target.result;
                };
                fileReader.readAsDataURL(value);
            } else {
                setErrorImage('Unsupported file type. Please upload an image (jpg, jpeg, png, gif).');
                setValue(null);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            }
        } else {
            setPreview(null);
        }
    }, [value, setValue, maxImageSize, setErrorImage]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > maxFileSize * 1024 * 1024) {
                setErrorImage('File size must not exceed ' + maxFileSize + 'MB.');
                setValue(null);
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
                return;
            }
            setValue(file);
        } else {
            setValue(null);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
        }
    };

    return (
        <div className="mb-5">
            <label htmlFor="inputImage" className="form-label">Hình ảnh sản phẩm</label>
            <div className="input-group input-group-merge">
                <span id="basic-icon-image" className="input-group-text">
                    <Icon icon="bx:cloud-upload" className="icon-base bx" />
                </span>
                <input
                    type="file"
                    className={`form-control ${errorImage ? 'is-invalid' : ''}`}
                    id="inputImage"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="Upload"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <label
                    className="form-control"
                    htmlFor="inputImage"
                    style={{ cursor: 'pointer' }}
                >
                    {value ? value.name : 'Choose an image...'}
                </label>
                <button
                    className="btn btn-outline-danger"
                    type="button"
                    id="inputGroupFileAddon04"
                    onClick={() => {
                        setValue(null);
                        setPreview(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                        }
                        if (previewImage) {
                            setPreviewImage(null);
                        }
                    }}
                >
                    Xoá File
                </button>
            </div>
            <div className="text-danger mt-2">{errorImage}</div>

            {preview && (
                <div className="mt-4">
                    <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded border border-secondary shadow border-2"
                        style={{ maxWidth: '300px', maxHeight: '300px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomInputImage;