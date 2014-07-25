var playlistDictionary = {};

Playlist = (function(){
  var ATTRIBUTES = ['status'];

  var that = null;
  var updater = "";
  var dependencies = {};

  var id = null;

  var constructor = function(_id){
    that = this;
    if (_id) {
      // Load existing playlist
      playlist = Playlists.findOne(_id);
      if (playlist) {
        id = _id;
        for (var i = 0; i < ATTRIBUTES.length; i++) {
          var key = ATTRIBUTES[i];
          this[key] = playlist[key];
        };
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
    for (var i = 0; i < ATTRIBUTES.length; i++) {
      attribute = ATTRIBUTES[i];
      dependencies[attribute] = new Deps.Dependency();
      getterName = 'get' + attribute.substr(0,1).toUpperCase() + attribute.substring(1);
      this[getterName] = (function(that, attr){
        return function(){
          dependencies[attribute].depend();
          return this[attribute];
        };
      })(this, attribute);
    };
    playlistDictionary[id] = this;
    Playlists.find(id).observeChanges({
      changed: function(id, changes){
        for (var attr in changes){
          that[attr] = changes[attr];
          dependencies[attr].changed();
        }
      }
    });
  };

  constructor.prototype.getID = function(){
    return id;
  }

  constructor.prototype.save = function(){
    return this;
  };

  constructor.prototype.togglePlaying = function(){
    this.status.state = this.status.state == 'playing' ? 'paused' : 'playing';
    if (!this.status.song){
      this.status.song = this.nextSong();
    }
    dependencies.status.changed();
    return this;
  }

  constructor.prototype.currentSong = function(){
    return Song.get(this.status.song);
  };

  constructor.prototype.nextSong = function(){
    var song;
    if (this.status.song === null){
      song = Songs.findOne({
        playlist: id,
      },{
        sort: {order: 1},
      });
    } else {
      currentSong = this.currentSong();
      song = Songs.findOne({
        playlist: id,
        order: {$gt: currentSong.order}
      },{
        sort: {order: 1}
      });
    }
    return song ? Song.get(song._id) : null;
  };

  return constructor;
})();

Playlist.get = function(id){
  if (!id){
    return null;
  } else if (playlistDictionary[id]) {
    return playlistDictionary[id];
  } else {
    return new Playlist(id);
  }
}