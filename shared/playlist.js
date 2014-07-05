var playlistDictionary = {};

Playlist = (function(){
  var updater = "";

  var id = null;

  var constructor = function(_id){
    if (_id) {
      // Load existing playlist
      playlist = Playlists.findOne(_id);
      if (playlist) {
        id = _id;
        this.status = playlist.status;
      } else {
        throw "Could not find playlist with id "+id;
      }
    } else {
      // Make a new playlist
      this.status = {
        state: 'stopped',
        song: null
      };
      id = Playlists.insert(this);
    }
    playlistDictionary[this.id] = this;
  };

  constructor.prototype.getID = function(){
    return id;
  }

  constructor.prototype.save = function(){
    return this;
  };

  constructor.prototype.togglePlaying = function(){
    this.status.state = 'paused' ? this.status.state == 'playing' : 'playing';
    return this;
  }

  constructor.prototype.currentSong = function(){
    return Songs.findOne(this.status.song);
  };

  constructor.prototype.nextSong = function(){
    if (this.status.song === null){
      song = Songs.findOne({
        playlist: id,
      },{
        sort: {order: 1},
      });
      return song;
    } else {
      currentSong = this.currentSong
      song = Songs.findOne({
        playlist: id,
        order: {$gt: currentSong.order}
      },{
        sort: {order: 1}
      });
      return song;
    }
  };

  return constructor;
})();

Playlist.get = function(id){
  if (playlistDictionary[id]) {
    return playlistDictionary[id];
  } else {
    return new Playlist(id);
  }
}