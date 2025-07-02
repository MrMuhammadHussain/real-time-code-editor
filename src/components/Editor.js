import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import "codemirror/lib/codemirror.css"
import "codemirror/theme/ayu-dark.css"
import "codemirror/mode/javascript/javascript.js"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";


const Editor = () => {
  const editorRef = useRef();

  useEffect(() => {
    const editor = Codemirror.fromTextArea(editorRef.current, {
      mode: { name: 'javascript', json: true },
      theme: 'ayu-dark',
      lineNumbers: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      
      extraKeys: {
      "Ctrl-Space": function(cm) {
        cm.showHint({
          hint: () => {
            return {
              from: cm.getCursor(),
              to: cm.getCursor(),
              list: ['function', 'const', 'let', 'console.log', 'return', 'if', 'else'],
            };
          },
        });
      }
    }
      
    });

    return () => {
      editor.toTextArea();
    };
  }, []);

  return (
    <textarea
      ref={editorRef}
    ></textarea>
  )
}

export default Editor