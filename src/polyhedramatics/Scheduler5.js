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
        // 'earthMelody',
        'expandShadow',
        'randomExplore',
        'showSoundWave',
    ]

    this.startSecond = [
        this.START-0.5-0.2, //initCamera,
        this.START-0.5-0.2, //initMusicClock
        this.START-0.5-0.2, //soloMusicClock
        this.START-0.5-0.1, //startJumpyNote
        this.START-0.5-0.1, //moveMusicClock
        this.START-0.5-0.1, //moveCamera
        this.START-0.5-0.1, //createSpiral
        // this.START + 8, // earthMelody
        this.START + 12, // expandShadow
        this.START + 15-0.5, //randomExplore //21
        this.START + 25,
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
            CAMERA.position, 1.2,
            {
                z: 200,
                onComplete: function(){
                    CAMERA.rotation.set(0, 0, 0);
                },
                ease: Power0.easeOut,
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
            length = 1000,
            trailWidth = .02,
            trailBlending = THREE.MultiplyBlending;

        var offsetY = 5;

        var size = 1,
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
        headPoly.polyPulseDuration(.1, .01, 1,
                                   15)
        headPoly.polyRotateDuration([0.001, 0.001, 0.001],
                                   30);

        var jumpyNote = new FlyingNote(
            headPoly,
            center_pos,
            majorColor,
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
        var musicClock = SCENE.getObjectByName('musicClock');

        var t = TweenLite.to(
            CAMERA.position, 24,
            {
                y: this.finalY + this.oriCameraPosition[1] - 20,
                ease: Linear.easeNone,
                onUpdate: function(){
                    CAMERA.position.z -= 0.0000001
                }
            }
        )

        var t2 = TweenLite.delayedCall(
            12,
            function (){
                t.kill();
                TweenLite.to(
                    CAMERA.position, 13,
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
            24,
            function (){
                t2.kill();
                TweenLite.to(
                    CAMERA.position, 1,
                    {
                        z: 5000,
                        // ease: Back.easeOut,

                        onComplete: function(){
                            SCENE.background = new THREE.Color("black")
                        }
                    }
                )
            },
            [],
            this
        )


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

    this.earthMelody = function(){

        var size = .5,
            color = 'darkgreen',
            pos = [0, 35, 14
                  ];

        console.log(CAMERA.position);
        console.log(pos);

        var MNF = new MelodyNotesFactory(
            150*size, 150*size, 500*size, color
        );

        var notes = ['l1', 's1', 'd', 't', 'r'];
        var melody = [];
        for (var i = 0; i < notes.length; i++) {melody.push({'note': notes[i]});}

        var earthMelody = MNF.createMelody(
            melody,
            [0, 0, 0],
            null,
            false
        )
        earthMelody = MNF.setMelodyNotesPosition(earthMelody, pos);
        earthMelody.name = "earthMelody";

        earthMelody.scale.set(size, size, size);
        earthMelody.rotation.x = Math.PI;
        earthMelody.rotation.y = Math.PI/2;


        SCENE.add(earthMelody);

    }
    this.expandShadow = function(){

        for (var i = 0; i < this.soloConfigs['melody'].length; i++){
            var shadow = SCENE.getObjectByName('shadow' + i);
            TweenLite.to(
                shadow.poly.scale, 10,
                {
                    x: 5,
                    y: 5,
                    z: 5,
                }

            )
        }

    }

    this.randomExplore = function(){
        console.log(CAMERA.position);
        var colors = [];
        var colorTypes = ['marine', 'lightblue', 'yellow'];
        for (var c = 0; c < colorTypes.length; c++){
            var len = ColorMap[colorTypes[c]].length;
            for (var i = 0; i < len; i++){
                colors.push(ColorMap[colorTypes[c]][i]);
            }
        }
        var colorNum = colors.length;
        var dim = 50;

        for (var i = 0; i < 50; i++) {
            var center_pos = [Math.random()*dim-dim/2, Math.random()*dim-dim/2, Math.random()*dim-dim*2],
                majorColor = colors[i % colorNum],
                length = 500,
                trailWidth = 2,
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
        // play at 45 sec
        var center_pos = [0,0,-1000],
            xNum = 60,
            yNum = 60,
            zNum = 5,
            majorColor = 'mediumblue',
            size = 30,
            // dist = 500;
            dist = 500;

        var soundWave = new SoundWave(center_pos, xNum, yNum, zNum, majorColor, size, dist);
        soundWave.name = 'highPitchSoundWave';
        SCENE.add(soundWave);

        var totalTime = 20;
        delaySpeed = 0.02;
        magnitude = 1000;
        t_scale = 1;

        var pulseT = soundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, new TimelineLite({paused:true}), "cylindrical"
        );
        var shineColor = "deepskyblue",
            dimColor = "mediumblue";

        pulseT.call(
            soundWave.pulseParticle, [8, 30, 30, shineColor, true], soundWave, "0"
        ).call(
            soundWave.pulseParticle, [8.5, 30, 30, shineColor, true], soundWave, "21" // shine at +25, 210sec
        ).call(
            soundWave.pulseParticle, [5, 30, 30, shineColor, false], soundWave, "40" // shine end at 230sec
        )
        pulseT.play();

    }

}