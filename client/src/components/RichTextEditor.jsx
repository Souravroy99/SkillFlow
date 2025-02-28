import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef } from "react";

const RichTextEditor = ({ input, setInput }) => {
  const quillRef = useRef(null);

  return (
    <ReactQuill
      ref={quillRef}
      value={input.description}
      onChange={(content) => setInput({ ...input, description: content || "" })}
    />
  );
};

export default RichTextEditor;
