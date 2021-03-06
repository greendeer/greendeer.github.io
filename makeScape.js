originalPath = document.getElementById("originalPath"),
roundCornerPath = document.getElementById("roundCornerPath"),
RotatePath = document.getElementById("RotatePath"),
leftPath = document.getElementById("leftPath"),
rightPath = document.getElementById("rightPath"),
eleRadius = document.getElementById("radius"),
eleRadius2 = document.getElementById("radius2"),
eleRotate = document.getElementById("rotate_value"),
eleSkew = document.getElementById("skew_value"),
eleSize = document.getElementById("size"),
eleObjSize = document.getElementById("objSize"),
eleOpacity = document.getElementById("opacity"),
eleHorizon = document.getElementById("horizon"),
eleVertical = document.getElementById("vertical"),
eleIn = document.getElementById("in_value"),
eleApex = document.getElementById("apex_value"),
eleLineType = document.querySelector(".line-type"),
eleRadiusInfo = document.querySelector(".app-settings-info"),
eleRadiusInfo2 = document.querySelector(".app-settings-info--2"),
eleAppSettings = document.querySelector(".app-settings"),
eleButton = document.getElementById("but1");
eleButton2 = document.getElementById("but2");
controlPoints = document.querySelector(".control-points"),
cornerPoints = document.querySelector(".corner-points"),
pathPoints = document.querySelector(".path-points"),
svg = document.querySelector("svg"),
SVGNS = svg.namespaceURI,
POINT_RADIUS = 6,
POINT_FILL = 'none';

const sharedAttributes = {
  stroke: `black`,
  strokeWidth: `1`,
  fill: `none` };

let coordinates = [],
lines = [],
lineType = "C";
noises = [];

var selectedElement = false;

makeRectangle();

eleSize.addEventListener("input", () => makeRectangle());
eleOpacity.addEventListener("input", () => makeRectangle());
eleHorizon.addEventListener("input", () => makeRectangle());
eleVertical.addEventListener("input", () => makeRectangle());
eleIn.addEventListener("input", () => makeRectangle());
eleApex.addEventListener("input", () => makeRectangle());
// eleLineType.addEventListener("click", setLineType);
eleButton.addEventListener("click", addElement);
eleButton2.addEventListener("click", openMakeObj);

// const events = ["touchstart", "touchend", "mouseenter", "mouseleave"];
// events.forEach(evtName => {
//   eleRadius.addEventListener(evtName, toggleShowNots);
//   eleRadius2.addEventListener(evtName, toggleShowNots);
//   svg.addEventListener(evtName, toggleShowPathPoints);
// });

function setLineType() {
  eleAppSettings.classList.remove(`app-settings--${lineType}`);
  eleLineType.
  querySelectorAll("input").
  forEach(e => lineType = e.checked ? e.id : lineType);
  eleAppSettings.classList.add(`app-settings--${lineType}`);
  // addRoundCorners(originalPath);
}

function toggleShowNots() {
  svg.classList.toggle("show-nots");
}
function toggleShowPathPoints() {
  svg.classList.toggle("path-points--show");
}

function init(path) {
  setLineType();
  coordinates = [];
  lines = [];
  // get the points in an array
  let rawCoordinates = path.
  getAttribute("d").
  replace(/[mlz]/gi, "").
  split(" ").
  filter(c => c.trim() != "");

  for (let i = 0; i < rawCoordinates.length; i += 2) {if (window.CP.shouldStopExecution(0)) break;
    const coor = { x: rawCoordinates[i], y: rawCoordinates[i + 1] };
    coordinates.push(coor);
    pathPoints.appendChild(getCircle(coor, { r: POINT_RADIUS }));
  }window.CP.exitedLoop(0);

  const numberOfCoordinates = coordinates.length;
  let largestRadius = 0;
  for (let i = 0; i < numberOfCoordinates; i++) {if (window.CP.shouldStopExecution(1)) break;
    const coorBefore =
    i === 0 ? coordinates[numberOfCoordinates - 1] : coordinates[i - 1];
    const coor = coordinates[i];
    const coorAfter =
    i === numberOfCoordinates - 1 ? coordinates[0] : coordinates[i + 1];

    //  construct temporary line path (beforLine) going from point to point before current point
    const lineBefore = getLine(coor, coorBefore);

    //  construct temporary line path (afterLine) going from point to point after current point
    const lineAfter = getLine(coor, coorAfter);

    // Line between two lines
    let lineBetween = getLine(coorBefore, coorAfter);
    let lineBetweenLength = lineBetween.getTotalLength();
    let middlePoint = lineBetween.getPointAtLength(lineBetweenLength / 2);
    lineBetween = getLine(coor, middlePoint);

    const maxRadius = parseInt(Math.min(lineBefore.getTotalLength(), lineAfter.getTotalLength()) / 2);

   largestRadius = maxRadius > largestRadius ? maxRadius : largestRadius;

    lines.push({ lineBefore, lineAfter, coor, lineBetween, maxRadius });
  }window.CP.exitedLoop(1);
  eleRadius.setAttribute("max", largestRadius);
  eleRadius2.setAttribute("max", largestRadius);
}

function makeOriginalPath(){
    apex = eleApex.value;
    d = "M 300 0 "
    deg = 2*Math.PI/apex;
    inRadius = eleIn.value / 100 * (300*Math.cos(deg/2));
    for(let i=0; i<apex;i++){
        theta = deg*i;
        theta2 = theta + deg/2;
        if (i!=0){
            d = d+ "L "+300*Math.cos(theta)+" "+300*Math.sin(theta)+" ";
        }
        if (eleIn.value != 100){
            d = d+ "L "+inRadius*Math.cos(theta2)+" "+inRadius*Math.sin(theta2)+" ";
        }
    }
    d += "z";
    originalPath.setAttribute("d", d);
    // console.log(originalPath);
    addRoundCorners(originalPath);
    init(originalPath);
}

function makeApex(){
  apex = eleApex.value;
  d = "M 300 0 "
  deg = 2*Math.PI/apex;
  inRadius = eleIn.value / 100 * (300*Math.cos(deg/2));
  for(let i=0; i<apex;i++){
      theta = deg*i;
      theta2 = theta + deg/2;
      if (i!=0){
          d = d+ "L "+300*Math.cos(theta)+" "+300*Math.sin(theta)+" ";
      }
      if (eleIn.value != 100){
          d = d+ "L "+inRadius*Math.cos(theta2)+" "+inRadius*Math.sin(theta2)+" ";
      }
  }
  d += "z";
  return d;
}

function openMakeObj(){
  makeNoise = document.getElementById("makeNoise");
  makeNoise.hidden = false;
}

function addElement() {
  // console.log("event!");
  // create a new div element
  //<svg viewBox="-300 -300 600 600">
  newG = document.createElement("g");
  newLine = document.createElement("g");
  //fill="#000000" opacity="1"

  newPath = document.createElement("path");
  newPath.setAttribute("fill", "#000000");
  newPath.setAttribute("opacity", "1");
  newPath.setAttribute("d", makeApex());
  init(newPath);
  newPath.setAttribute("d", addRoundCorners2(newPath));
  newPath.setAttribute("class","draggable");

  newLine.appendChild(newPath);
  newG.appendChild(newLine);

  let skew = eleSkew.value / 100;
  let scale = eleObjSize.value / 100;
  let rot = eleRotate.value - 90;
  //rotatePath.setAttribute("transform", "rotate(" + rot+ " 0 0) scale("+skew+",1) translate("+trans+")" );
  newLine.setAttribute("transform", "rotate(" + rot + " 0 0) scale("+skew*scale+","+scale+")" );
  // console.log(newLine);

  noises.push(newG);

  // add the newly created element and its content into the DOM
  var currentDiv = document.getElementById("endPath");
  currentDiv.parentNode.insertBefore(newG, currentDiv);
  currentDiv.parentNode.innerHTML += "";

  makeNoise = document.getElementById("makeNoise");
  makeNoise.hidden = true;
}

function makeRectangle(){
    size = eleSize.value*6;
    min_transform = 300 - size/2;
    horizon = (eleHorizon.value - 50)/50*min_transform;
    vertical = (eleVertical.value - 50)/50*min_transform;
    coordinates[0] = [horizon+-1*size/2, vertical+-1*size/2];
    coordinates[1] = [horizon+size/2,vertical+-1*size/2];
    coordinates[2] = [horizon+size/2,vertical+size/2];
    coordinates[3] = [horizon+-size/2,vertical+size/2];
    d = "M -300 -300 ";
    d += "L "+coordinates[0][0]+" "+coordinates[0][1]+" ";
    d += "L "+coordinates[1][0]+" "+coordinates[1][1]+" ";
    d += "L 300 -300 L 300 300 ";
    d += "L "+coordinates[2][0]+" "+coordinates[2][1]+" ";
    d += "L "+coordinates[3][0]+" "+coordinates[3][1]+" ";
    d += "L -300 300 ";
    // for(let i = 1;i<4;i++){
    //   d += "L "+coordinates[i][0]+" "+coordinates[i][1]+" ";
    // }
    d += "z";
    originalPath = document.getElementById("originalPath");
    originalPath.setAttribute("d", d);
    changeOpacity();
    originalPath.parentNode.innerHTML += "";
}

function makeLeftPath(){
  d = "M -300 -300 ";
  d += "L "+coordinates[0][0]+" "+coordinates[0][1]+" ";
  d += "L "+coordinates[3][0]+" "+coordinates[3][1]+" ";
  d += "L -300 300 ";
  d += "z";
  leftPath.setAttribute("d", d);
}

function makeRightPath(){
  d = "M 300 -300 ";
  d += "L "+coordinates[1][0]+" "+coordinates[1][1]+" ";
  d += "L "+coordinates[2][0]+" "+coordinates[2][1]+" ";
  d += "L 300 300 ";
  d += "z";
  rightPath.setAttribute("d", d);
}

function addRoundCorners2(path) {
  // find radius
  radius = eleRadius.value;
  radius2 = eleRadius2.value;
  eleRadiusInfo.setAttribute("radius", radius);
  eleRadiusInfo2.setAttribute("radius", radius2);

  // for each point
  const numberOfCoordinates = coordinates.length;
  let d = "";
  cornerPoints.innerHTML = "";
  for (let i = 0; i < numberOfCoordinates; i++) {if (window.CP.shouldStopExecution(2)) break;
    let { lineBefore, lineAfter, coor, lineBetween, maxRadius } = lines[i];
    const minorRadius = Math.min(radius, maxRadius);
    //const minorRadius2 = Math.min(radius2, maxRadius);
    const minorRadius2 = Math.min(radius/2, maxRadius);
    const beforePoint = lineBefore.getPointAtLength(minorRadius);
    const afterPoint = lineAfter.getPointAtLength(minorRadius);
    const beforePoint2 = lineBefore.getPointAtLength(minorRadius2);
    const afterPoint2 = lineAfter.getPointAtLength(minorRadius2);

    coor = lineBetween.getPointAtLength(minorRadius2);

    // generate data to new rounded path
    switch (lineType) {
      case "Q":
        d += `${i === 0 ? "M" : "L"} ${getCoordinates(
        beforePoint)
        } ${lineType} ${getCoordinates(coor)} ${getCoordinates(afterPoint)} `;
        cornerPoints.appendChild(getCircle(coor, { r: POINT_RADIUS }));
        break;
      case "C":
        d += `${i === 0 ? "M" : "L"} ${getCoordinates(
        beforePoint)
        } ${lineType} ${getCoordinates(beforePoint2)} ${getCoordinates(
        afterPoint2)
        } ${getCoordinates(afterPoint)} `;
        cornerPoints.appendChild(
        getCircle(beforePoint2, { r: POINT_RADIUS, fill: POINT_FILL }));

        cornerPoints.appendChild(
        getCircle(afterPoint2, { r: POINT_RADIUS, fill: POINT_FILL }));

        break;}


    cornerPoints.appendChild(getCircle(beforePoint, { r: POINT_RADIUS, fill: POINT_FILL }));
    cornerPoints.appendChild(getCircle(afterPoint, { r: POINT_RADIUS, fill: POINT_FILL }));
  }window.CP.exitedLoop(2);
  d += "Z";
  return d;
  roundCornerPath.setAttribute("d", d);
  
}

function addRoundCorners(path) {
  // find radius
  radius = eleRadius.value;
  radius2 = eleRadius2.value;
  eleRadiusInfo.setAttribute("radius", radius);
  eleRadiusInfo2.setAttribute("radius", radius2);

  // for each point
  const numberOfCoordinates = coordinates.length;
  let d = "";
  cornerPoints.innerHTML = "";
  for (let i = 0; i < numberOfCoordinates; i++) {if (window.CP.shouldStopExecution(2)) break;
    let { lineBefore, lineAfter, coor, lineBetween, maxRadius } = lines[i];
    const minorRadius = Math.min(radius, maxRadius);
    //const minorRadius2 = Math.min(radius2, maxRadius);
    const minorRadius2 = Math.min(radius/2, maxRadius);
    const beforePoint = lineBefore.getPointAtLength(minorRadius);
    const afterPoint = lineAfter.getPointAtLength(minorRadius);
    const beforePoint2 = lineBefore.getPointAtLength(minorRadius2);
    const afterPoint2 = lineAfter.getPointAtLength(minorRadius2);

    coor = lineBetween.getPointAtLength(minorRadius2);

    // generate data to new rounded path
    switch (lineType) {
      case "Q":
        d += `${i === 0 ? "M" : "L"} ${getCoordinates(
        beforePoint)
        } ${lineType} ${getCoordinates(coor)} ${getCoordinates(afterPoint)} `;
        cornerPoints.appendChild(getCircle(coor, { r: POINT_RADIUS }));
        break;
      case "C":
        d += `${i === 0 ? "M" : "L"} ${getCoordinates(
        beforePoint)
        } ${lineType} ${getCoordinates(beforePoint2)} ${getCoordinates(
        afterPoint2)
        } ${getCoordinates(afterPoint)} `;
        cornerPoints.appendChild(
        getCircle(beforePoint2, { r: POINT_RADIUS, fill: POINT_FILL }));

        cornerPoints.appendChild(
        getCircle(afterPoint2, { r: POINT_RADIUS, fill: POINT_FILL }));

        break;}


    cornerPoints.appendChild(getCircle(beforePoint, { r: POINT_RADIUS, fill: POINT_FILL }));
    cornerPoints.appendChild(getCircle(afterPoint, { r: POINT_RADIUS, fill: POINT_FILL }));
  }window.CP.exitedLoop(2);
  d += "Z";
  roundCornerPath.setAttribute("d", d);
  let skew = eleSkew.value / 100;
  let trans = 400*(1-skew);
 let rot = eleRotate.value - 90;
  //rotatePath.setAttribute("transform", "rotate(" + rot+ " 0 0) scale("+skew+",1) translate("+trans+")" );
rotatePath.setAttribute("transform", "rotate(" + rot + " 0 0) scale("+skew+",1)" );
//   console.log(rotatePath);
}

function changeOpacity(){
  opa = eleOpacity.value/100;
  originalPath.setAttribute("opacity",opa);
  // console.log(originalPath);
}

function getCoordinates(point) {
  return `${Math.round(point.x)} ${Math.round(point.y)}`;
}

function getLine(coor1, coor2) {
  const line = getElement("path");
  line.setAttribute("d", `M ${coor1.x} ${coor1.y} L  ${coor2.x} ${coor2.y}`);
  return line;
}

function getCircle(coor, attrs) {
  const circle = getElement("circle", { cx: coor.x, cy: coor.y, ...attrs });
  return circle;
}
function getElement(tagName, attrs) {
  const ele = document.createElementNS(SVGNS, tagName);
  const allAttributes = { ...sharedAttributes, ...attrs };
  Object.keys(allAttributes).forEach(att => {
    ele.setAttribute(att, allAttributes[att]);
  });
  return ele;
}

function makeDraggable(evt) {
  var svg = evt.target;
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  svg.addEventListener('touchstart', startDrag);
  svg.addEventListener('touchmove', drag);
  svg.addEventListener('touchend', endDrag);
  svg.addEventListener('touchleave', endDrag);
  svg.addEventListener('touchcancel', endDrag);
  var selectedElement, offset;
  function startDrag(evt) {
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      offset = getMousePosition(evt);
      offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
      offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
    }
  }
  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(evt);
      selectedG = selectedElement.parentNode.parentNode;
      
      // t_size = selectedG.getAttribute("transform");
      // t_size = t_size.split(" ")[3].split(",")[1].slice(0,-1);

      // t = selectedG.getAttribute("transform");
      // n = t.indexOf(" translate");
      // if (n!=-1){
      //   t = t.substring(0,n);
      // }
      t = " translate("+coord.x+","+coord.y+")";
      selectedG.setAttribute("transform", t);
      // console.log(selectedG);
    }
  }
  function endDrag(evt) {
    selectedElement = null;
  }
}

function getMousePosition(evt) {
  var CTM = svg.getScreenCTM();
  if (evt.touches) { evt = evt.touches[0]; }
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}