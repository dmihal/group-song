Playlists = new CollectionModel('playlists', {
  properties: {
    status: {
      state: 'stopped',
      song: null
    }
  },
  methods: {
    togglePlaying: function(){
      this.status.state = (this.status.state == 'playing') ? 'paused' : 'playing';
      if (!this.status.song){
        this.status.song = this.nextSong();
      }
      this.dependencies.status.changed();
      return this;
    },
    nextSong: function(){
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
      return song;
    },
    currentSong = function(){
      return Song.get(this.status.song);
    }
  }
});
