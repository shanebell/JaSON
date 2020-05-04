import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-properties";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import { useTheme } from "../state";

const WrappedAceEditor: React.FC<{
  mode: string;
  value: string;
  readOnly: boolean;
  onChange?: any;
  minLines?: number;
  maxLines?: number;
}> = ({ mode, value, readOnly, onChange = () => {}, minLines = 5, maxLines = 40 }) => {
  const [theme] = useTheme();

  return (
    <AceEditor
      mode={mode}
      theme={theme === "dark" ? "tomorrow_night" : "tomorrow"}
      fontSize={16}
      width="100%"
      minLines={minLines}
      maxLines={maxLines}
      readOnly={readOnly}
      highlightActiveLine={false}
      enableBasicAutocompletion={readOnly ? false : true}
      wrapEnabled
      showGutter={true}
      value={value}
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        fixedWidthGutter: true,
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
      onChange={onChange}
    />
  );
};

export default WrappedAceEditor;
