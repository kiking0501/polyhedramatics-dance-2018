/* [200-281sec] Shooting Meteors, just before the wasteland
*/

var Scheduler6 = function(startTime) {

    var that = this;
    this.START = setdefault(startTime, 200);

    this.program = [
        'initCamera',
        // 'backgroundClock',
        'initMeteors',
        'shootMeteors',
        'againMeteors',
        'againShootMeteors',
        'hideSoundWave',
        // 'formClusterWaves',
        'cameraWreck',
        'blackOut',
        'cleanEverything',
    ]

    this.startSecond = [
        this.START, //initCamera
        // this.START - 0.5, //backgroundClock
        this.START, //meteors
        this.START, //shoot
        this.START + 13.0, //meteors again
        this.START + 13.0, //shoot again
        this.START + 26.0, // hide SoundWave
        // this.START + 26.0, // formClusterWaves
        this.START + 26.0, //camera wreck 44 + 10sec
        this.START + 70, // blackout for 11 sec
        this.START + 75,
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
        ],  //useless since it's harmonic series

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

    //Unused
    //Harmonic Series, do not use music Clock to present!!
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
                [chord, 3 * (1 + 2 / (i+1)), 1, 0, 3],
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
                [chord, 3, 1, 0, 3],
                backgroundClock,
            )
        }

    }

    this._initMeteors = function(name, delta, startShootingTime){

        var notes = this.meteorSettings['notes'];
        var colors = this.meteorSettings['colors'];
        var bpm = this.meteorSettings['bpm'];

        var sumTime = startShootingTime;

        for (var i = 0; i < notes.length; i++){
            var initX = this.meteorSettings['center_pos'][i]['initX'] + delta[0];
            var num = this.meteorSettings['center_pos'][i]['num'];
            sumTime += this.meteorSettings['delayTime'][i] * bpm;

            for (var j = 0; j < num; j ++ ) {
                if (num > 0) {
                    var centerX = initX + (-initX - initX) * 1.0 / (num-1) * j;
                } else {
                    var centerX = initX;
                }
                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i + delta[1];
                var centerZ = this.meteorSettings['initZ'] + delta[2];

                var center_pos = [centerX, centerY*2, centerZ],
                    majorColor = colors[i],
                    length = 300,
                    size = 100;

                var headPoly = new WoodBlock(
                    center_pos,
                    size,
                    null,
                    "black",
                    setdefault(harmonicShapeMap[i], 'sphere')
                )

                var meteor = new FlyingNote(
                    headPoly,
                    center_pos,
                    majorColor,
                    length
                );

                meteor.name = name + i + '_' + j;
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

    this._shootMeteors = function(name, delta, startShootingTime){
        var bpm = this.meteorSettings['bpm'];
        var delayTime = this.meteorSettings['delayTime'];

        var sumTime = startShootingTime;
        var notes = this.meteorSettings['notes'];

        for (var i = 0; i < notes.length; i++){

            sumTime += delayTime[i] * bpm;
            var num = this.meteorSettings['center_pos'][i]['num'];
            var initX = this.meteorSettings['center_pos'][i]['initX'] + delta[0];

            for (var j = 0; j < num; j++) {
                if (num > 0) {
                    var centerX = initX + (-initX - initX) * 1.0 / (num-1) * j;
                } else {
                    var centerX = initX;
                }

                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i + delta[1];

                var meteor = SCENE.getObjectByName(name + i + '_' + j);

                TweenLite.to(
                    meteor.trailHeadPosition, 20,
                    {
                        x: centerX * 10,
                        y: centerY * 10,
                        // x: that.meteorSettings['center_pos'][i]['finalX'],
                        z: that.meteorSettings['finalZ'] * (1 + 1.5*Math.abs(i-notes.length/2)),
                        onUpdate: function(ind, jnd){
                            var meteor_obj = SCENE.getObjectByName(name + ind + '_' + jnd);
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

    this.initMeteors = function(){
        this._initMeteors('meteor', [0, 0, 0], this.meteorSettings['startShootingTime']);
    }
    this.shootMeteors = function(){
        this._shootMeteors('meteor', [0, 0, 0], this.meteorSettings['startShootingTime']);
    }

    this.againMeteors = function(){
        this._initMeteors('againMeteor', [10, -10, 0], this.meteorSettings['startShootingTime']);
    }

    this.againShootMeteors = function(){
        this._shootMeteors('againMeteor', [10, -10, 0], this.meteorSettings['startShootingTime']);

    }

    this.hideSoundWave = function(){
        // from 226
        var soundWave = SCENE.getObjectByName("highPitchSoundWave");

        var t = new TimelineLite();
        t.call(
            soundWave.changeParticleColor,
            [10, 'black', false],
            soundWave,
        ).call(
            function(obj) {
                SCENE.remove(obj);
                disposeHierarchy(obj);
            }
            [soundWave],
            this
        )

    }

    //Unused
    // cause an overload to web render :(
    this.formClusterWaves = function(){
        // from 226

        // musicClock vertices settings
        var r = 600,
            center_pos = [0, 0, 2000],
            startAngle = Math.PI/2;

        var vertices = calPolygonVertices(
            12, r*5, startAngle, false
        );
        for (var i = 0; i < vertices.length; i++) {
            vertices[i] = [
                center_pos[0] + vertices[i][0],
                center_pos[1] + vertices[i][1],
                center_pos[2]
            ];
        }
        var chords = [['l'],
                      ['r', 's'],
                      ['s', 'd'],
                      ['f'],
                      ['f', 'l'],
                      ['d', 'r'],
                     ];

        var noteMap = {
            'd': 0,
            'r': 2,
            'm': 4,
            'f': 5,
            's': 7,
            'l': 9,
            't': 11,
        };

        // soundWave settings
        var xNum = 5,
            yNum = 5,
            zNum = 3,
            majorColor = 'pink',
            size = 20,
            dist = 100;



        for (var i = 0; i < chords.length; i++) {

            for (var j = 0; j < chords[i].length; j++) {

                var center_pos = vertices[noteMap[chords[i][j]]];
                var color = ColorMap[majorColor][Math.round(i/2) % ColorMap[majorColor].length];

                var clusterWave = new SoundWave(
                    center_pos, xNum, yNum, zNum, color, size, dist
                );
                clusterWave.name = 'clusterWave' + i + '_' + j;
                SCENE.add(clusterWave);
                console.log(i, j, center_pos)
                // clusterWave.setGeometricMovement(1, 0, 50, 1);
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
                    points: 45,
                    taper: "none",
                    randomize:  true,
                    clamp: false
                })
            }
        )

        var t = new TimelineLite();
        t.to(
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
        // to 280
        ).to(
            CAMERA.rotation, 10,
            {
                z: Math.PI/4 + Math.PI,
            }
        )

    }

    this.blackOut = function() {
        // from 270 to 281

        var colors = ["darkslategray", "olivedrab", 0xefd1b5];
        var times = [3.0, 6.0, 2.0];


        SCENE.colorDegree = new THREE.Color("black");

        var t = new TimelineLite();
        for (var i = 0; i < colors.length; i++) {
            var color3 = new THREE.Color(colors[i]);

            t = t.to(
                SCENE.colorDegree, times[i],
                {
                    r: color3.r,
                    g: color3.g,
                    b: color3.b,
                    onUpdate: function(){
                        SCENE.background = new THREE.Color(SCENE.colorDegree);
                    }
                }
            )
        }

    }

    this.cleanEverything = function(){
        // Scheduler5 stuff
        var names = ["earthMelody", "earthMelody2", "earthMelody3"];

        var polyNum = 20;
        for (var i = 0; i < polyNum; i++){
            names.push("polyhedron" + i);
        }

        // Scheduler6 stuff
        // names.push("backgroundClock");

        for (var i = 0; i < this.meteorSettings['notes'].length; i++){
            for (var j = 0; j < this.meteorSettings['center_pos'][i]['num']; j++){
                names.push("meteor" + i + '_' + j);
                names.push("againMeteor" + i + '_' + j);
            }
        }

        for (var i = 0; i < names.length; i++){
            obj = SCENE.getObjectByName(names[i]);
            SCENE.remove(obj);
            disposeHierarchy(obj, function(){});
        }

        //special treatment to randomExplore
        var lines = 50;
        for (var i = 0; i < lines; i++){
            var line = SCENE.getObjectByName("exploreNote" + i);
            TweenLite.to(
                line.scale, 5,
                {
                    x: 0.001,
                    y: 0.001,
                    z: 0.001,
                    onComplete: function(ind){
                        var l = SCENE.getObjectByName("exploreNote" + ind);
                        SCENE.remove(l);
                        disposeHierarchy(l);
                    },
                    onCompleteParams: [i],
                }
            )
        }
    }
}