/* [36-70sec] melodyNotes, with grand colorful-dots closing
*/

var Scheduler3 = function(startTime) {
    var that = this;

    this.START = setdefault(startTime, 36);
    this.MID = 49.5;
    // this.END

    this.program = [
        'initCameraPosition',
        'drawMelody',
        'cleanWoodBlocks',
        'showSoundWave',
        'initMusicClock',
        'pulseMusicClock',
        'initScaleClock',
        'pulseScaleClock',
        'melodyAgain',
        'melodyAgain2',
        'melodyAgain3',
        'killSoFar',
        'slowMelody',
        'linearMoveCamera',
        'finishNotes',
        'rotateCamera',
    ];

    this.startSecond = [
        this.START,
        this.START + 1.2,
        this.START + 9,
        this.START + 9, //initMusicClock
        this.START + 9, // showSoundWave
        this.START + 9, // pulseMusicClock
        this.MID - 1,
        this.MID, // pulseScaleClock
        this.MID + 4.3,  //melodyAgain
        this.MID + 6.3,
        this.MID + 7.3,
        this.MID + 10.49,
        this.MID + 10.5,
        this.MID + 10.5, // 60 sec
        this.MID + 16.9, // 67 sec
        this.MID + 18.9, // 69 sec
    ]

    this.MNF = new MelodyNotesFactory();

    this.initCameraPosition = function() {

        CAMERA.lookAt(pos2v(0, 0, 0));

        function updateCamera(){
            CAMERA.lookAt(pos2v(0, 0, 0))

        }
        TweenLite.to(
            CAMERA.position, 5,
            {   x: 0,
                onUpdate: updateCamera
            }
        )
    }

    this._drawThatMelody = function(size, color, pos, name, sepr, layer, withEdge,
                                    melody) {

        this.MNF.resetConfig(
            150*size, 150*size, 500*size, color
        );

        melody = setdefault(melody,
            [{'note': 'l1', 'sepr': sepr, 'note5num': layer},
             {'note': 's1', 'sepr': sepr, 'note5num': layer},
             {'note': 'd2', 'sepr': sepr, 'note5num': layer},
             {'note': 't1', 'sepr': sepr, 'note5num': layer},
             {'note': 'r2', 'sepr': sepr, 'note5num': layer}
            ],
        )
        var melodyNotes = this.MNF.createMelody(
            melody,
            [0, 0, 0],
            null,
            withEdge
        )
        melodyNotes = this.MNF.setMelodyNotesPosition(melodyNotes, pos)
        melodyNotes.name = name;

        melodyNotes.scale.set(size, size, size);

        return melodyNotes;

    }
    this.drawMelody = function() {

        var melodyNotes = this._drawThatMelody(
            1, 'darkgreen', [-1000, -350, 0], 'melodyNotes'
        )

        SCENE.add(melodyNotes);

        var t = new TimelineLite({paused:true});
        for (var i = 0; i < melodyNotes.melody.length; i++) {
            t = t.from(
                melodyNotes.melody[i].position, 0.2,
                {
                    delay: .1,
                    z: 2000,
                    ease: Power4.easeOut
                }
            )
        }
        for (var i = 0; i < melodyNotes.melody.length; i++){
            TweenLite.to(
                melodyNotes.melody[i].position, 20,
                {
                    delay: (.2 + .1)*5 + .4*i,
                    z: -2000,
                    ease: Linear.easeNone,
                }
            )
        }
        t.play();
    }
    this.cleanWoodBlocks = function(){
        var names = ['woodBlock', 'bigWoodBlock', 'hugeWoodBlock'];
        for (var i = 0; i < names.length; i++){
            var woodBlock = SCENE.getObjectByName(names[i]);
            if (!woodBlock) {
                continue;
            }
            SCENE.remove(woodBlock);
            disposeHierarchy(woodBlock);
        }
    }

    this.showSoundWave = function(){
        // play at 45 sec
        var center_pos = [0,0,-2000],
            xNum = 30,
            yNum = 30,
            zNum = 5,
            majorColor = 'black',
            size = 30,
            // dist = 500;
            dist = 800;

        var soundWave = new SoundWave(center_pos, xNum, yNum, zNum, majorColor, size, dist);
        soundWave.name = 'highPitchSoundWave';
        SCENE.add(soundWave);

        var totalTime = 8;
        delaySpeed = 0.02;
        magnitude = 1000;
        t_scale = 1;

        var pulseT = soundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, new TimelineLite({paused:true}), "cylindrical"
        );
        var shineColor = "hotpink",
            dimColor = "black";

        pulseT.call(
            soundWave.pulseParticle, [4.5, 30, 30, shineColor, false], soundWave, "0"
        ).call(
            soundWave.pulseParticle, [5.5, 30, 30, dimColor, false], soundWave, "6.5"
        ).call(
            function(){SCENE.remove(soundWave); disposeHierarchy(soundWave);}
        )
        pulseT.play();
    }
    this.initMusicClock = function(){

        var center_pos = [0, 0, 0],
            radius = 1000,
            startAngle = Math.PI/2,
            majorColor = 'pink';

        var initNodeColors = [];
        for (var i = 0; i < 12; i++){
            initNodeColors.push(ColorMap["grey"][6]);
        }
        var customSettings = {
            nodeColors: initNodeColors,
        }
        var musicClock = new MusicClock(
            center_pos, radius, startAngle, majorColor,
            customSettings
        );
        musicClock.name = 'musicClock';
        SCENE.add(musicClock);

        musicClock.position.set(0, 0, 0);
        TweenLite.from(
            musicClock.position, 1,
            {
                z: 2000,
                ease: Power4.easeOut,
            }
        )

    }

    this.pulseMusicClock = function() {
        var musicClock = SCENE.getObjectByName('musicClock');

        var chords = [['l'],
                      ['r', 's'],
                      ['s', 'd'],
                      ['d'],
                      ['t', 's']
                     ];

        // pulse
        var timeLapse = .05,
            repeat = 4,
            betweenDelay = .02;

        TweenLite.delayedCall(
            .2,
            musicClock.pulse, [chords, timeLapse, repeat, betweenDelay], musicClock
        );

        TweenLite.delayedCall(
            1,
            musicClock.pulse, [chords, 1.8, 1, 0], musicClock
        )
    }

    this.initScaleClock = function(){
        var center_pos = [0, 0, 0],
            radius = 1000,
            startAngle = Math.PI/2,
            majorColor = 'lightblue';

        var initNodeColors = [];
        for (var i = 0; i < 12; i++){
            initNodeColors.push(ColorMap["grey"][6]);
        }
        var customSettings = {
            nodeColors: initNodeColors,
        }
        var scaleClock = new MusicClock(
            center_pos, radius, startAngle, majorColor,
            customSettings
        );
        scaleClock.name = 'scaleClock';
        SCENE.add(scaleClock);


        var musicClock = SCENE.getObjectByName('musicClock');
        if (musicClock) {
            SCENE.remove(musicClock);
            disposeHierarchy(musicClock);
        }

    }
    this.pulseScaleClock = function() {
        var scaleClock = SCENE.getObjectByName('scaleClock');
        var scale1 = ['d', 'r', 'f', 'l', 'd', 'r', 'f', 's', 'l'],
            scale2 = ['s', 'f', 'r', 'd', 'l', 's', 'f', 'r', 'd'];

        var timeLapse = .1,
            repeat = 1,
            betweenDelay = 0,
            dt = 0.13;

        for (var i = 0; i < scale1.length; i++) {
            var chords = [
                            [scale1[i], i > 0? scale1[i-1]: scale1[i]]
                         ];
            var tL = timeLapse;
            var DT = dt * i;
            if (i == 0) {
                DT = .1;
            } else if (i == scale1.length -1) {
                tL = .8;
                // chords = [ scale1 ];
            }
            TweenLite.delayedCall(
                DT,
                scaleClock.pulse, [chords,
                                   tL,
                                   repeat,
                                   betweenDelay],
                scaleClock
            );
        }

        var midRest = 2.5;
        for (var i = 0; i < scale2.length; i++) {
            var chords = [
                            [scale2[i], i > 0? scale2[i-1]: scale2[i]]
                         ];
            var tL = timeLapse;
            if (i == 0) {
                tL = 1;
                chords = [ [scale2[0]] ];
            } else if (i == scale2.length -1) {
                tL = .8;
                chords = [ scale2 ];
            }
            TweenLite.delayedCall(
                dt * i + midRest,
                scaleClock.pulse, [chords,
                                   tL,
                                   repeat,
                                   betweenDelay],
                scaleClock
            );
        }
    }

    this.melodyAgain = function() {
        // 53 sec

        var prevMelodyNotes = SCENE.getObjectByName('melodyNotes');
        if (prevMelodyNotes) {
            SCENE.remove(prevMelodyNotes);
            disposeHierarchy(prevMelodyNotes);
        }


        var size = 0.8,
            sepr = 30,
            layer = 10;

        var melodyNotes = this._drawThatMelody(
            size, 'blue', [-1200, -600, 200], 'melodyNotesAgain', sepr, layer
        )
        SCENE.add(melodyNotes);


        function updateCamera(){
            CAMERA.position.x += 1;
            CAMERA.position.y += 0.5;
        }

        var t = new TimelineLite({paused:true});
        for (var i = 0; i < melodyNotes.melody.length; i++) {
            t = t.from(
                melodyNotes.melody[i].position, 0.2,
                {
                    delay: .1,
                    z: 2000,
                    ease: Power4.easeOut
                }
            )
        }
        t.play();
        for (var i = 0; i < melodyNotes.melody.length; i++){
            TweenLite.to(
                melodyNotes.melody[i].position, 4,
                {
                    delay: (.2 + .1)*5 + .4*i,
                    z: 10,
                    ease: Linear.easeNone,
                    onUpdate: updateCamera,
                }
            )
        }

    }

    this.melodyAgain2 = function() {
        var size = 0.8,
            sepr = 30,
            layer = 10;

        var melodyNotes = this._drawThatMelody(
            size, 'purple', [450, 400, 200], 'melodyNotesAgain2', sepr, layer
        )

        SCENE.add(melodyNotes);


        function updateCamera(){
            CAMERA.position.x += 6;
            CAMERA.position.y += 1;
        }


        var t = new TimelineLite({paused:true});
        for (var i = 0; i < melodyNotes.melody.length; i++) {
            t = t.from(
                melodyNotes.melody[i].position, 0.2,
                {
                    delay: .1,
                    z: 2000,
                    ease: Power4.easeOut
                }
            )
        }
        t.play();
        for (var i = 0; i < melodyNotes.melody.length; i++){
            TweenLite.to(
                melodyNotes.melody[i].position, 2,
                {
                    delay: (.2 + .1)*5 + .4*i,
                    z: 10,
                    ease: Linear.easeNone,
                    onUpdate: updateCamera,
                }
            )
        }


    }

    this.melodyAgain3 = function() {

        var prevMelodyNotes = SCENE.getObjectByName('melodyNotesAgain2');
        var startPos = prevMelodyNotes.rawMelodyPositions[
            prevMelodyNotes.rawMelodyPositions.length-1
        ];
        startPos[0] += prevMelodyNotes.setPosition[0];
        startPos[1] += prevMelodyNotes.setPosition[1];
        startPos[2] += prevMelodyNotes.setPosition[2] + 50;

        var size = 0.8,
            sepr = 30,
            layer = 10;

        var melodyNotes = this._drawThatMelody(
            size, 'marine', startPos, 'melodyNotesAgain3', sepr, layer
        )

        SCENE.add(melodyNotes);


        function updateCamera(){
            CAMERA.position.x += 20;
            CAMERA.rotation.y -= 0.001;
        }

        var t = new TimelineLite({paused:true});
        var delayList = [.1*3/2, .1*3/2, .2*2, .2*2, .2*2];
        var timeLapseList = [.2, .2, .3, .3, .3];
        for (var i = 0; i < melodyNotes.melody.length; i++) {
            t = t.from(
                melodyNotes.melody[i].position, timeLapseList[i],
                {
                    delay: delayList[i],
                    z: 2000,
                    ease: Power4.easeOut,
                }
            )
        }

        t.play();
        for (var i = 0; i < melodyNotes.melody.length; i++){
            TweenLite.to(
                melodyNotes.melody[i].position, 1.0,
                {
                    delay: (.2 + .1)*5 + .4*i,
                    z: 10,
                    ease: Linear.easeNone,
                    onUpdate: i == melodyNotes.melody.length-1? updateCamera: function(){},
                }
            )
        }

    }

    this.killSoFar = function() {
        TweenLite.to(
            CAMERA.position, 0.5,
            {
                x: 0,
                y: 0,
                z: 1000,
                onUpdate: function(){CAMERA.lookAt(pos2v(0, 0, 0))}
            }
        )

        var names = ['scaleClock',
                     'melodyNotesAgain', 'melodyNotesAgain2', 'melodyNotesAgain3'];
        for (var i = 0; i < names.length; i++) {
            var obj = SCENE.getObjectByName(names[i]);
            if (obj) {
                SCENE.remove(obj);
                disposeHierarchy(obj)
            }
        }
    }

    this.slowMelody = function() {
        var size = 1,
            sepr = 50,
            layer = 30,
            withEdge = false,
            melody = [
             {'note': 'l1', 'sepr': sepr, 'note5num': layer},
             {'note': 's1', 'sepr': sepr, 'note5num': layer},
             {'note': 'd2', 'sepr': sepr, 'note5num': layer},
             {'note': 't1', 'sepr': sepr, 'note5num': layer},
             {'note': 'r2', 'sepr': sepr, 'note5num': layer},
             {'note': 'r2', 'sepr': sepr, 'note5num': layer},
            ];

        // shared //
        var delayList = [.2*4, .2*4, .2*5, .2*5, .2*8, .2*15];
        var sumDelay = [];
        for (var i = 0; i < delayList.length; i++) {
            if (i == 0){sumDelay.push(delayList[i]);}
            else {sumDelay.push(delayList[i] + sumDelay[i-1]);}
        }

        var durationList = [10, 8, 7, 6, 6, 5];
        //////

        var slowMelody = this._drawThatMelody(
            size, 'blue', [-300, 0, -1000], 'slowMelody', sepr, layer, withEdge,
            melody
        );

        SCENE.add(slowMelody);

        for (var i = 0; i < slowMelody.melody.length; i++) {
            TweenLite.from(
                slowMelody.melody[i].position, durationList[i],
                {
                    delay: sumDelay[i],
                    z: 1500,
                    ease: Power4.easeOut,
                }
            )
        }

        var slowMelody2 = this._drawThatMelody(
            size, 'darkgreen', [-300, -300, -1000], 'slowMelody2', sepr, layer, withEdge,
            melody
        );

        SCENE.add(slowMelody2);
        for (var i = 0; i < slowMelody2.melody.length; i++) {
            TweenLite.from(
                slowMelody2.melody[i].position, durationList[i],
                {
                    delay: sumDelay[i],
                    z: -8000,
                    ease: Power4.easeOut,
                }
            )
        }

    }

    this.linearMoveCamera = function(){
        var t = new TimelineLite({paused: true});
        t.to(
            CAMERA.position, 15,
            {
                delay: .8,
                x: 4000,
                ease: Linear.easeNone,
                onUpdate: function(){}
            }
        ).to(
            CAMERA.position, 13, //start at 76 sec
            {
                ease: Linear.easeNone,
                x: 4200,
            }
        )

        t.play();
    }

    this.finishNotes = function() {
        // run at 60 sec
        var r = 500,
            sepr = 50,
            layer = 30,
            onlyDots = true;

        var bigNoteConfigs = [
            {
                'name': 'bigNote1',
                'pos': [1500, 200, -500],
                'color': ColorMap['coral'][2],
                'delay': 0,
            },
            {
                'name': 'bigNote2',
                'pos': [1500, -500, -500],
                'color': ColorMap['yellow3'][2],
                'delay': 0,
            },
            {
                'name': 'bigNote3',
                'pos': [2500, 400, -1000],
                'color': ColorMap['yellow3'][2],
                'delay': .2*10,
                'timeLapse': 4,
                'sepr': 100,
                'layer': 50,
                'from': -10000,
            },
            {
                'name': 'bigNote4',
                'pos': [2500, -300, -1000],
                'color': ColorMap['green'][2],
                'delay': .2*10,
                'timeLapse': 4,
                'sepr': 100,
                'layer': 50,
                'from': -10000,
            },
            {
                'name': 'bigNote5',
                'pos': [2500, -600, -1000],
                'color': ColorMap['coral'][2],
                'delay': .2*10,
                'timeLapse': 4,
                'sepr': 100,
                'layer': 50,
                'from': -10000,
            }
        ]

        for (var i = 0; i < bigNoteConfigs.length; i++) {
            var config = bigNoteConfigs[i];
            var bigNote = this.MNF.createNode(
                config['pos'], config['color'], r,
                setdefault(config['sepr'], sepr),
                setdefault(config['layer'], layer), onlyDots
            )
            bigNote.name = config['name'];
            SCENE.add(bigNote);
            TweenLite.from(
                bigNote.position, setdefault(config['timeLapse'], 3),
                {
                    delay: config['delay'],
                    z: setdefault(config['from'], -2000),
                }

            )
        }
    }

    this.rotateCamera = function(){

        var t = new TimelineLite({paused: true});

        TweenLite.to(
            CAMERA.rotation, 41,
            {
                y: (Math.PI)/2,
                ease: Power2.easeOut,
            }

        )


        TweenLite.to(
            CAMERA.position, 41,
            {
                x: 4500,
                ease: Power4.easeOut,
            }

        )

        // CAMERA position at [4500, 0, 1000]
        // CAMERA rotation [0, Math.PI/2, 0]
    }

}
