import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({
    value = '',
    onChange,
    placeholder = 'Nhập nội dung...',
    error = '',
    maxLength = 5000,
    height = 300,
    disabled = false
}) => {
    const editorRef = useRef(null);
    const [editorContent, setEditorContent] = useState(value);

    useEffect(() => {
        setEditorContent(value);
    }, [value]);

    const handleEditorChange = (content) => {
        setEditorContent(content);
        onChange(content);
    };

    return (
        <div className="tinymce-editor-container">
            <Editor
                apiKey={import.meta.env.VITE_KEY_SECRET_TINYMCE}
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                value={editorContent}
                onEditorChange={handleEditorChange}
                disabled={disabled}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
                        'insertdatetime', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Open Sans,Arial,sans-serif; font-size:14px }',
                    placeholder: placeholder,
                    setup: (editor) => {
                        editor.on('keydown', (e) => {
                            const content = editor.getContent({ format: 'text' });
                            if (content.length >= maxLength && ![8, 46, 37, 38, 39, 40].includes(e.keyCode)) {
                                e.preventDefault();
                            }
                        });
                    }
                }}
            />
            {error && <div className="text-danger mt-2">{error}</div>}

            <div className="mt-2 small text-muted">
                Content length: {editorContent.replace(/<[^>]*>/g, '').length}/{maxLength}
            </div>
        </div>
    );
};

export default TinyMCEEditor;