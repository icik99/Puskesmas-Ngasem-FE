import React, { useEffect, useRef, useState } from 'react';

import { Editor } from '@tinymce/tinymce-react';

const TinyMce = ({ getContentTinyMce, setDataTinyMce }) => {
  const editorRef = useRef(null);

  const initialContent = setDataTinyMce;

  const [valueTiny, setValueTiny] = useState(initialContent);

  const handleEditorChange = (content, editor) => {
    setValueTiny(content);
    getContentTinyMce(content);
  };

  const tinyMceLogger = () => {};

  useEffect(() => {
    tinyMceLogger();
  }, [valueTiny]);

  return (
    <div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        onEditorChange={handleEditorChange}
        value={setDataTinyMce}
        initialValue={getContentTinyMce}
        init={{
          plugins: [
            'advlist',
            'anchor',
            'autolink',
            'help',
            'image',
            'link',
            'lists',
            'searchreplace',
            'table',
            'wordcount',
          ],
          toolbar:
            'undo redo | formatselect | fontselect | fontsize | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        }}
      />
    </div>
  );
};

export default TinyMce;
