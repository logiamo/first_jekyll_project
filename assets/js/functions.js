$(window).scroll(function() {
    youtubeVidScroll();
    //startMentoring();
    startArticles();
});

function youtubeVidScroll() {

    var wScroll = $(window).scrollTop();
  
    $('.video-strip').css('background-position','center '+ wScroll +'px');
  }

  
function startArticles(){
    var wScroll = $(window).scrollTop();
  
    if($('section.articles').offset().top - $(window).height()/1.2 < wScroll) {
      $('.article-thumb').each(function(i){
        setTimeout(function(){
          $('.article-thumb').eq(i).addClass('is-visible');
        }, 100 * i);
      });
    }
  }