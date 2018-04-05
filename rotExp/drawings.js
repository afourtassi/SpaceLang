// Helper function for random int
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Helper function for permutation of conditions
function randperm(theArray) {
    for (var index = 0; index < theArray.length; index++) {
        var swappedIndex = index + Math.floor(Math.random() * (theArray.length - index));
        var temp = theArray[index];
        theArray[index] = theArray[swappedIndex];
        theArray[swappedIndex] = temp;
    }
}


// Function to reorder a set of items according to a new index
function reorder(array, re_index){
  var temp = [];

  for (i = 0; i < re_index.length; i++) {
    df_idx = re_index[i]
    temp.push(array[df_idx])
  }
  return temp
}

// Helper function to generate certain sequence from unique items in a list
function groupContent(df, reps_per_unique){

  var uniqueItems = Array.from(new Set(df));
  var new_sequence = [];
  while (new_sequence.length < df.length) {
    for (i = 0; i < uniqueItems.length; i++){
    	var counter = reps_per_unique;
      while(counter > 0){
        new_sequence.push(uniqueItems[i])
        counter = counter-1
      }
      if (new_sequence.length == df.length) break
      }
    }
  return new_sequence
}


// Conditions
var perspectiveArray = new Array(experiment.trialsPerBlock/2).fill(["Your ", "Bob's "]); //because of two conditions we divide by two
perspectiveArray = [].concat.apply([], perspectiveArray);
var perspectiveArrayPerm = perspectiveArray.slice(); // save array and create a new array (copy)
console.log('before: ', perspectiveArrayPerm)
perspectiveArrayPerm = groupContent(perspectiveArrayPerm, 2)
console.log('after: ', perspectiveArrayPerm)

var boxArray = new Array(experiment.trialsPerBlock/2).fill(['right', 'left']);
boxArray = [].concat.apply([], boxArray);
var boxArrayPerm = boxArray.slice();
boxArrayPerm = groupContent(boxArrayPerm, 4)

var dollRotationArray = new Array(experiment.trialsPerBlock/2).fill([0, 180]);
dollRotationArray = [].concat.apply([], dollRotationArray);
var dollRotationArrayPerm = dollRotationArray.slice();
//HK dollRotationArrayPerm =

// Prepare the canvas and define canvas-related variables such as width/height
var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");

var xCenter = myCanvas.width / 2;
var yCenter = myCanvas.height / 2;

var boxWH = myCanvas.width / 15;


// Declare some global variables that will be needed in different functions
var whichElem,
    hit,
    targetBox,

    boxRotation,
    dollRotation,

    boxElem,
    perspectiveElem,
    dollRotationElem,

    maxNegDeviation = 0,
    maxPosDeviation = 0,
    textSize = boxWH / 4.5;


// Normalize the click event by using jQuery for cross-browser compatibility
var event = jQuery.Event("click");


// Prepare the data array
var myData = {
    practiceTrial: [],
    targetBox: [],
    boxName: [],
    boxRotation: [],
    dollRotation: [],
    deltaRotation: [],
    rt: [],
    correct: []
};


// This function will be used to push data (with every click) to the data array
var pushData = function (boxID, rt, correct) {
    var deltaRot = function () {
        return myData.dollRotation.slice(-1)[0] - myData.boxRotation.slice(-1)[0]
    };
    myData.practiceTrial.push(experiment.practiceTrial);
    myData.targetBox.push(targetBox);
    myData.boxName.push(boxID);
    myData.boxRotation.push(boxRotation);
    myData.dollRotation.push(dollRotation);
    myData.deltaRotation.push(deltaRot());
    myData.rt.push(rt);
    myData.correct.push(correct);
};


// This helper function will be used to convert the subject's perspectiveArray to the doll's perspectiveArray
// (important for evaluating subject's responses)
function egoToDoll(egoBoxElem, dollRotationElem) {
    if ((egoBoxElem - dollRotationElem) < 0) {
        return 2 + egoBoxElem - dollRotationElem
    } else {
        return egoBoxElem - dollRotationElem
    }
}


// This function displays the target direction (e.g., "front")
function instructionText() {

    //these translations are needed for the egoToDoll function later
    boxArrayPerm[whichElem] === "right" ? boxElem = 0 : boxElem = 1;

    perspectiveArrayPerm[whichElem] === "Your " ? perspectiveElem = 0 : perspectiveElem = 1;

    // instruction text
    targetBox = perspectiveArrayPerm[whichElem] + boxArrayPerm[whichElem];


    $("#myCanvas")

        .drawText({
            layer: true, draggable: false, name: 'Task',
            fillStyle: '#ffffff',
            strokeStyle: '#ffffff',
            strokeWidth: 0,
            x: xCenter, y: yCenter,
            fontSize: textSize,
            fontFamily: 'Verdana, sans-serif',
            text: targetBox
        })
}


// time out function (will be called in experiment.js)
function tooSlow() {

      $("#myCanvas")
          .removeLayers()
          .clearCanvas()

          // Warning sign
          .drawText({
              layer: true, draggable: false, name: 'textWarning',
              fillStyle: '#ffffff',
              strokeStyle: '#ffffff', strokeWidth: 0,
              x: xCenter, y: yCenter,
              fontSize: myCanvas.width * 0.02, fontFamily: 'Verdana, sans-serif',
              text: 'TOO SLOW!'
          });

      endTime = (new Date()).getTime();

      if (!experiment.practiceTrial){
        // move current trial to the end if not practice trial
        boxArrayPerm = boxArrayPerm.concat(boxArrayPerm[whichElem])
        boxArrayPerm.splice(whichElem, 1)
        perspectiveArrayPerm = perspectiveArrayPerm.concat(perspectiveArrayPerm[whichElem])
        perspectiveArrayPerm.splice(whichElem, 1)
        dollRotationArrayPerm = dollRotationArrayPerm.concat(dollRotationArrayPerm[whichElem])
        dollRotationArrayPerm.splice(whichElem, 1)

      }




      setTimeout(function () {
          $("#myCanvas")
              .removeLayers()
              .clearCanvas();

          setTimeout(function () {
              window.onload = experiment.next()
          }, 1000)
      }, 1000)

  $("#myCanvas")
      .restoreCanvas({
          layer: true
        })


}


// preLoad the doll
var dollPic = new Image();
dollPic.onload = function () {
};
dollPic.src = 'images/doll.png';

var youPic = new Image();
youPic.onload = function () {
};
youPic.src = 'images/doll_you.png';

// The "core canvas module". It draws a doll and clickable rectangles that push data to the data array by using the
// <code>pushData</code> function. After each click, the doll's orientation changes randomly (in 180° intervals). (Additionally, the
// rectangles rotate between maxNegDeviation and maxPosDeviation while keeping their relative configuration.
function generateBoxes(numberOfBoxes) {

    // So far, nobody clicked (important for time constraint trials - used in experiment.js)
    hit = false;

    dollRotation = dollRotationArrayPerm[whichElem]; // Math.floor(Math.random() * 360); for 360° rotation
    dollRotation === 0 ? dollRotationElem = 0 : dollRotationElem = 1;
    if (perspectiveArrayPerm[whichElem] === 'Your '){
    } else {
    }
    boxRotation = dollRotation + 90 + getRandomInt(maxNegDeviation, maxPosDeviation);


    $("#myCanvas")
    // Doll (Bob)
        .rotateCanvas({
            layer: true,
            rotate: dollRotation,
            x: xCenter, y: yCenter - 0.7 * boxWH
        })


        .drawImage({
                layer: true, draggable: false, name: 'doll',
                source: dollPic,
                intangible: false,
                width: boxWH, height: boxWH,
                x: xCenter, y: yCenter - 0.7 * boxWH
            }
        )

        .restoreCanvas({
            layer: true
        })


        // Bob's label
        .drawText({
            layer: true, draggable: false, name: 'dollText',
            fillStyle: '#000',
            strokeStyle: '#000',
            strokeWidth: 0,
            x: xCenter, y: yCenter - boxWH * 0.7,
            fontSize: textSize,
            fontFamily: 'Verdana, sans-serif',
            text: 'Bob'
        })

        // Subject's avatar
        .drawImage({
                layer: true, draggable: false, name: 'subject',
                source: youPic, intangible: false,
                width: boxWH, height: boxWH,
                x: xCenter, y: yCenter + 0.7 * boxWH
            }
        )


        // Subject's label
        .drawText({
            layer: true, draggable: false, name: 'subjectText',
            fillStyle: '#000',
            strokeStyle: '#000',
            strokeWidth: 0,
            x: xCenter, y: yCenter + 0.7 * boxWH,
            fontSize: textSize,
            fontFamily: 'Verdana, sans-serif',
            text: 'You'
        });


    for (var i = 0; i < numberOfBoxes; i++) {

        $("#myCanvas")

            .rotateCanvas({
                layer: true, name: 'rotationName' + i,
                rotate: boxRotation + i * 180,
                x: xCenter, y: yCenter
            })

            .drawText({
                layer: true, draggable: false, name: 'textName_' + i,
                fillStyle: '#ffffff',
                strokeStyle: '#ffffff', strokeWidth: 0,
                visible: experiment.practiceTrial,
                x: xCenter, y: yCenter - boxWH * 3,
                fontSize: textSize, fontFamily: 'Verdana, sans-serif',
                text: perspectiveArray[1] + boxArray[i]
            })

            .drawRect({
                    layer: true, draggable: false, name: boxArray[i],
                    fillStyle: "#bdbec9",
                    x: xCenter, y: yCenter - boxWH * 2,
                    width: boxWH, height: boxWH,
                    click: function (layer) {

                        // clicked!
                        hit = true;


                        if (perspectiveElem === 0 && layer.name === boxArray[egoToDoll(boxElem, dollRotationElem)] ||
                            perspectiveElem === 1 && layer.name === boxArray[boxElem]) {

                            $("#myCanvas")
                                .removeLayers()
                                .clearCanvas();

                            endTime = (new Date()).getTime(),
                                data = {
                                    rt: endTime - startTime
                                };
                            pushData(layer.name, data.rt, 1);
                            console.log(myData);

                            setTimeout(function () {
                                window.onload = experiment.next()
                            }, 1000)

                            // What should happen if subjects click on the wrong box?
                        } else {

                            $("#myCanvas")
                                .removeLayers()
                                .clearCanvas()

                                // Warning sign
                                .drawText({
                                    layer: true, draggable: false, name: 'textWarning',
                                    fillStyle: '#ffffff',
                                    strokeStyle: '#ffffff', strokeWidth: 0,
                                    x: xCenter, y: yCenter,
                                    fontSize: myCanvas.width * 0.02, fontFamily: 'Verdana, sans-serif',
                                    text: 'WRONG BOX!'
                                });

                            endTime = (new Date()).getTime();
                            data = {
                                rt: endTime - startTime
                            };

                            pushData(layer.name, data.rt, 0);
                            console.log(myData);

                            setTimeout(function () {
                                $("#myCanvas")
                                    .removeLayers()
                                    .clearCanvas();

                                setTimeout(function () {
                                    window.onload = experiment.next()
                                }, 1000)
                            }, 1000)

                        }
                    }
                }
            )

            .restoreCanvas({
                layer: true
            })
    }
}
