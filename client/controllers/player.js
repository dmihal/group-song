var playing = null;
var playerObj = null;
Meteor.startup(function(){
  Deps.autorun(function() {
    Playlists.find(Session.get('currentPlaylist')).observeChanges({
      changed: function(id, fields){
        playlist = Playlist.get(id);
        if (fields.status) {
          if (fields.status.state === 'playing' &&
              (playing === null ||
               fields.status.song !== playing.getID())){
            $("#status").html("playing");
            playing = playlist.nextSong();
            $("#playerTarget").html(playing.mediaID);
          }
        }
      }
    });
  });
});
