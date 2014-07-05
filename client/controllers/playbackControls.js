var playlist = null;
Deps.autorun(function(){
  playlist = Playlist.get(Session.get('currentPlaylist'))
})

Template.controls.events({
  'click playpause' : function (argument) {
    playlist.togglePlaying();
  }
});
