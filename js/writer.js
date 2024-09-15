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

  addNoteToContainer(note) {
    const noteWrapper = document.createElement("div");
    noteWrapper.id = "note-wrapper";
    const noteElement = document.createElement("div");
    noteElement.id = "note-element";
    noteElement.textContent = note.content;
    noteWrapper.appendChild(noteElement);

    const noteButton = document.createElement("button");
    noteButton.textContent = "remove";
    noteButton.id = "remove-button";

    const noteButton2 = document.createElement("button");
    noteButton2.textContent = "edit";
    noteButton2.id = "edit-button";

    noteWrapper.appendChild(noteButton);
    noteWrapper.appendChild(noteButton2);

    this.noteContainer.appendChild(noteWrapper);

    this.noteArray.push(note);

    noteButton.addEventListener("click", () => {
      note.removeNote(note.id);
      this.noteContainer.removeChild(noteWrapper);
      this.noteArray = this.noteArray.filter((n) => {
        return n.id !== note.id;
      });
    });

    noteButton2.addEventListener("click", () => {
      noteWrapper.innerHTML = "";
      const inputBox = document.createElement("input");
      inputBox.id = "input-value";
      noteWrapper.append(inputBox);
      const okButton = document.createElement("button");
      okButton.textContent = "ok";
      okButton.id = "ok-button";
      noteWrapper.append(okButton);

      const newContent = document.getElementById("input-value").value;
      note.modifyNote(newContent);

      okButton.addEventListener("click", () => {
        const newContent = inputBox.value.trim();
        if (newContent) {
          note.modifyNote(newContent);
          noteElement.textContent = newContent;
          noteWrapper.innerHTML = "";
          this.noteContainer.appendChild(noteWrapper);
          this.addNoteToContainer(note);
          this.noteArray = this.noteArray.map((n) =>
            n.id === note.id ? note : n
          );
        }
      });
    });
  }

  // display all notes in the corresponding container
  displayAllNotes(type) {
    this.noteContainer.innerHTML = "";
    this.noteArray = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("note")) {
        const noteData = JSON.parse(localStorage.getItem(key));
        if (noteData) {
          const note = new Note(noteData, key);
          this.addNoteToContainer(note, type);
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
