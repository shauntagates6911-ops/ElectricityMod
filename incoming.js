if ('launchQueue' in window) {
  window.launchQueue.setConsumer(async (launchParams) => {
    if (!launchParams.files.length) return;

    for (const handle of launchParams.files) {
      if (handle.name.endsWith('.lightning')) {
        const file = await handle.getFile();
        const text = await file.text();
        const projectData = JSON.parse(text);

        console.log("Opened project via double-click:", projectData);
        // Trigger your mod's project loader here
        loadProjectIntoEngine(projectData);
      }
    }
  });
}
