Template.landingPage.events({
  'click #createPlaylist': function () {
    playlist = new Playlist();
    Session.set('currentPlaylist',playlist.getID());
  },
  'click .playlistLink': function(e){
    e.preventDefault();
    Session.set('currentPlaylist',e.currentTarget.dataset.playlist);
  }
});
Template.landingPage.playlists = function(){
  return Playlists.find();
}
