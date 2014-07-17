var playlist = null;
Meteor.startup(function(){
  Deps.autorun(function(){
    playlist = Playlist.get(Session.get('currentPlaylist'));
  });
});

Template.controls.events({
  'click .playpause' : function (e) {
    e.preventDefault();
    playlist.togglePlaying();
  }
});
Template.controls.playpauseicon = function(){
  var status = playlist.getStatus();
  return status.state=='playing' ? 'Pause' : 'Play';
};
