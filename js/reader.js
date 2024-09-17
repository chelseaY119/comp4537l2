class NoteContainer {
  constructor(id) {
    this.noteContainer = document.getElementById(id);
    this.noteArray = [];
  }

  displayAllNotes() {
    this.noteContainer.innerHTML = "";
    this.noteArray = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("note")) {
        const noteData = JSON.parse(localStorage.getItem(key));

        const noteWrapper = document.createElement("div");
        noteWrapper.id = "note-wrapper";
        const noteElement = document.createElement("div");
        noteElement.id = "note-element";
        noteElement.textContent = noteData;
        noteWrapper.appendChild(noteElement);

        this.noteContainer.appendChild(noteWrapper);
      }
    });
  }
}

class ReadContainer extends NoteContainer {
  constructor(id) {
    super(id);
  }
}

// for entire note app
class NoteApp {
  constructor(container) {
    this.noteContainer = container;
  }

  start() {
    this.noteContainer.displayAllNotes();
  }

  updateLastSavedTime() {
    const lastSavedElement = document.getElementById("storage-time");
    const now = new Date();
    lastSavedElement.textContent = `Last saved: ${now.toLocaleTimeString()}`;
  }
}

window.onload = function () {
  const noteApp = new NoteApp(new ReadContainer("message-display-area-reader"));

  noteApp.start();

  document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  setInterval(() => {
    noteApp.noteContainer.displayAllNotes();
    noteApp.updateLastSavedTime();
  }, 2000);
};
