import * as d3 from 'd3';

d3.csv("base_weapon_stats.csv", d => {
  console.log(d)
});

d3.csv("attachment_stats - Sheet1.csv", d => {
  console.log(d)
});

var activeDropdown = {};
document.getElementById('muzzle-dropdown').addEventListener('click', showDropdown);
document.getElementById('barrel-dropdown').addEventListener('click', showDropdown);
document.getElementById('laser-dropdown').addEventListener('click', showDropdown);
document.getElementById('optic-dropdown').addEventListener('click', showDropdown);
document.getElementById('stock-dropdown').addEventListener('click', showDropdown);
document.getElementById('underbarrel-dropdown').addEventListener('click', showDropdown);
document.getElementById('ammo-dropdown').addEventListener('click', showDropdown);
document.getElementById('reargrip-dropdown').addEventListener('click', showDropdown);


function showDropdown(event) {
  if (activeDropdown.id && activeDropdown.id !== event.target.id) {
    activeDropdown.element.classList.remove('active');
  }
  //checking if a list element was clicked, changing the inner button value
  if (event.target.tagName === 'LI') {
    activeDropdown.button.innerHTML = event.target.innerHTML;
    for (var i = 0; i < event.target.parentNode.children.length; i++) {
      if (event.target.parentNode.children[i].classList.contains('check')) {
        event.target.parentNode.children[i].classList.remove('check');
      }
    }
    //timeout here so the check is only visible after opening the dropdown again
    window.setTimeout(function () {
      event.target.classList.add('check');
    }, 500)
  }
  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].classList.contains('dropdown-selection')) {
      activeDropdown.id = this.id;
      activeDropdown.element = this.children[i];
      this.children[i].classList.add('active');
    }
    //adding the dropdown-button to our object
    else if (this.children[i].classList.contains('dropdown-button')) {
      activeDropdown.button = this.children[i];
    }
  }
}

window.onclick = function (event) {
  if (!event.target.classList.contains('dropdown-button')) {
    activeDropdown.element.classList.remove('active');
  }
}

// const options = {
//   root: null,
//   rootMargin: '0px',
//   threshold: 0.75,
// }

// const observer = new IntersectionObserver(callback, options);

