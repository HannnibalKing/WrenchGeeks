# Internal Troubleshooting Log & Guide
**Date:** December 23, 2025
**Incident:** Visitor Counter Not Showing / Site Not Updating

## 🚨 The "Why It Happened" (Root Cause Analysis)

We faced a "perfect storm" of three separate issues happening at once:

1.  **The "Ghost" Code (Git Sync):**
    *   **Issue:** We made changes locally (adding the counter), but they weren't *pushed* to GitHub.
    *   **Result:** You were looking at the live site, which was still serving the old version, while the new code sat only on your computer.
    *   **Fix:** Ran `git add`, `git commit`, and `git push`.

2.  **The Corrupted File (CSS Null Bytes):**
    *   **Issue:** The `style.v3.css` file got corrupted. It contained invisible "null bytes" (garbage data) right before the new counter styles.
    *   **Result:** The browser read the file, hit the garbage data, and stopped reading. The counter HTML was there, but it had zero styling (invisible or broken layout).
    *   **Fix:** Surgically removed the null bytes and restored clean CSS.

3.  **The Sticky Cache:**
    *   **Issue:** Browsers love to save time by keeping old files. Even after we fixed the code, the browser might have been holding onto `style.v2.css`.
    *   **Fix:** We renamed the files to `style.v3.css` and `script.v4.js`. This forces the browser to download the new ones because it thinks they are completely different files.

---

## 🛠️ Future Troubleshooting Guide (If it happens again)

If the site isn't updating or something looks broken, follow this checklist:

### 1. The "Is it actually online?" Check
Open a terminal and run:
```powershell
git status
```
*   **If it says "Changes not staged..." or "Untracked files":** You haven't saved your changes to the history.
*   **If it says "Your branch is ahead of 'origin/main'":** You saved them, but didn't send them to the internet.
*   **Action:** Run `git push`.

### 2. The "Hard Refresh"
Browsers lie. They show you old versions.
*   **Action:** Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac) on the live site. This forces a re-download.

### 3. The "Null Byte" Check (File Corruption)
If a specific part of the site looks unstyled or broken:
*   **Action:** Open the CSS/JS file in VS Code. Look for weird symbols or red blocks. If the file looks cut off, it might be corrupted.

### 4. The "Console" Check
If a feature (like the counter) isn't working:
*   **Action:** Right-click the page -> Inspect -> Click "Console" tab.
*   **Look for:** Red text.
    *   `404 Not Found`: You linked to a file that doesn't exist (or has the wrong name).
    *   `Network Error`: The API (like the counter service) is down or blocked.

### 5. The Counter Specifics
The visitor counter uses an external service.
*   **Primary:** `api.counterapi.dev`
*   **Fallback:** `api.countapi.xyz`
*   **If both fail:** The script is designed to show dashes (`-`) instead of crashing.
*   **Test:** You can test if the service is up by running this in PowerShell:
    ```powershell
    Invoke-RestMethod -Uri "https://api.counterapi.dev/v1/wrenchgeeks/visits/up" -Method Get
    ```
