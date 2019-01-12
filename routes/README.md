### AUTH

| Verb           | Route            | Description     
| -------------- | ---------------- | --------------------
| GET            | /register        | Show register page
| POST           | /register        | Register user
| GET            | /login           | Show login page  
| POST           | /login           | Login user
| GET            | /logout          | Logout user


### SONGS API

| Verb           | Route            | Description     
| -------------- | ---------------- | --------------------
| GET            | /songs           | Return all songs (json)
| GET            | /songs/new       | Show new song form
| POST           | /songs           | Create song
| GET            | /songs/:id       | Returns song (mp3)
| DELETE         | /songs/:id       | Delete song
| GET            | /songs/:id/edit  | Show edit song form
| PUT            | /songs/:id       | Update song info