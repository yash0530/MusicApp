$(() => {
    $.ajax("/songs")
        .done((songs) => {
            console.log(songs);
            songs.forEach(song => {
                $("#songs").append(`
                <div class="col-md-4 col-6 col-lg-3 col-xl-2 song-play" id="${song.filename}">
                    <div class="song-container">
                        <img src="/assets/default-albumart.png">
                        <div><strong>${song.name}</strong></div>
                        <div><strong>Artist</strong> ${song.artist}</div>
                        <div><strong>Genre</strong> ${song.genre}</div>
                    </div>
                </div>
                `);
            });
            $(".song-play").on("click", function () {

                $("audio").attr("src", `/songs/${$(this).attr("id")}`);

                console.log(`/songs/${$(this).attr("id")}`);
                $.ajax(`/songs/${$(this).attr("id")}`)
                    .done(function (data) {
                        console.log(data);
                        $('audio #source').attr('src', data);
                        $('audio').get(0).load();
                        $('audio').get(0).play();
                    })
            });
        });
});