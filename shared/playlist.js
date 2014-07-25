var playlistDictionary = {};

Playlist = (function(){

  var constructor = function(doc){
    that = this;
    if (doc) {
      this.doc = doc;
      this.register();
    }
  };

  var defaultGetter = function(name){
    return function(){
      this.dependencies[name].depend();
      return this.doc[name];
    };
  };
  var defaultSetter = function(name){
    return function(newVal){
      this.dependencies[name].changed();
      return this.doc[name] = newVal;
    }
  }

  Object.defineProperty(constructor, "dependencies",{
    value : {
      id : new Deps.Dependency(),
      status : new Deps.Dependency()
    }
  });
  Object.defineProperty(constructor, "doc", {
    value: {
      id : null,
      status : {
        state: 'stopped',
        song: null
      }},
    enumerable : false
  });
  Object.defineProperty(constructor, "id", {
    enumerable : true,
    get : defaultGetter('id')
  });
  Object.defineProperty(constructor, "status", {
    enumerable : true,
    writable : true,
    get : defaultGetter('status'),
    set : defaultSetter('status')
  });


  constructor.prototype.save = function(){
    if (this.id) {
      Playlists.update(this.id, this);
    } else {
      this.doc.id = Playlists.insert(this);
      this.register();
    };
    return this;
  };
  constructor.prototype.updateWithDoc = function(doc){
    for(var attr in doc){
      if (this[attr] !== doc[attr]){
        this[attr] = doc[attr];
      }
    }
  };
  constructor.prototype.register = function(){
    playlistDictionary[this.id] = this;
    Playlists.find(this.id).observeChanges({
      changed: function(id, changes){
        for (var attr in changes){
          that[attr] = changes[attr];
        }
      }
    });
  };

  constructor.prototype.togglePlaying = function(){
    this.status.state = this.status.state == 'playing' ? 'paused' : 'playing';
    if (!this.status.song){
      this.status.song = this.nextSong();
    }
    this.dependencies.status.changed();
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