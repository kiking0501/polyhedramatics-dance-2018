var Scheduler5 = function(startTime) {
// A Whole New World begins here. :)

    var that = this;

    this.START = setdefault(startTime, 160);

    this.program = [
        'initCameraPosition',
        'initMusicClock',
        'soloMusicClock',
        'startJumpyNote',
        'moveMusicClock',
        'moveCamera',
        'createSpiral',
        'createPolyhedra',
        'expandShadows',
        'earthMelody',
        'disposeInitial',
        'earthMelody2',
        'earthMelody3',
        'randomExplore',
        'showSoundWave',
    ]

    this.startSecond = [
        this.START-0.5-0.2, //initCamera, use 3 sec to go to Ori Position
        this.START-0.5-0.2, //initMusicClock
        this.START-0.5-0.2, //soloMusicClock
        this.START-0.5-0.1, //startJumpyNote
        this.START-0.5-0.1, //moveMusicClock
        this.START-0.5-0.1 + 3, //moveCamera
        this.START-0.5-0.1, //createSpiral
        this.START + 4, // createPolyhedra
        this.START + 12, // expandShadow
        this.START + 8, // earthMelody
        this.START + 15-0.3, // disposeInitial
        this.START + 15-0.3, // earthMelody2
        this.START + 20, // earthMelody3
        this.START + 15-0.5, //randomExplore //21
        this.START + 25-0.5, //show sound wave
    ]

    this.musicClockR = 10;
    this.oriCameraPosition = [0, -this.musicClockR*.4 + 10, this.musicClockR * 1.4];
    this.finalY = 100;

    this.initCameraPosition = function(){
        SCENE.background = new THREE.Color("oldlace");

        CAMERA.position.set(
            this.oriCameraPosition[0],
            this.oriCameraPosition[1],
            this.oriCameraPosition[2]
        );

        CAMERA.rotation.set(0, 0, 0);

        TweenLite.from(

            CAMERA.position, 3,
            {
                delay: 2.5,
                y: 25,
                z: 0,
                ease: Power0.easeIn,
            }
        )

        TweenLite.from(

            CAMERA.rotation, 3,
            {
                delay: 1,
                x: -Math.PI/2,
                ease: Power2.easeIn,
            }
        )

    }

    this.initMusicClock = function(){

        var center_pos = [0, 0, 0],
            radius = this.musicClockR,
            startAngle = Math.PI/2,
            majorColor = 'lightblue';

        var musicClock = new MusicClock(
            center_pos, radius, startAngle, majorColor,
            {
                'dimEdgeColor': ColorMap['grey'][2],
                'shineNodeColor': 'greenyellow',
                'shineEdgeColor': 'greenyellow',
                'dimNodeRadius': this.musicClockR / 12,
            }
        );
        musicClock.position.set(center_pos[0], center_pos[1], center_pos[2])

        musicClock.rotation.x = -Math.PI/2;
        musicClock.name = 'musicClock';
        SCENE.add(musicClock);

    }


    this.soloConfigs = {

        melody: [
            'l', 's',
            'l', 's', 'm', 's', 'r', 'r', 'm',
            'r', 'm', 'r', 'l', 'd', 'l', 'd',
            's', 'l', 's', 'm', 's', 'r', 'm', 's', 's',
            'm', 's', 'l', 's'
        ],

        ratio: [
            1, 1,
            .5, .5, .5, .5, 1, .5, .5,
            .5, .5, .5, .5, 1, .5, .5,
            1, .25, .25, .25, .25, .5, .5, .75, .25,
            .5, .5, 2, 1 + 4
        ]

    }
    this.soloMusicClock = function(){
        var musicClock = SCENE.getObjectByName('musicClock');

        var melody = this.soloConfigs['melody'];
        var ratio = this.soloConfigs['ratio'];

        var timeLapse = .5,
            repeat = 1,
            betweenDelay = 0.0,
            dt = 0,
            prev_tL = 0;

        var t = new TimelineLite({paused: true});

        for (var i = 0; i < melody.length; i++){
            var chords = [
                            [melody[i], i > 0? melody[i-1]: melody[i]]
                         ];

            var tL = timeLapse * ratio[i]  - 0.0005*i;
            t = t.call(
                musicClock.pulse,
                [chords, tL, repeat, betweenDelay],
                musicClock,
                "+=" + (prev_tL + betweenDelay)
            );
            prev_tL = tL;

            t.play();
        }

    }


    this.startJumpyNote = function(){

        var musicClock = SCENE.getObjectByName('musicClock');

        var melody = this.soloConfigs['melody'];
        var ratio = this.soloConfigs['ratio'];

        var that = this;


        function getNotePos(note){
            var noteInd = musicClock.noteMap[note];
            var oriPos = musicClock.nodes[noteInd].position;

            return [
                oriPos.x,
                oriPos.z,
                - oriPos.y, //since music clock has Math.PI/2 rotation
            ];

        }

        var center_pos = getNotePos('d'),
            majorColor = 'dodgerblue',
            majorTrailColor = 'grey',
            length = 1000,
            trailWidth = .02,
            trailBlending = THREE.MultiplyBlending;

        var offsetY = 5;

        var size = 1.5,
            tri = 2,
            shapeType = "dodecahedron",
            wireWidth = 1.3;

        var headPoly = new WoodBlock(
                center_pos,
                size,
                tri,
                majorColor,
                shapeType,
                wireWidth
        );
        // headPoly.polyPulseDuration(1, .001, 5, 15)
        headPoly.polyRotateDuration([0.1, 0.001, 0.001],
                                   30);

        var jumpyNote = new FlyingNote(
            headPoly,
            center_pos,
            majorTrailColor,
            length,
            trailWidth,
            trailBlending
        )

        jumpyNote.name = "jumpyNote";
        SCENE.add(jumpyNote);

        TweenLite.to(
            jumpyNote.trailHeadPosition, 24,
            {
                y: this.finalY + offsetY,
                ease: Linear.easeNone,
                onUpdate: function(){
                    // console.log(jumpyNote.trailHeadPosition.y,
                    //             musicClock.position.y);
                }
            }
        )

        var timeLapse = .5,
            repeat = 1,
            betweenDelay = 0.0,
            dt = 0,
            prev_tL = 0;

        var t = new TimelineLite();

        this.currNote = null;

        for (var i = 0; i < melody.length; i++){

            var tL = timeLapse * ratio[i] - 0.0005*i;
            var newPos = getNotePos(that.soloConfigs['melody'][i]);
            var shape = harmonicShapeMap[that.soloConfigs['melody'][i]];
            var j = {'ind': i};

            if (i == 0) {
                t = t.call(
                    jumpyNote.advance,
                    [[newPos[0], newPos[1] + offsetY, newPos[2]]],
                    jumpyNote,
                    tL
                )
            } else {
                t = t.to(
                    jumpyNote.trailHeadPosition, tL,
                    {
                        x: newPos[0],
                        z: newPos[2],
                        onUpdate: function(){
                            var jPos = v2pos(jumpyNote.trailHeadPosition.clone());
                            jumpyNote.advance(jPos);

                        },
                        delay: betweenDelay,
                        onComplete: function(){
                        }
                    }
                )
            }
            t = t.call(
                function(currShape, ind){

                    var shadow = new WoodBlock(
                        v2pos(jumpyNote.trailHeadPosition),
                        size, tri, ColorMap['fullblue'][Math.round(Math.random()*9+4.5)],
                        currShape, wireWidth
                    )
                    shadow.name = "shadow" + ind;
                    SCENE.add(shadow);
                    shadow.polyRotateDuration([Math.random()*0.2, Math.random()*0.02, Math.random()*0.02],
                           34);                },
                [shape, i],
                this
            )

        }


    }

    this.moveMusicClock = function(){
        var that = this;

        var musicClock = SCENE.getObjectByName('musicClock');
        var t = TweenLite.to(
            musicClock.position, 24,
            {
                y: this.finalY,
                onUpdate: function(){
                },
                ease: Linear.easeNone,
            }
        )
        TweenLite.delayedCall(
            12,
            function(){t.kill();},
            [],
            this
        )
    }

    this.moveCamera = function(){
        // start at + 3

        var musicClock = SCENE.getObjectByName('musicClock');

        var t = TweenLite.to(
            CAMERA.position, 21,
            {
                y: this.finalY + this.oriCameraPosition[1] - 20,
                ease: Linear.easeNone,
                onUpdate: function(){
                }
            }
        )

        var t2 = TweenLite.delayedCall(
            6,
            function (){
                t.kill();
                TweenLite.to(
                    CAMERA.position, 16,
                    {
                        z: 100,
                        ease: Power0.LinearIn,
                    }
                )
            },
            [],
            this
        )

        var t3 = TweenLite.delayedCall(
            20.5,
            function (){
                t2.kill();
                TweenLite.to(
                    CAMERA.position, 1.5,
                    {
                        z: 5000,
                        // ease: Back.easeOut,

                        onComplete: function(){
                            console.log(CAMERA.position)
                            // SCENE.background = new THREE.Color("black")
                        }
                    }
                )
            },
            [],
            this
        )

        var black = new THREE.Color("black");
        var t4 = TweenLite.delayedCall(
            20.5,
            function (){

                TweenLite.to(
                    SCENE.background, 1.5,
                    {
                        r: black.r,
                        g: black.g,
                        b: black.b
                        // ease: Back.easeOut
                    }
                )
            },
            [],
            this
        )
        // windChime at 163+22sec = 185

    }

    this.createSpiral = function(){

        var musicClock = SCENE.getObjectByName('musicClock');

        var scale = .003;
        var dist = this.musicClockR;
        var that = this;

        var center_pos = [dist*Math.cos(0), 0, dist*Math.sin(0)],
            majorColor = 'lightcyan',
            length = 2000,
            trailWidth = .2,
            trailBlending = THREE.MultiplyBlending;

        var headPoly = new THREE.Group();

        var spiral = new FlyingNote(
            headPoly,
            center_pos,
            majorColor,
            length,
            trailWidth,
            trailBlending
        )

        spiral.name = "spiral";
        SCENE.add(spiral);

        var t = TweenLite.to(
            spiral.trailHeadPosition, 24,
            {
                y: this.finalY,
                onUpdate: function(){
                    var t = Date.now();
                    var x = Math.cos(scale * t) * dist;
                    var z = Math.sin(scale * t) * dist;
                    spiral.trailLine.advance(
                        pos2v([x, spiral.trailHeadPosition.y, z])
                    );
                },
                ease: Linear.easeNone,
            }
        )

        TweenLite.delayedCall(
            12,
            function(){t.kill();},
            [],
            this
        )

    }
    this.createPolyhedra = function(){
        // at 160 + 4

        var oriSize = 10;
        var minZ = -200, maxZ = -100;
        var rangeX = [[-50, 50], [-50, 50]],
            rangeY = [[-10, 10], [30, 50]];

            minSize = (10/oriSize)*100, maxSize = (10/oriSize)*300;

        var polyNum = 20;
        var shapeTypes = ['tetrahedron', 'dodecahedron', 'octahedron', 'icosahedron', 'cube'];
        for (var i = 0; i < polyNum; i++) {
            var range_ind = Math.floor(Math.random() * 2);
            var minX = rangeX[range_ind][0], maxX = rangeX[range_ind][1],
                minY = rangeY[range_ind][0], maxY = rangeY[range_ind][1];

            var center_pos = [
                Math.random() * (maxX - minX) + minX,
                Math.random() * (maxY - minY) + minY,
                -10 //Math.random() * (maxZ - minZ) + minZ,
            ];
            var size = Math.random() * (maxSize - minSize) + minSize;
            var tri = 3;
            var majorColor = 'oldlace'
            var shapeType = shapeTypes[Math.floor(Math.random()*5)];

            var polyhedron = new WoodBlock(
                center_pos, oriSize, tri, majorColor, shapeType
            )
            polyhedron.name = "polyhedron" + i;
            SCENE.add(polyhedron);

            polyhedron.polyRotateDuration([
                Math.random()*0.01, Math.random()*0.01, Math.random()*0.01],
                56
            ) // 220sec
            // Math.floor(Math.random()*3)
            polyhedron.changeColor(
                23, ColorMap['fullblue'][i % 9], false
            )
            // polyhedron.polyExpand(size, 8);
            TweenLite.to(
                polyhedron.poly.scale, 8,
                {
                    x: size,
                    y: size,
                    z: size,
                    ease: Power4.easeIn,
                    onUpdate: function(){
                    }

                }
            )
        }

    }

    this.expandShadows = function(){
        // at + 12

        for (var i = 0; i < this.soloConfigs['melody'].length; i++){
            var shadow = SCENE.getObjectByName('shadow' + i);
            TweenLite.to(
                shadow.poly.scale, 13,
                {
                    x: 12,
                    y: 12,
                    z: 12,
                }

            )
        }

    }

    this.earthMelody = function(){

        var size = 1,
            color = 'blue',
            pos = [-1200, -100, -350];

        var MNF = new MelodyNotesFactory(
            150*size, 150*size, 500*size, color
        );

        var notes = ['l1', 's1', 'd2', 't1', 'r2'];
        var melody = [];
        for (var i = 0; i < notes.length; i++) {melody.push({'note': notes[i]});}

        var earthMelody = MNF.createMelody(
            melody,
            pos,
            null,
            false
        )
        earthMelody = MNF.setMelodyNotesPosition(earthMelody, [0, 0, 0]);
        earthMelody.name = "earthMelody";
        earthMelody.scale.set(size, size, size);

        var t = new TimelineLite();
        for (var i = 0; i < earthMelody.melody.length; i++) {
            t = t.from(
                earthMelody.melody[i].position, 1,
                {
                    delay: .01,
                    z: 2000,
                    ease: Power4.easeOut,
                }
            )
        }
        for (var i = 0; i < earthMelody.melody.length; i++){
            TweenLite.to(
                earthMelody.melody[i].position, 20,
                {
                    delay: (1 + .01) * (i+1) + .05*i,
                    z: -2000,
                    ease: Linear.easeNone,
                }
            )
        }

        SCENE.add(earthMelody);

    }
    this.disposeInitial = function(){
        var names = ['musicClock', 'jumpyNote', 'spiral'];
        for (var i = 0; i < this.soloConfigs['melody'].length; i++) {
            names.push("shadow" + i);
        }
        for (var i = 0; i < names.length; i++){
            obj = SCENE.getObjectByName(names[i]);
            SCENE.remove(obj);
            disposeHierarchy(obj);
        }

    }


    this.earthMelody2 = function(){
        var size = .8,
            color = 'darkgreen',
            pos = [-400, 0, -150];

        var MNF = new MelodyNotesFactory(
            150*size, 100*size, 150*size, color
        );

        var notes = ['l1', 's1', 'l1', 's1', 'd2', 't1', 'r2'];
        var durations = [.2, .5, .8, .5, .5, 1, 1];
        var melody = [];
        for (var i = 0; i < notes.length; i++) {melody.push({'note': notes[i]});}

        var earthMelody = MNF.createMelody(
            melody,
            pos,
            null,
            false
        )
        earthMelody = MNF.setMelodyNotesPosition(earthMelody, [0, 0, 0]);
        earthMelody.name = "earthMelody2";
        earthMelody.scale.set(size, size, size);

        var t = new TimelineLite();
        for (var i = 0; i < earthMelody.melody.length; i++) {
            t = t.from(
                earthMelody.melody[i].position, durations[i],
                {
                    delay: .01,
                    x: 0,
                    y: this.finalY,
                    z: 3500,
                    ease: Power0.easeIn,
                }
            )
        }
        SCENE.add(earthMelody);

    }


    this.earthMelody3 = function(){

        var size = .7,
            color = 'yellow3',
            pos = [-150, 0, 50];

        var MNF = new MelodyNotesFactory(
            100*size, 50*size, 100*size, color
        );

        var notes = ['l1', 's1', 'd2', 't1', 'r2'];
        var durations = [.2, .5, .5, .3, 1];
        var melody = [];
        for (var i = 0; i < notes.length; i++) {melody.push({'note': notes[i]});}

        var earthMelody = MNF.createMelody(
            melody,
            pos,
            null,
            false
        )
        earthMelody = MNF.setMelodyNotesPosition(earthMelody, [0, 0, 0]);
        earthMelody.name = "earthMelody3";
        earthMelody.scale.set(size, size, size);

        var t = new TimelineLite();
        for (var i = 0; i < earthMelody.melody.length; i++) {
            t = t.from(
                earthMelody.melody[i].position, durations[i],
                {
                    delay: .01,
                    x: 0,
                    y: this.finalY,
                    z: 5500,
                    ease: Power0.easeIn,
                }
            )
        }
        SCENE.add(earthMelody);

    }


    this.randomExplore = function(){
        var lines = 50;

        var colors = [];
        var colorTypes = ['marine', 'lightblue', 'yellow3'];
        for (var c = 0; c < colorTypes.length; c++){
            var len = ColorMap[colorTypes[c]].length;
            for (var i = 0; i < len; i++){
                colors.push(ColorMap[colorTypes[c]][i]);
            }
        }
        var colorNum = colors.length;
        var dim = 50;

        for (var i = 0; i < lines; i++) {
            var center_pos = [Math.random()*dim-dim/2, Math.random()*dim-dim/2, Math.random()*dim-dim*2],
                majorColor = colors[i % colorNum],
                length = 500,
                trailWidth = 1.3,
                trailBlending = THREE.NormalBlending;

            var headPoly = new THREE.Group();

            var exploreNote = new FlyingNote(
                headPoly,
                center_pos,
                majorColor,
                length,
                trailWidth,
                trailBlending
            )

            exploreNote.name = "exploreNote" + i;
            SCENE.add(exploreNote);

            exploreNote.funcMoveDuration(
                function(headV) {
                    return [
                        Math.random()*50-25,
                        Math.random()*50-25,
                        Math.random()*50-25
                    ]
                },
                120 - 15,
            )
        }
    }

    this.showSoundWave = function(){
        // play at 160+25-.5 = 185-.5
        var center_pos = [0,0,-1000],
            xNum = 30,
            yNum = 30,
            zNum = 5,
            majorColor = 'mediumblue',
            size = 50,
            dist = 800;

        var soundWave = new SoundWave(center_pos, xNum, yNum, zNum, majorColor, size, dist);
        soundWave.name = 'highPitchSoundWave';
        SCENE.add(soundWave);

        var totalTime = 15;
        delaySpeed = 0.02;
        magnitude = 1000;
        t_scale = 1;

        var pulseT = soundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, new TimelineLite({paused:true}), "cylindrical"
        );
        var shineColor = "deepskyblue",
            dimColor = "blue",
            hororColor = "darkcyan";

        pulseT.call(
            soundWave.pulseParticle, [8, 50, 50, shineColor, true], soundWave, "0"
        ).call(
            soundWave.pulseParticle, [10, 80, 50, hororColor, true], soundWave, "10"
        )
        // .call(
        //     soundWave.pulseParticle, [5, 50, 50, shineColor, false], soundWave, "40" // shine end at 230sec
        // )
        pulseT.play();

    }

}