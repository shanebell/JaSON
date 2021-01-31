import React, { useState } from "react";
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
import { IconButton, Snackbar, Tooltip, Typography } from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: "relative",
  },
  copy: {
    position: "absolute",
    zIndex: 100,
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const WrappedAceEditor: React.FC<{
  mode: string;
  value: string;
  readOnly: boolean;
  allowCopy?: boolean;
  copyMessage?: string;
  onChange?: any;
  minLines?: number;
  maxLines?: number;
  maxLength?: number;
  showGutter?: boolean;
}> = ({
  mode,
  value,
  readOnly,
  allowCopy = false,
  copyMessage = "Text copied to clipboard",
  onChange = () => {},
  minLines = 5,
  maxLines = 40,
  maxLength = 10_000,
  showGutter = true,
}) => {
  const [theme] = useTheme();
  const classes = useStyles();
  const [showCopySnackbar, setShowCopySnackbar] = useState<boolean>(false);

  const copyContent = () => {
    setShowCopySnackbar(false);

    const el = document.createElement("textarea");
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    setShowCopySnackbar(true);
  };

  return (
    <div className={classes.wrapper}>
      <AceEditor
        mode={mode}
        theme={theme === "dark" ? "tomorrow_night" : "tomorrow"}
        fontSize={16}
        width="100%"
        minLines={minLines}
        maxLines={maxLines}
        readOnly={readOnly}
        highlightActiveLine={false}
        enableBasicAutocompletion={!readOnly}
        wrapEnabled
        showGutter={showGutter}
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
          editor.getSession().on("change", () => {
            const session = editor.getSession();
            const document = session.getDocument();
            const value = document.getValue();
            if (value.length > maxLength) {
              const cursorPosition = editor.getCursorPosition();
              session.setValue(value.substring(0, maxLength));
              editor.moveCursorToPosition(cursorPosition);
            }
          });
        }}
        style={{
          padding: "8px",
        }}
        onChange={onChange}
      />
      {allowCopy && (
        <>
          <Tooltip arrow title={<Typography variant="caption">Copy content</Typography>}>
            <IconButton className={classes.copy} aria-label="Copy content" onClick={() => copyContent()}>
              <FileCopy fontSize="default" />
            </IconButton>
          </Tooltip>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={showCopySnackbar}
            autoHideDuration={2000}
            onClose={() => setShowCopySnackbar(false)}
            message={copyMessage}
          />
        </>
      )}
    </div>
  );
};

export default WrappedAceEditor;
