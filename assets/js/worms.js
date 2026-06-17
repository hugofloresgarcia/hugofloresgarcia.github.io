// turn each .fun-divider into a row of wiggling tilde "worms".
// progressive enhancement: without JS the CSS shows a static ~ row.
(function () {
  var dividers = document.querySelectorAll('.fun-divider');
  if (!dividers.length) return;
  var COUNT = 40;
  for (var d = 0; d < dividers.length; d++) {
    var div = dividers[d];
    div.classList.add('wormy');
    div.textContent = '';
    for (var i = 0; i < COUNT; i++) {
      var s = document.createElement('span');
      s.className = 'worm';
      s.textContent = '~';
      s.style.animationDelay = (i * 0.07).toFixed(2) + 's'; // ripples along the row
      div.appendChild(s);
    }
  }
})();
