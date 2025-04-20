const PREFIX = "textEditor_";

export const saveToLocalStorage = (filename, data) => {
    if (!filename || !data) return;

    const key = `${PREFIX}${filename}`;
    const existing = localStorage.getItem(key);

    if (existing) {
        const confirmOverwrite = window.confirm(`"${filename}" already exists. Overwrite?`);
        if (!confirmOverwrite) return;
    }

    try {
        localStorage.setItem(key, JSON.stringify(data));
        alert(`Saved as "${filename}"`);
    } catch (err) {
        console.error("Error saving to localStorage", err);
    }
};

export const loadFromLocalStorage = (filename) => {
    if (!filename) return [];
    try {
        const json = localStorage.getItem(`${PREFIX}${filename}`);
        return json ? JSON.parse(json) : [];
    } catch (err) {
        console.error("Error loading from localStorage", err);
        return [];
    }
};

export const listSavedFilenames = () => {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(PREFIX)) {
            files.push(key.replace(PREFIX, ""));
        }
    }
    return files;
};
