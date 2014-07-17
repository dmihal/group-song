songDictionary = {};
num = 0;

Song = (function(){
  var id;
  constructor = function(_id){
    if (_id) {
      song = Songs.findOne(_id);
      if (song) {
        id = _id;
        this.playlist = song.playlist;
        this.order = song.order;
        this.type = song.type;
        this.mediaID = song.mediaID;
        this.url = song.url;
        this.title = 'song'+num++;

        songDictionary[id] = this;
      } else {
        throw "could not find song "+_id
      }
    } else {
      this.playlist = null;
      this.order = null;
      this.type = null;
      this.mediaID = null;
      this.url = null;
      this.title = 'song'+num++;
    }
  };

  constructor.prototype.save = function() {
    if (id) {
      Songs.update(id,this);
    } else {
      id = Songs.insert(this);
      songDictionary[id] = this;
    }
  };
  return constructor;
})();

Song.get = function(id){
  if (songDictionary[id]){
    return songDictionary[id];
  } else {
    return new Song(id);
  }
}
