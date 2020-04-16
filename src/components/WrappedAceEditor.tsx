import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow";
import useApplicationState from "../state";

const WrappedAceEditor: React.FC<{ mode: string; value: string }> = ({ mode, value }) => {
  const [state] = useApplicationState();

  return (
    <AceEditor
      mode={mode}
      theme={state.theme === "dark" ? "tomorrow_night" : "tomorrow"}
      fontSize={16}
      width="100%"
      maxLines={10000}
      readOnly
      wrapEnabled
      highlightActiveLine={false}
      showGutter={true}
      value={value}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        showLineNumbers: false,
        showPrintMargin: false,
        highlightSelectedWord: false,
        // @ts-ignore
        foldStyle: "markbeginend",
        fontFamily: "'Source Code Pro', monospace",
      }}
      onLoad={(editor) => {
        editor.commands.removeCommand("find");
        editor.container.style.lineHeight = 1.5;
        editor.renderer.updateFontSize();
      }}
      style={{
        padding: "8px",
      }}
    />
  );
};

export default WrappedAceEditor;
