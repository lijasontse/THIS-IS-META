// import * as d3 from 'd3';

// d3.csv("base_weapon_stats.csv", d => {
//   console.log(d)
// });

// d3.csv("attachment_stats - Sheet1.csv", d => {
//   console.log(d)
// });





const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.75,
}

const observer = new IntersectionObserver(callback, options);

