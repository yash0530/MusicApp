### AUTH

| Verb           | Route            | Description     
| -------------- | ---------------- | --------------------
| GET            | /register        | Show register page
| POST           | /register        | Register user
| GET            | /login           | Show login page  
| POST           | /login           | Login user
| GET            | /logout          | Logout user


### USERS

| Verb           | Route            | Description     
| -------------- | ---------------- | --------------------
| GET            | /users/:id       | Show user profile
| GET            | /users/:id/edit  | Show user profile edit page
| POST           | /users/:id/      | Edit user profile
| GET            | /users/:id/:id_2 | user id following id2


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