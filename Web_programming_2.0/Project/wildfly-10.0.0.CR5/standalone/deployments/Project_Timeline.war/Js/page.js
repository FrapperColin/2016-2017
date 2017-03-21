

function affichage() 
{
  var total = $('.item').length;
  var current = $('.item.active').index() + 1;
  $('.label').text(current + ' / '+ total);
}
      
$(function ()
{
  affichage();
  $('.carousel').carousel({ interval: 7000 });
  $('.carousel').on('slid.bs.carousel', function () 
  {
    affichage();
  });

  $('body').scrollspy({ target: '.navbar' });

  $('li>a').on('click', function(e) 
  {
    e.preventDefault();
    var hash = this.hash;
    $('html, body').animate({
      scrollTop: $(this.hash).offset().top
    }, 1000, function()
    {
      window.location.hash = hash;
    });
  });
});



