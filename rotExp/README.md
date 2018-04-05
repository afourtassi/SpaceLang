In this experiment, a figure (doll) is presented in the middle of the canvas. Two boxes surround the doll.
At each trial, subjects are asked to click on one of the boxes either from the perspective of a subject's avatar or
from the doll's perspective. The orientation of the doll switches randomly between 0° and 180°. With <code>dollRotationArray</code> could change the rotation sequences, for example, to 90° intervals.
While the configuration of the boxes remain the same, their orientation can vary  randomly between
<code>maxNegDeviation</code> and <code>maxPosDeviation</code>. (all three parameters can be found in drawings.js)

A time constraint can be activated in experiment.js by setting <code>timeConstraint</code> to <i>true</i>. We can further set the <code>delay</code> and time limit with <code>timer</code>


#### libraries
jCanvas, jQuery,

mmturkey (github.com/longouyang), a library for sending data to Amazon's Mechanical Turk.

#### experiment.js
The experiment consists of three slides which are named as follows:
<ul>
<li>instructions</li>
<li>myCanvas</li>
<li>finished</li>
</ul>

We use jQuery to hide all the slides and only present the relevant slide
when needed (same logic that was used in the even-odd experiment @github.com/longouyang).

When the finish slide is presented, we use <code>turk.submit(myData, true)</code> to store the experimental data.
The following paragraph will describe the <code>myData</code>-array.

#### drawings.js
Here we find the relevant code to the <code>myCanvas</code> slide.

Subjects can only click on boxes. Clicking on the wrong box leads to an error and a warning is displayed.

All relevant information will be saved in an object called <code>myData</code>.
We store the following information in this object:

<code>targetBox</code> <br>
The correct label of a box (e.g. "front")

<code>boxName</code> <br>
The label of the box that a person has clicked on from the doll's perspective

<code>boxRotation</code> <br>
Rotation angle (origin = doll's center) of boxes

<code>dollRotation</code> <br>
Rotation angle of the doll in degrees

<code>deltaRotation</code> <br>
Difference between the sagital axis of the doll and the rotation of boxes.

<code>rt</code> <br>
Subjects' response times in ms

<code>correct </code> <br>
0 for wrong responses / 1 for correct responses
