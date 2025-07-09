import { useEffect, useRef, useState } from 'react'
import Codemirror from 'codemirror'
import "codemirror/lib/codemirror.css"
import "codemirror/theme/ayu-dark.css"
import "codemirror/mode/javascript/javascript.js"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import Actions from '../Actions'


const Editor = ({ socketRef, roomId, onCodeSync, username, runCode }) => {
  const editorRef = useRef(null);

  // const [suggestion, setSuggestion] = useState("")

  // const fetchsuggestion = async (code) => {
  //   try {
  //     const respons = await fetch("https://api-inference.huggingface.co/models/Salesforce/codegen-350M-multi", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         inputs: code,
          // parameters: {
          //   max_new_tokens: 20,
          //   temperature: 0.2,
          // }
      //   })
      // })
      // const data = await respons.json()
      // const fullText = data[0]?.generated_text || "";
      // const nextLine = fullText.replace(code, '').split('\n')[0].trim();
      // return nextLine;

      // const newText = text.startsWith(code) ? text.slice(code.length) : ""
      // setSuggestion(newText.split("\n")[0].trim())

  //   } catch (error) {
  //     console.log(error)
  //     return

  //   }

  // }

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
        },

        "Shift-Enter": () => {
          if (typeof runCode === "function") {
            runCode()
          }

        },
        // 'Tab': () => {
        //   if (suggestion) {
        //     const doc = editorRef.current.getDoc();
        //     const cursor = doc.getCursor();
        //     doc.replaceRange(suggestion, cursor);
        //     setSuggestion('');
        //   }
        // }

      }

    });

    // Listen for changes in the editor and emit them to the server
    editorRef.current.on("change",  async (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeSync(code)

      if (origin !== "setValue") {
        socketRef.current.emit(Actions.CODE_CHANGE, {
          roomId,
          code
        })

        socketRef.current.emit(Actions.TYPING, {
          roomId,
          username,
        })

        // const prompt = code.split('\n').slice(-5).join('\n');
        // const suggestion = await fetchsuggestion(prompt);
        // setSuggestion(suggestion)
      }

    })

    return () => {
      editorRef.current?.toTextArea();
    };
  }, []);

  // Listen for code changes from the server and update the editor
  // This effect runs when the socket connection is established
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      })
    }
    return () => {
      socketRef.current.off(Actions.CODE_CHANGE)
    }

  }, [socketRef.current])


  return (
    <>
      <textarea ref={editorRef}></textarea>
      {/* {suggestion && (
        <div style={{
          backgroundColor: '#1c1e29',
          color: '#4aee88',
          padding: '8px',
          borderRadius: '8px',
          marginTop: '8px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          💡 <b>Suggestion:</b> <code>{suggestion}</code> <span style={{ color: '#999' }}>(Press Tab to accept)</span>
        </div>
      )} */}

    </>
  )
}

export default Editor
