// helper function to hide/show slides (uses jQuery)

function showSlide(id) {
    // Hide all slides
    $(".slide").hide();
    // Show just the slide we want to show
    $("#" + id).show();
}


// show instruction slide

showSlide("instructions");


// experiment

var experiment = {

    trial: 1, // just setting the trial and block counter to initial values
    block: 0, // ...
    trialsPerBlock: 16,
    practiceTrial: true,
    maxPracticeTrials: 2,
    maxBlocks: 1,
    //maxTrials: 16,
    maxTrials: 3,
    delay: 1000, //ms
    timer: 1200, //ms
    timeConstraint: true,


    next:
        function () {

            // jump to the "end" function after the last trial
            if (this.trial > this.maxTrials) {
                this.end();
                return
            }

            // End practice trials and switch to main part
            if (this.practiceTrial && this.trial > this.maxPracticeTrials) {
                showSlide("readyScreen");
                this.trial = 1;
                this.practiceTrial = false;
                return
            }

            // Shuffle the 32 conditions initially and after each block
            if (this.practiceTrial || this.trial === 1 && hit === false || whichElem + 1 === this.trialsPerBlock) {

                new_index = Array.from(Array(experiment.trialsPerBlock).keys())

                randperm(new_index)

                dollRotationArrayPerm = reorder(dollRotationArrayPerm, new_index)
                perspectiveArrayPerm = reorder(perspectiveArrayPerm, new_index)
                boxArrayPerm = reorder(boxArrayPerm, new_index)

                console.log("I shuffled", dollRotationArrayPerm, perspectiveArrayPerm, boxArrayPerm);
                console.log(this.block);
                this.practiceTrial ? this.block = 0 : this.block = this.block + 1;

                whichElem = 0;

            } else {
                whichElem = whichElem + 1;
            }


            // Main content
            showSlide("myCanvas");
            instructionText();
            setTimeout(function () {
                generateBoxes(2);
                startTime = (new Date()).getTime();
            }, this.delay); //2000


            this.trial = this.trial + 1;



            // For conditions with time constraint
            if (this.timeConstraint){

              setTimeout(function () {
                if (hit == false){
                  tooSlow();
                  experiment.trial = experiment.trial - 1;
                  whichElem = whichElem - 1;
                }
              }, this.delay + this.timer);
            }
        },

    end:

        function () {
            $("#myCanvas").hide();

            showSlide("finished");
            setTimeout(function () {
                //turk.submit(myData, true)
                turk.submit(myData)
            }, 1500);
        }
};
