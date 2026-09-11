# GitHub deployment guide

## Portfolio
1. Create/open the repository `prince33-dec.github.io`.
2. Upload the contents of this folder to the **root** of the `main` branch.
3. Keep `index.html` at the repository root.
4. In **Settings → Pages**, choose **Deploy from a branch**, select `main`, and select `/ (root)`.
5. The public site will be available at `https://prince33-dec.github.io/` after GitHub Pages finishes deploying.

## APK release
Create a GitHub Release (for example `V1.0.0`) and upload these assets using these exact filenames:

- `Aaitravo.apk`
- `Attendance.apk`
- `MediTime.apk`
- `NearbyReminders.apk`
- `SafeCipher.apk`
- `SmartExpense.apk`
- `TripSplitter.apk`

The portfolio uses GitHub's `releases/latest/download/<asset-name>` pattern, so later releases can replace the APKs without editing `index.html`.

### Important
GitHub Releases are separate from GitHub Pages. Upload the website files to the repository and upload APK binaries to the Release assets. Do not put APK binaries into the Pages website directory unless you specifically want them stored as repository files.
