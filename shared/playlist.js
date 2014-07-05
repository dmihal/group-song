Playlist = (function(){
  var updater = "";
  constructor = function(){
    this.id = null;
    this.status = {
      state: 'stopped',
      song: null
    };
    this.id = Playlists.insert(this);
  };

  constructor.prototype.save = function(){
    return this;
  };

  constructor.prototype.currentSong = function(){
    return Songs.findOne(this.status.song);
  }

  constructor.prototype.nextSong = function(){
    if (this.status.song === null){
      song = Songs.find({
        playlist: this.id,
      },{
        sort: {order: 1},
        limit: 1,
      });
      return song;
    } else {
      currentSong = this.currentSong
      song = Songs.find({
        playlist: this.id,
      });
    }
  }

  return constructor;
})()
