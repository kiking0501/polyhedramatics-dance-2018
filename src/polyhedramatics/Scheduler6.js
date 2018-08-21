var Scheduler6 = function(startTime) {

    var that = this;
    this.START = setdefault(startTime, 200);

    this.program = [
        'initCamera',
        'backgroundClock',
        'initMeteors',
        'shootMeteors',
        'againMeteors',
        'againShootMeteors',
        'cameraWreck',
        'blackOut',
    ]

    this.startSecond = [
        this.START,
        this.START - 0.5,
        this.START,
        this.START,
        this.START + 13.0,
        this.START + 13.0,
        this.START + 26.0,
        this.START + 70,
    ]

    // Following objects in Scheduler5 are still present
    // - Polyhedra (polyNum)
    // - earthMelody/2/3
    // - randomExplore
    // - soundWave

    // camera position: [0, 40, 5000]
    this.initCamera = function(){
        CAMERA.position.set(0, 39.77, 5000);
    }

    this.meteorSettings = {
        'notes': [
            'm', 'r', 'l', 'r', 'f', 'l', 'd', 'r', 'm', 'f', 1
        ],
        'colors': ColorMap['fullblue'],
        'bpm': 15.0/7/4,
        'delayTime': [
            0, 2, 2, 1.75, 1.75, 1.75, .75, 1.75, 1.5, 1.5, .5
        ],
        'startShootingTime': 2,
        'initZ': 5000,
        'finalZ': -4000,
        'bottomY': -1500,
        'upperY': 1500,
        'center_pos': [
            {
                'initX': -5000,
                'num': 5
            },
            {
                'initX': -3800,
                'num': 5
            },
            {
                'initX': -2800,
                'num': 4
            },
            {
                'initX': -2400,
                'num': 4
            },
            {
                'initX': -1000,
                'num': 4
            },
            {
                'initX': -700,
                'num': 3
            },
            {
                'initX': -400,
                'num': 3
            },
            {
                'initX': -300,
                'num': 2
            },
            {
                'initX': -200,
                'num': 2
            },
            {
                'initX': -100,
                'num': 2
            },
            {
                'initX': 0,
                'num': 1
            },
        ]
    }


    this.backgroundClock = function(){
        var center_pos = [0, 0, 2000],
            radius = 600,
            startAngle = Math.PI/2,
            majorColor = 'yellow3';

        var backgroundClock = new MusicClock(
            center_pos, radius, startAngle, majorColor,
            {
                'dimEdgeColor': "black",
                'shineNodeColor': 'lightblue',
                'shineEdgeColor': 'black',
                'dimNodeRadius': radius / 50,
                'nodeColors': ["darkslategray", "darkslategray", "darkslategray", "darkslategray", "darkslategray", "darkslategray",
                                "darkslategray", "darkslategray", "darkslategray", "darkslategray", "darkslategray", "darkslategray",]
            }
        );
        backgroundClock.position.set(center_pos[0], center_pos[1], center_pos[2])

        backgroundClock.name = 'backgroundClock';
        SCENE.add(backgroundClock);


        var bpm = this.meteorSettings['bpm'];
        var delayTime = this.meteorSettings['delayTime'];

        var notes = this.meteorSettings['notes'];

        var sumTime = this.meteorSettings['startShootingTime'];
        for (var i = 0; i < notes.length; i++){

            sumTime += delayTime[i] * bpm;

            var chord = [
                            [notes[i], notes[i]]
                        ];

            TweenLite.delayedCall(
                sumTime,
                backgroundClock.pulse,
                [chord, 3 * (1 + 2 / (i+1)), 1, 0],
                backgroundClock,
            )
        }

        sumTime = this.meteorSettings['startShootingTime'] + 13.0;
        for (var i = 0; i < notes.length; i++){

            sumTime += delayTime[i] * bpm;

            var chord = [
                            [notes[i], notes[i]]
                        ];

            TweenLite.delayedCall(
                sumTime,
                backgroundClock.pulse,
                [chord, 3, 1, 0],
                backgroundClock,
            )
        }

    }

    this.initMeteors = function(){

        var notes = this.meteorSettings['notes'];
        var colors = this.meteorSettings['colors'];
        var bpm = this.meteorSettings['bpm'];

        var sumTime = this.meteorSettings['startShootingTime'];

        for (var i = 0; i < notes.length; i++){
            var initX = this.meteorSettings['center_pos'][i]['initX'];
            var num = this.meteorSettings['center_pos'][i]['num'];
            sumTime += this.meteorSettings['delayTime'][i] * bpm;

            for (var j = 0; j < num; j ++ ) {
                if (num > 0) {
                    var centerX = initX + (-initX - initX) * 1.0 / (num-1) * j;
                } else {
                    var centerX = initX;
                }
                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i;
                var centerZ = this.meteorSettings['initZ'];

                var center_pos = [centerX, centerY*2, centerZ],
                    majorColor = colors[i],
                    length = 300,
                    size = 100;

                var headPoly = new WoodBlock(
                    center_pos,
                    size,
                    null,
                    "black",
                    setdefault(harmonicShapeMap[notes[i]], 'sphere')
                )

                var meteor = new FlyingNote(
                    headPoly,
                    center_pos,
                    majorColor,
                    length
                );

                meteor.name = 'meteor' + i + '_' + j;
                SCENE.add(meteor);


                TweenLite.delayedCall(
                    sumTime,
                    headPoly.changeColor,
                    [.5, colors[i], false],
                    headPoly
                )
            }

        }
    }

    this.shootMeteors = function(){
        var bpm = this.meteorSettings['bpm'];
        var delayTime = this.meteorSettings['delayTime'];

        var sumTime = this.meteorSettings['startShootingTime'];
        var notes = this.meteorSettings['notes'];

        for (var i = 0; i < notes.length; i++){

            sumTime += delayTime[i] * bpm;
            var num = this.meteorSettings['center_pos'][i]['num'];
            var initX = this.meteorSettings['center_pos'][i]['initX'];

            for (var j = 0; j < num; j++) {
                if (num > 0) {
                    var centerX = initX + (-initX - initX) * 1.0 / (num-1) * j;
                } else {
                    var centerX = initX;
                }

                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i;

                var meteor = SCENE.getObjectByName('meteor' + i + '_' + j);

                TweenLite.to(
                    meteor.trailHeadPosition, 20,
                    {
                        x: centerX * 10,
                        y: centerY * 10,
                        // x: that.meteorSettings['center_pos'][i]['finalX'],
                        z: that.meteorSettings['finalZ'] * (1 + 1.5*Math.abs(i-notes.length/2)),
                        onUpdate: function(ind, jnd){
                            var meteor_obj = SCENE.getObjectByName('meteor' + ind + '_' + jnd);
                            var apos = v2pos(meteor_obj.trailHeadPosition.clone());
                            meteor_obj.advance(apos)
                        },
                        onUpdateParams: [i, j],
                        onUpdateScope: this,
                        delay: sumTime,
                    },
                )
            }
        }

    }


    this.againMeteors = function(){

        var delta = 10;

        var notes = this.meteorSettings['notes'];
        var colors = this.meteorSettings['colors'];
        var bpm = this.meteorSettings['bpm'];

        var sumTime = this.meteorSettings['startShootingTime'];

        for (var i = 0; i < notes.length; i++){
            var initX = this.meteorSettings['center_pos'][i]['initX'] + delta;
            var num = this.meteorSettings['center_pos'][i]['num'];
            sumTime += this.meteorSettings['delayTime'][i] * bpm;

            for (var j = 0; j < num; j ++ ) {
                if (num > 0) {
                    var centerX = initX + (-initX - initX) * 1.0 / (num-1) * j;
                } else {
                    var centerX = initX;
                }
                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i - delta;
                var centerZ = this.meteorSettings['initZ'];

                var center_pos = [centerX, centerY*2, centerZ],
                    majorColor = colors[i],
                    length = 300,
                    size = 100;

                var headPoly = new WoodBlock(
                    center_pos,
                    size,
                    null,
                    "black",
                    setdefault(harmonicShapeMap[notes[i]], 'sphere')
                )

                var meteor = new FlyingNote(
                    headPoly,
                    center_pos,
                    majorColor,
                    length
                );

                meteor.name = 'againMeteor' + i + '_' + j;
                SCENE.add(meteor);


                TweenLite.delayedCall(
                    sumTime,
                    headPoly.changeColor,
                    [.5, colors[i], false],
                    headPoly
                )
            }

        }
    }

    this.againShootMeteors = function(){

        var delta = 10;

        var bpm = this.meteorSettings['bpm'];
        var delayTime = this.meteorSettings['delayTime'];

        var sumTime = this.meteorSettings['startShootingTime'];
        var notes = this.meteorSettings['notes'];

        for (var i = 0; i < notes.length; i++){

            sumTime += delayTime[i] * bpm;
            var num = this.meteorSettings['center_pos'][i]['num'];
            var initX = this.meteorSettings['center_pos'][i]['initX'] + delta;

            for (var j = 0; j < num; j++) {
                if (num > 0) {
                    var centerX = initX + (-initX - initX) * 1.0 / (num-1) * j;
                } else {
                    var centerX = initX;
                }

                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i - delta;

                var meteor = SCENE.getObjectByName('againMeteor' + i + '_' + j);

                TweenLite.to(
                    meteor.trailHeadPosition, 20,
                    {
                        x: centerX * 10,
                        y: centerY * 10,
                        // x: that.meteorSettings['center_pos'][i]['finalX'],
                        z: that.meteorSettings['finalZ'] * (1 + 1.5*Math.abs(i-notes.length/2)),
                        onUpdate: function(ind, jnd){
                            var meteor_obj = SCENE.getObjectByName('againMeteor' + ind + '_' + jnd);
                            var apos = v2pos(meteor_obj.trailHeadPosition.clone());
                            meteor_obj.advance(apos)
                        },
                        onUpdateParams: [i, j],
                        onUpdateScope: this,
                        delay: sumTime,
                    },
                )
            }
        }

    }

    this.cameraWreck = function() {
        // from 226 to 270
        TweenLite.to(
            CAMERA.position, 44,
            {
                x: 0,
                y: 0,
                z: 100,
                ease:  RoughEase.ease.config({
                    template:  Power0.easeNone,
                    strength: 1.0,
                    points: 40,
                    taper: "none",
                    randomize:  true,
                    clamp: false
                })
            }
        )

        TweenLite.to(
            CAMERA.rotation, 44,
            {
                z: -Math.PI,
                ease:  RoughEase.ease.config({
                    template:  Power0.easeNone,
                    strength: .5,
                    points: 20,
                    taper: "none",
                    randomize:  true,
                    clamp: false
                })
            }
        )

    }

    this.blackOut = function() {
        // from 270 to 280

        var X = 500, Y = 100;

        var pen = new FlyingNote(
            null,
            [-X, -Y, 90],
            "black",
            100,
            50,
        )

        pen.name = "pen";
        SCENE.add(pen);

        var t = TweenLite.to(
            pen.trailHeadPosition, 10,
            {
                x: X,
                onUpdate: function(){
                    var t = Date.now();
                    var y = Math.sin(t) * Y;
                    pen.trailLine.advance(
                        pos2v([pen.trailHeadPosition.x, y, pen.trailHeadPosition.z])
                    );
                },
                ease: Linear.easeNone,
            }
        )

        // var t = new TimelineLite();
        // t.to(
        //     pen.trailHeadPosition, 3,
        //     {
        //         y: Y,
        //         onUpdate: function(){
        //             var pos = v2pos(pen.trailHeadPosition.clone());
        //             pen.advance(pos);
        //         }
        //     }
        // ).to(
        //     pen.trailHeadPosition, 3,
        //     {
        //         x: 0,
        //         y: -Y,
        //         onUpdate: function(){
        //             var pos = v2pos(pen.trailHeadPosition.clone());
        //             pen.advance(pos);
        //         }
        //     }
        // ).to(
        //     pen.trailHeadPosition, 3,
        //     {
        //         y: Y,
        //         onUpdate: function(){
        //             var pos = v2pos(pen.trailHeadPosition.clone());
        //             pen.advance(pos);
        //         }
        //     }
        // )
    }
}