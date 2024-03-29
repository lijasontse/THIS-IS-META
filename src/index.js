import * as d3 from 'd3';

let weaponData;

d3.csv("meta_weapon.csv", d => {
  return {
    game: d["Game"],
    name: d["Name"],
    type: d["Type"],
    weaponId: d["Weapon ID"],
    classId: d["Class ID"],
    accuracy: +d["Accuracy"],
    damage: +d["Damage"],
    range: +d["Range"],
    fireRate: +d["Fire Rate"],
    mobility: +d["Mobility"],
    control: +d["Control"]
  };
}).then(data => {
    weaponData = data;
    createBarPlot(weaponData[0], 0);
    appendNavs(0);
    appendLinkTags(0);

    for (let i = 1; i < weaponData.length; i++) {
      createBarPlot(weaponData[i], i);
      appendNavs(i);
      appendLinkTags(i);
    };
  });


const createBarPlot = (weaponData, idx) => {
  let margin = {top: 5, right: 40, bottom: 5, left: 90};
  let width = 700 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;
  let data = Object.values(weaponData).slice(5);
  let numColumns = 6;

  let x_axisLength = width;
  let y_axisLength = height;
  let targetSVG = "slide-svg-" + idx;
  let targetSlideRect = "slide-svg-" + idx + "-rect";

  let xScale = d3
    .scaleLinear()
    .domain([0, numColumns])
    .range([0, width]);

  let yScale = d3
    .scaleLinear()
    .domain([0, 300])
    .range([height, 0]);

  let svg = d3
  .select("#meta-vis")
  .append("svg")
    .attr("class", `${targetSVG} hidden`)
    .attr("viewBox", `0 0 650 700`)
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + ", " + (margin.top + 20) + ")");

  let xAxis = d3
    .axisBottom(xScale)
    .tickSize(0)
    .tickFormat(function (d) {
      return Object.keys(weaponData).slice(5)[d];
    });
    // console.log(Object.keys(weaponData).slice(5))


    svg
      .append("g")
      .attr("class", `${targetSVG}-x-axis x-axis`)
      .attr("transform", "translate(0," + height + ")")
      .transition()
      .duration(1000)
      .call(xAxis);
    
    svg.selectAll("x-axis, text")
      .attr("transform", "translate(10, 40)rotate(-42)")
      .style("text-anchor", "start");

  let yAxis = d3
    .axisLeft(yScale)
    .ticks(5);

    svg
      .append("g")
      .attr("class", `${targetSVG}-y-axis y-axis`)
      .attr("transform", "translate(" + (margin.right - 50) + ",0)")
      // .style('opacity', '0%')
      .call(yAxis);

  svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("class", "y-axis-label")
  .attr("y", -80)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Base stats of the current meta weapons in Call of Duty: Warzone")

  svg
    .append("text")
    .attr("class", "source-text")
    .attr("transform",
    "translate(0, " + (height + margin.top + 70) + ")")
    .style("text-anchor", "left")
    .text("Source: Call of Duty Warzone");

  svg
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", `${targetSlideRect}`)


  .attr("x", function (d, i) {
    return i * (x_axisLength / numColumns) + 12;
  })
  .attr("y", function (d) {
    return yScale(d);
  })
  .attr("width", x_axisLength / numColumns - 45)
  .attr("height", function (d) {
    return height - yScale(d);
  })
  .transition()
  .duration(1500);

  let currentSVG = d3.select(`.slide-svg-${idx}`);
  const stats = ['Accuracy', 'Damage', 'Range', 'FireRate', 'Mobility', 'Control']

  let tooltip = d3
    .select('body')
    .append('div')
    .attr("class", `rect-hover-${idx}`)
    .style("position", "absolute")
    .style("font-size", "12px")
    .style("z-index", "10")
    .style("visibility", 'hidden');

  currentSVG
    .selectAll("rect")
    .on("mouseover", function (d) {
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (d, i) {
      return tooltip
        .style("top", event.pageY - 40 + "px")
        .style("left", event.pageX - 40 + "px")
        .style("background-color", "#687864")
        .style("padding", "3px 9px")
        .style("border-radius", "3px")
        .text(`${i}`);
      })
      .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}

const appendNavs = (idx) => {
  let sideNavs = document.querySelector('.side-navs');
  let refLinks = document.createElement('a');
  let navIconsList = document.createElement('li');

  refLinks.setAttribute('href', `#weapon-${idx}`);
  sideNavs.appendChild(refLinks);
  navIconsList.setAttribute('id', `side-nav-li-${idx}`);
  navIconsList.classList.add('side-nav-li')
  refLinks.appendChild(navIconsList);
}

const appendLinkTags = (idx) => {
  let weaponContainer = document.getElementById(`weapon-${idx}-container`);
  let aLink = document.createElement('a');

  aLink.setAttribute('id', `weapon-${idx}`);
  aLink.classList.add('weapon');
  weaponContainer.appendChild(aLink);
}

const createObserver = containers => {
  let options = {
    root: null,
    threshold: 0.7,
    rootMargin: '0px'
  }
  for (let i = 0; i < containers.length - 1; i++) {
    renderSlide(options, containers[i], i)
  }
}

window.addEventListener('load', (e) => {
  let sections = [];
  for (let i = 0; i < 13; i++) {
    let weaponSection = `#weapon-${i}-container`;
    let weaponSlide = document.querySelector(weaponSection);
    sections.push(weaponSlide);
  }
  createObserver(sections);
},
  false
)

const renderSlide = (options, slide, idx) => {
  const handleSlide = (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        document.querySelector(`.slide-svg-${idx}`).classList.remove('hidden');
  
        if (document.querySelector(`.slide-svg-${idx - 1}`)) {
          document.querySelector(`.slide-svg-${idx - 1}`)
          .classList.add('hidden')
        };
  
        if (document.querySelector(`.slide-svg-${idx + 1}`)) {
          document.querySelector(`.slide-svg-${idx + 1}`)
          .classList.add('hidden')
        };
  
        document.querySelectorAll(`.slide-svg-${idx}-rect`).forEach(rect => {
          rect.classList.add('plot-rect')
        });
  
        d3.select(`.slide-svg-${idx}-y-axis`)
          .transition()
          .style('opacity', `100%`)
          .duration(500)
  
        let navIcon = document.getElementById(`side-nav-li-${idx}`);
        navIcon.classList.add(`side-nav-li-${idx}`);
  
        if (document.querySelectorAll(`.slide-svg-${idx - 1}-rect`)) {
          document.querySelectorAll(`.slide-svg-${idx - 1}-rect`).forEach(rect => {
            rect.classList.remove('plot-rect')
          })
  
          d3.select(`.slide-svg-${idx - 1}-y-axis`)
            .transition()
            .style('opacity', '0%')
            .duration(700)
        };
  
        if (document.getElementById(`side-nav-li-${idx - 1}`)) {
          document
            .getElementById(`side-nav-li-${idx - 1}`)
            .classList.remove(`side-nav-li-${idx - 1}`)
        };
  
        if (document.querySelectorAll(`.slide-svg-${idx + 1}-rect`)) {
          document
            .querySelectorAll(`.slide-svg-${idx + 1}-rect`)
            .forEach(rect => {
              rect.classList.remove('plot-rect')
            })
  
          d3.select(`.slide-svg-${idx + 1}-y-axis`)
            .transition()
            .style('opacity', '0%')
            .duration(700)
          
          document
            .getElementById(`side-nav-li-${idx + 1}`)
            .classList.remove(`side-nav-li-${idx + 1}`)
        }
      }
    })
  }
  let observer = new IntersectionObserver(handleSlide, options);
  observer.observe(slide);
}


var activeDropdown = {};
document.getElementById('attach1-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach2-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach3-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach4-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach5-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach6-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach7-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach8-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach9-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach10-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach11-dropdown').addEventListener('click', showDropdown);
document.getElementById('attach12-dropdown').addEventListener('click', showDropdown);


function showDropdown(event) {
  if (activeDropdown.id && activeDropdown.id !== event.target.id) {
    activeDropdown.element.classList.remove('active');
  }
  //checking if a list element was clicked, changing the inner button value
  // if (event.target.tagName === 'LI') {
  //   activeDropdown.button.innerHTML = event.target.innerHTML;
  //   for (var i = 0; i < event.target.parentNode.children.length; i++) {
  //     if (event.target.parentNode.children[i].classList.contains('check')) {
  //       event.target.parentNode.children[i].classList.remove('check');
  //     }
  //   }
  //   //timeout here so the check is only visible after opening the dropdown again
  //   window.setTimeout(function () {
  //     event.target.classList.add('check');
  //   }, 300)
  // }
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


