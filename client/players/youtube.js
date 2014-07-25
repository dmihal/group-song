var YouTube = function(id){
  this.player = null;
  this.id = id;

  this.render();
};
YouTube.prototype.render = function(){
  this.player = new YT.Player('playerTarget', {
    height: '120',
    width: '160',
    videoId: this.id,
    playerVars: { controls: 0, disablekb: 1, modestbranding: 1, showinfo:0 }/*,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }*/
  });
};
YouTube.prototype.setPlayback = function(playing){
  var that = this;
  var action = function(){
    playing ? that.player.playVideo() : that.player.pauseVideo();
  };
  if (this.player.playVideo){
    action();
  } else {
    this.player.addEventListener('onReady',action);
  }
}

if (typeof players === "undefined"){
  players = {};
}
players['youtube'] = YouTube;
