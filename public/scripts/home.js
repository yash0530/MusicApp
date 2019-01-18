
$(() => {
    $.ajax("/songs")
        .done((songs) => {
            console.log(songs);
            songs.forEach(song => {
                $("#songs").append(`
                <div class="col-md-4 col-6 col-lg-3 col-xl-2 song-play" id="${song.filename}">
                    <div class="song-container">
                        <img src="${song.albumArt}">
                        <div><strong>${song.name}</strong></div>
                        <div><strong>Artist</strong> ${song.artist}</div>
                        <div><strong>Genre</strong> ${song.genre}</div>
                        <a href="/songs/${song.filename}/edit" class="btn btn-xs btn-outline-warning">Edit</a>
                        <form action="/songs/${song.filename}?_method=DELETE" method="POST">
                            <button class="btn btn-xs btn-outline-danger">Delete</button>
                        </form>
                    </div>
                </div>
                `);
            });

            var song = new Howl({
                src: [""]
            });
            $(".song-play").on("click", function () {
                song.unload();
                song = new Howl({
                    src: ["/songs/" + $(this).attr("id")]
                });

                song.once("load", function(){
                    console.log(song);
                    song.play();
                });

                $("#howler-play").on("click", function(){
                    if(!song.playing()){
                        song.play();
                    };
                });
            
                $("#howler-pause").on("click", function(){
                    song.pause();
                });
            
                $("#howler-stop").on("click", function(){
                    song.stop();
                });
            
                $("#howler-volup").on("click", function(){
                    var vol = song.volume();
                    vol += 0.1;
                    if (vol > 1) {
                        vol = 1;
                    }
                    song.volume(vol);
                });
            
                $("#howler-voldown").on("click", function(){
                    var vol = song.volume();
                    vol -= 0.1;
                    if (vol < 0) {
                        vol = 0;
                    }
                    song.volume(vol);
                });
            });
        });
});