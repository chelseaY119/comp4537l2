// for each note
class Note {
  constructor(content, id) {
    this.content = content;
    this.id = id;
  }

  saveNotetoStorage(id, content) {
    const noteinJSON = JSON.stringify(content);
    localStorage.setItem(id, noteinJSON);
  }

  removeNote(id) {
    localStorage.removeItem(id);
  }

  modifyNote(content) {
    this.content = content;
    this.saveNotetoStorage(this.id, this.content);
  }
}

class NoteContainer {
  constructor(id) {
    this.noteContainer = document.getElementById(id);
    this.noteArray = [];
  }

  addNoteToUI(note) {
    const wrapper = this.createNoteWrapper(note);
    this.noteContainer.appendChild(wrapper);
    this.noteArray.push(note);
  }

  removeNoteUI(wrapper, note) {
    this.noteContainer.removeChild(wrapper);
    this.noteArray = this.noteArray.filter((n) => {
      return n.id !== note.id;
    });
    note.removeNote(note.id);
  }

  editNoteUI(noteWrapper, note) {
    const noteElement = noteWrapper.querySelector("#note-element");
    const inputBox = document.createElement("input");
    inputBox.value = note.content;
    noteWrapper.innerHTML = "";
    noteWrapper.appendChild(inputBox);

    const okButton = this.createButton("ok", () => {
      const newContent = inputBox.value.trim();
      if (newContent) {
        note.modifyNote(newContent);
        this.createNoteWrapper(note);
        this.addNoteToContainer(note);
        noteWrapper.innerHTML = "";
      } else {
        alert("Please enter a valid note!");
      }
    });
    noteWrapper.appendChild(okButton);
  }

  createButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = `${text}-button`;
    button.addEventListener("click", onClick);
    return button;
  }

  createNoteWrapper(note) {
    const noteWrapper = document.createElement("div");
    noteWrapper.id = "note-wrapper";

    const noteElement = document.createElement("div");
    noteElement.id = "note-element";
    noteElement.textContent = note.content;

    noteWrapper.appendChild(noteElement);

    const noteButton = this.createButton("remove", () => {
      this.removeNoteUI(noteWrapper, note);
    });
    const noteButton2 = this.createButton("edit", () => {
      this.editNoteUI(noteWrapper, note);
    });

    noteWrapper.appendChild(noteButton);
    noteWrapper.appendChild(noteButton2);

    return noteWrapper;
  }

  addNoteToContainer(note) {
    this.addNoteToUI(note);
  }

  // display all notes in the corresponding container
  displayAllNotes() {
    this.noteContainer.innerHTML = "";
    this.noteArray = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("note")) {
        const noteData = JSON.parse(localStorage.getItem(key));
        if (noteData) {
          const note = new Note(noteData, key);
          this.addNoteToContainer(note);
        }
      }
    });
  }
}

class WriteContainer extends NoteContainer {
  constructor(id) {
    super(id);
  }

  NewNoteSubmission(content) {
    const id = "note" + Date.now().toString();
    const newNote = new Note(content, id);
    newNote.saveNotetoStorage(id, content);
    this.addNoteToContainer(newNote);
  }
}

class NoteApp {
  constructor(container) {
    this.noteContainer = container;
  }

  start(type) {
    this.noteContainer.displayAllNotes(type);
  }

  updateLastSavedTime() {
    const lastSavedElement = document.getElementById("storage-time");
    const now = new Date();
    lastSavedElement.textContent = `Last saved: ${now.toLocaleTimeString()}`;
  }
}

const noteApp = new NoteApp(new WriteContainer("message-display-area"));

noteApp.start("writer");

document.getElementById("add-button").addEventListener("click", () => {
  const wrapper = document.getElementById("message-display-area");
  const neww = document.createElement("div");
  neww.id = "new-note-input";
  wrapper.appendChild(neww);

  const noteElement = document.createElement("input");
  noteElement.id = "input-field";
  neww.appendChild(noteElement);

  const noteButton = document.createElement("button");
  noteButton.textContent = "remove";
  noteButton.id = "remove-button";

  const noteButton2 = document.createElement("button");
  noteButton2.textContent = "add";
  noteButton2.id = "add-button-2";

  neww.appendChild(noteButton);
  neww.appendChild(noteButton2);

  document.getElementById("add-button-2").addEventListener("click", () => {
    const notecontent = document.getElementById("input-field").value;
    if (notecontent) {
      noteApp.noteContainer.NewNoteSubmission(notecontent);
      neww.innerHTML = "";
    }
  });
});

setInterval(() => {
  noteApp.noteContainer.noteArray.forEach((note) => {
    note.saveNotetoStorage(note.id, note.content);
  });
  noteApp.updateLastSavedTime();
}, 2000);

document.getElementById("back-button").addEventListener("click", () => {
  window.location.href = "index.html";
});
