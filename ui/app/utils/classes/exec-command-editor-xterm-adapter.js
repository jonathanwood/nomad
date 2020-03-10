const REVERSE_WRAPAROUND_MODE = '\x1b[?45h';

export default class ExecCommandEditorXtermAdapter {
  constructor(terminal, setCommandCallback, command) {
    this.terminal = terminal;
    this.setCommandCallback = setCommandCallback;

    this.command = command;

    this.keyListener = terminal.onKey(e => {
      this.handleKeyEvent(e);
    });

    terminal.simulateCommandKeyEvent = this.handleKeyEvent.bind(this);
    terminal.write(REVERSE_WRAPAROUND_MODE);
  }

  handleKeyEvent(e) {
    // FIXME handle arrow keys, but how?
    if (e.domEvent.key === 'Enter') {
      this.terminal.writeln('');
      this.setCommandCallback(this.command);
      this.keyListener.dispose();
    } else if (e.domEvent.key === 'Backspace') {
      if (this.command.length > 0) {
        this.terminal.write('\x08 \x08');
        this.command = this.command.slice(0, -1);
      }
    } else if (e.key.length > 0) {
      this.terminal.write(e.key);
      this.command = `${this.command}${e.key}`;
    }
  }

  destroy() {
    this.keyListener.dispose();
  }
}
