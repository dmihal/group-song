var playing = null;
var playerObj = null;
Meteor.startup(function(){
  Deps.autorun(function() {
    var playlist = Playlist.get(Session.get('currentPlaylist'));
    if (!playlist){
      return;
    }

    var status = playlist.getStatus();
    if (status.state === 'playing'){
      playing = playlist.currentSong();
      if (playing){
        playing.getPlayer().setPlayback(true);
      } else {
        $("#playerTarget").html('');
      }
    } else if (status.state === 'paused') {
      playing = playlist.currentSong();
      playing.getPlayer().setPlayback(false);
    }
  });
});
Template.player.state = function(){
  var playlist = Playlist.get(Session.get('currentPlaylist'));
  if(!playlist){
    return "Error";
  }
  return playlist.getStatus().state;
}
Template.player.songs = function(){
  return Songs.find({playlist:Session.get('currentPlaylist')});
}
