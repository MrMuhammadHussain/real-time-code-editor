import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import "codemirror/lib/codemirror.css"
import "codemirror/theme/ayu-dark.css"
import "codemirror/mode/javascript/javascript.js"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import Actions from '../Actions'


const Editor = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = Codemirror.fromTextArea(editorRef.current, {
      mode: { name: 'javascript', json: true },
      theme: 'ayu-dark',
      lineNumbers: true,
      autoCloseBrackets: true,
      autoCloseTags: true,

      extraKeys: {
        "Ctrl-Space": function (cm) {
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

    editorRef.current.on("change", (instance, changes) => {
      // console.log(changes)
      const { origin } = changes;
      const code = instance.getValue();
      if (origin !== "setValue") {
        socketRef.current.emit(Actions.CODE_CHANGE, {
          roomId,
          code
        })
      }


    })


    return () => {
      editorRef.current?.toTextArea();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }

      })
    }

  }, [socketRef.current])

  return (
    <textarea ref={editorRef}> </textarea>
  )
}

export default Editor