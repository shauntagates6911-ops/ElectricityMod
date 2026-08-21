// LightningFileManager.js

export class LightningFileManager {
  /**
   * Save project data as a downloadable .lightning file
   * @param {Object} projectData - The JS object containing project state
   * @param {string} filename - Base name for the file
   */
  static saveProject(projectData, filename = "project") {
    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: "application/x-lightning+json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".lightning") ? filename : `${filename}.lightning`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Trigger a file picker to load a .lightning file
   * @returns {Promise<Object>} Resolves with the parsed project JSON
   */
  static loadProject() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".lightning";

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
          reject(new Error("No file selected"));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const projectData = JSON.parse(e.target.result);
            resolve(projectData);
          } catch (err) {
            reject(new Error("Invalid .lightning file format"));
          }
        };
        reader.readAsText(file);
      };

      input.click();
    });
  }
}
