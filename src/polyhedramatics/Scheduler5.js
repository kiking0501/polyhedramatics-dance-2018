var Scheduler5 = function(startTime) {
    var that = this;

    this.START = setdefault(startTime, 159);

    this.program = [
        'randomExplore',
    ]

    this.startSecond = [
        this.START,
    ]

    this.randomExplore = function(){
        SCENE.background = new THREE.Color("oldlace");
        CAMERA.position.set(0, 0, 200);
        CAMERA.lookAt(pos2v([0, 0, 0]));

        var center_pos = [0, 0, 0],
            majorColor = 'dodgerblue',
            length = 500,
            size = 10,
            shapeType = null,
            wireWidth = 1,
            trailWidth = 3,
            trailBlending = THREE.MultiplyBlending;

        var exploreNote = new FlyingNote(
            center_pos,
            majorColor,
            length,
            size,
            shapeType,
            wireWidth,
            trailWidth,
            trailBlending
        )

        exploreNote.name = "exploreNote";
        SCENE.add(exploreNote);

        var t = new TimelineLite({paused: true});
        for (var i = 0; i < 10000; i++){
            t = t.call(
                exploreNote._move,
                [
                    [Math.random()*50-25, Math.random()*50-25, Math.random()*50-25],
                    [0.01*Math.random(), 0.01*Math.random(), 0.01*Math.random()]
                ],
                exploreNote,
                "+=0.02"
            )
        }
        t.play();
    }

}