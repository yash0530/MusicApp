### USER

| Fields                | Type                  |            |
| --------------------- | --------------------- | ---------- |
| name                  | String                | Required
| email                 | String                | Auth
| password              | String                | Auth
| description           | String                
| avatar                | Image / URL
| genre                 | Array(String)
| recently Played       | Array(Song / Ref)
| favourites            | Array(Song / Ref)
| uploaded              | Array(Song / Ref)
| following             | Array(User / Ref)
| followers             | Array(User / Ref)
| created               | Date


### SONG
| Fields                | Type                  |        |
| --------------------- | --------------------- | ------ |
| name                  | String
| uploadedBy            | User / Ref
| artist                | String
| albumArt              | String
| genre                 | String
| year                  | Number
| length                | Number                | GridFs
| chunkSize             | Number                | GridFs
| uploadDate            | Date                  | GridFs
| filename              | String                | GridFs 
| md5                   | String                | GridFs
| contentType           | String                | GridFs