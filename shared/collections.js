Playlists = new Meteor.Collection("playlists",{
  transform: function (doc) {
    return new Playlist(doc);
  }
});
Songs = new Meteor.Collection("songs");
