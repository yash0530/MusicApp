$(() => {
    $.ajax("/songs")
        .done((songs) => {
            console.log(songs)
        });
});