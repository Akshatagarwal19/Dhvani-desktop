import { useState } from "react";

function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  async function handleSelectFolder() {
    const folder = await window.api.selectFolder();

    if (folder) {
      setSelectedFolder(folder);
    }
  }

  return (
    <div>
      <h1>Library</h1>

      <button onClick={handleSelectFolder}>
        Select Music Folder
      </button>

      <br />
      <br />

      {selectedFolder ? (
        <p>
          <strong>Selected Folder:</strong>
          <br />
          {selectedFolder}
        </p>
      ) : (
        <p>No music folder selected.</p>
      )}
    </div>
  );
}

export default LibraryPage;