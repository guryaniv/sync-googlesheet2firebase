# Sync google sheet to Firebase

Using [google apps script](https://developers.google.com/apps-script), we can sync the content of a google sheet to [Firebase realtime database](https://firebase.google.com/docs/database/?gclid=Cj0KCQjwhZr1BRCLARIsALjRVQNgmVeiW1uAGHJiOxdjzNriF-kZmG8DjPgcb0Rff3Xj9-DZkgcaPysaAhfQEALw_wcB).
<br/>My usecase- update food ordering app's menus by only changing the google sheet, without the need to code or access the database.<br/>

## Prerequisites
You need to have the firebase realtime database setup and the google sheet that you would like to sync data from. The database rules must allow reading and writing (this can be changed later).

## Setup
<ol>
  <li>Inside the sheet, go to <code>Tools -> Script editor</code></li>
  <li>Replace the content of <code>Code.gs</code> and <code>appsscript.json</code> files with the ones here.</li>
  <li>Adjust the <code>formJSON()</code> function inside <code>Code.gs</code> to create the object that you would like to sync.</li>
  <li>Go to <code>Run -> Run function -> initialize</code></li>
</ol>

