var playlistDictionary = {};

Playlist = (function(){

  var constructor = function Playlist(doc){
    this.defineClass();

    if (doc) {
      this.doc = doc;
      this.register();
    }
  };

  constructor.prototype.defineClass = function(){
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
    };

    Object.defineProperty(this, "dependencies",{
      value : {
        _id : new Deps.Dependency(),
        status : new Deps.Dependency()
      }
    });
    Object.defineProperty(this, "doc", {
      value: {
        _id : null,
        status : {
          state: 'stopped',
          song: null
        }},
      enumerable : false,
      writable : true
    });
    Object.defineProperty(this, "_id", {
      enumerable : true,
      get : defaultGetter('_id')
    });
    Object.defineProperty(this, "status", {
      enumerable : true,
      get : defaultGetter('status'),
      set : defaultSetter('status')
    });

    function defineStatus(){
      var status = {};
      var dependency = this.dependencies.status;

      var statusGetter = function(name){
        return function(){
          dependency.depend();
          return this.doc.status[name];
        };
      };
      var statusSetter = function(name){
        return function(newVal){
          dependency.changed();
          return this.doc.status[name] = newVal;
        }
      };

      Object.defineProperties(status,{
        state : {
          value: "stopped",
          writable: true,
          enumerable: true,
          get: statusGetter('state'),
          set: statusSetter('state')
        },
        song : {
          value: null,
          writable: true,
          enumerable: true,
          get: statusGetter('song'),
          set: statusSetter('song')
        }
      });
      return status;
    }
  };



  constructor.prototype.save = function(){
    if (this._id) {
      Playlists.update(this._id, this);
    } else {
      this.doc._id = Playlists.insert(this);
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
    playlistDictionary[this._id] = this;
    Playlists.find(this._id).observeChanges({
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