var playing = null;
var playerObj = null;
Meteor.startup(function(){
  Deps.autorun(function() {
    playlist = Playlist.get(Session.get('currentPlaylist'));
    if (!playlist){
      return;
    }

    var status = playlist.getStatus();
    if (status.state === 'playing' &&
        (playing === null ||
         status.song !== playing.getID())){
      $("#status").html("playing");
      playing = playlist.nextSong();
      if (playing){
        $("#playerTarget").html(playing.mediaID);
      } else {
        $("#playerTarget").html('');
      }
    }
  });
});
Template.player.songs = function(){
  return Songs.find({playlist:Session.get('currentPlaylist')});
}
