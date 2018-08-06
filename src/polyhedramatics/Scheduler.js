var Scheduler4 = function(startTime){
    var that = this;



}

var Scheduler3 = function(startTime) {
    var that = this;

    this.START = setdefault(startTime, 36);
    this.MID = 49.5;
    // this.END

    this.program = [
        'initCameraPosition',
        'drawMelody',
        'cleanWoodBlocks',
        'initMusicClock',
        'pulseMusicClock',
        'initScaleClock',
        'pulseScaleClock',
        'melodyAgain',
        'melodyAgain2',
        'melodyAgain3',
        'killSoFar',
        'slowMelody',
        'finishNotes',
    ];

    this.startSecond = [
        this.START,
        this.START + 1.2,
        this.START + 9,
        this.START + 9,
        this.START + 9,
        this.MID - 1,
        this.MID,
        this.MID + 4.3,
        this.MID + 6.3,
        this.MID + 7.3,
        this.MID + 10.49,
        this.MID + 10.5,
        this.MID + 16.9,
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
            size, 'darkgreen', [-300, -300, -1000], 'slowMelody', sepr, layer, withEdge,
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

        TweenLite.to(
            CAMERA.position, 15,
            {
                delay: .8,
                x: 4000,
                ease: Linear.easeNone,
            }
        );

    }

    this.finishNotes = function() {
        // run at 60 sec
        var r = 500,
            sepr = 50,
            layer = 30,
            onlyDots = true;

        var bigNoteConfigs = [
            {
                'name': 'bigNote',
                'pos': [1500, 200, -500],
                'color': ColorMap['coral'][2],
                'delay': 0,
            },
            {
                'name': 'bigNote2',
                'pos': [1500, -500, -500],
                'color': ColorMap['yellow'][2],
                'delay': 0,
            },
            {
                'name': 'bigNote3',
                'pos': [2500, 400, -1000],
                'color': ColorMap['yellow'][2],
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
        TweenLite.to(
            CAMERA.rotation, 30,
            {
                delay:.2*10,
                onUpdate: function(){
                    CAMERA.rotation.y+=0.001;
                    CAMERA.position.x+=0.001;
                }
            }
        )
    }

}

var Scheduler2 = function(startTime) {

    var that = this;

    this.START = setdefault(startTime, 8.5);
    this.MID = 36;
    this.END = 44;

    this.program = [
        'initCameraPosition',
        'initWoodBlock',
        'beatWoodBlock',
        'initBigWoodBlock',
        'beatBigWoodBlock',
        'initHugeWoodBlock',
        'beatHugeWoodBlock',
        'expandWoodBlocks',
    ];

    this.startSecond = [
        this.START,
        this.START + .01,
        this.START + .01,
        this.START + 7.5,
        this.START + 7.5,
        this.START + 12.3,
        this.START + 12.3,
        this.MID,
    ];

    this.initCameraPosition = function() {
        CAMERA.position.set(-500, 0, 1000);
        CAMERA.lookAt(pos2v(0, 0, 0));
    }

    this._beatWoodBlock = function(woodBlock, beats, br, s) {

        var t = new TimelineLite({paused: true});

        var bpm = 60/100/2, prev_rest=0.0, br=br, s=s;
        for ( var i = 0; i < beats.length; i++) {

            if ('beat' in beats[i]){
                t = t.call(
                    woodBlock.cubePulse,
                    [beats[i]['beat']*bpm*setdefault(beats[i]['br'], br),
                     setdefault(beats[i]['s'], s)],
                    woodBlock, prev_rest.toFixed(3)
                )

                prev_rest += beats[i]['beat']*bpm;
            } else {
                prev_rest += beats[i]['rest']*bpm;
            }
        }
        t.play();

    }

    this.initWoodBlock = function() {
        // run at 8 sec
        var woodBlock = new WoodBlock([0, 0, 0], 300, 2, 'coral');
        woodBlock.name = 'woodBlock';
        SCENE.add(woodBlock);

        woodBlock.cubeRotate(0, 0.01, 0, 1, this.MID-this.START-0.01);
        return woodBlock;

    }

    this.beatWoodBlock = function() {
        var woodBlock = SCENE.getObjectByName('woodBlock');

        var beats = [
            {'beat': 5, 's': 80}, {'beat': 1, 's': 80}, {'rest': 2},
            {'beat': 5, 's': 80}, {'beat': 1, 's': 80}, {'rest': 2},
            {'beat': 4, 's': 80}, {'beat': 1, 's': 150}, {'beat': 1, 's': 150}, {'rest': 2},
            {'beat': 3, 's': 80}, {'beat': 1, 's': 80}, {'beat': 2, 's': 80}, {'rest': 1.8},
            {'beat': 11}, {'beat': 1}, // change beat
            {'beat': 2}, {'beat': 2.5}, {'rest': 2.}, // 6.5 beat per interval
            {'beat': 1, 's': 150}, {'beat': 1, 's': 150}, {'beat': 2}, {'rest': 2.5},
            {'beat': 2}, {'beat': 2.5}, {'rest': 2.},
            {'beat': 1, 's': 150}, {'beat': 1, 's': 150}, {'beat': 2}, {'rest': 2.5},
            {'beat': 2}, {'beat': 2}, {'rest': 2.5},
            {'beat': 6.5},
            {'beat': 2}, {'beat': 2}, {'beat': .9}, {'beat': .9}, {'rest': .7},
            {'beat': 2}, {'beat': 1.8}, {'beat': 1.8}, {'rest': .9},
            // overlap with next Scheduler
            {'rest': 6.5},
            {'rest': 6.5},
            {'beat': 1, }, {'beat': 1, }, {'beat': 2}, {'rest': 2.5},
            {'beat': 2}, {'beat': 2.5}, {'rest': 2.},
        ]

        this._beatWoodBlock(woodBlock, beats, .8, 80);

    }

    this.initBigWoodBlock = function(start) {
        start = setdefault(start, this.START+7.5);

        var bigWoodBlock = new WoodBlock([0, 0, 0], 1000, 2, 'lightblue');
        bigWoodBlock.name = 'bigWoodBlock';
        SCENE.add(bigWoodBlock);

        bigWoodBlock.cubeRotate(0.005, 0, 0, 1, this.MID-start);
        return bigWoodBlock;
    }

    this.beatBigWoodBlock = function() {
        var woodBlock = SCENE.getObjectByName('bigWoodBlock');
        if (!woodBlock) {
            woodBlock = this.initBigWoodBlock(TIMELINE.time());
        }

        var beats = [
            {'beat': 2.5}, {'rest': .5}, {'beat': 2.5}, {'rest': .5},
            {'rest': 2}, {'beat': 4.5}, // change beat to 6.5
            {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 4.5},
            {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
            {'beat': 2.0}, {'rest': 1.25}, {'beat': 2.0}, {'rest': 1.25},
            // overlap with next Scheduler
            {'rest': 6.5},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 3.25, 's': 50}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 4.0, 's': 80}, {'rest': 0.5},
        ]

        this._beatWoodBlock(woodBlock, beats, .8, 150);
    }

    this.initHugeWoodBlock = function(start) {
        start = setdefault(start, this.START+12.3);

        var hugeWoodBlock = new WoodBlock([0, 0, 0], 1100, 4, 'marine');
        hugeWoodBlock.name = 'hugeWoodBlock';
        SCENE.add(hugeWoodBlock);

        hugeWoodBlock.cubeRotate(0, 0, 0.005, 1, this.MID-start);
        return hugeWoodBlock;

    }

    this.beatHugeWoodBlock = function(){

        var woodBlock = SCENE.getObjectByName('hugeWoodBlock');
        if (!woodBlock) {
            woodBlock = this.initHugeWoodBlock(TIMELINE.time());
        }

        var beats = [
            {'beat': 2.0}, {'rest': 1.25},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 3.25}, {'rest': 1.25},
            {'rest': 5.25}, {'beat': 1.25},
            {'rest': 3.25}, {'beat': 2.0}, {'rest': 1.25},
            {'rest': 3.25}, {'beat': 2.0}, {'rest': 1.25},
            //overlap with next Scheduler
            {'rest': 6.5},
            {'rest': 6.5},
            {'rest': 6.5},
            {'rest': 2.0}, {'beat': 4.0, 's': 80}, {'rest': 0.5}
        ]

        this._beatWoodBlock(woodBlock, beats, .8, 30);
    }

    this.expandWoodBlocks = function(){

        var names = ['woodBlock', 'bigWoodBlock', 'hugeWoodBlock'];

        var createFunc = {
            'woodBlock': this.initWoodBlock,
            'bigWoodBlock': this.initBigWoodBlock,
            'hugeWoodBlock': this.initHugeWoodBlock,
        };


        function updateCube(wb){
            wb.cube.material.needsUpdate = true;
        }

        for (var i = 0; i < names.length; i++){
            var woodBlock = SCENE.getObjectByName(names[i]);
            if (!woodBlock) {
                woodBlock = createFunc[names[i]]();
            }
            TweenLite.to(
                woodBlock.scale, 8,
                {x: 10, y: 10, z: 10,
                 ease: Power4.easeOut,
                }
            );
        }

    }

}

var Scheduler1 = function(startTime) {

    var that = this;

    this.START = setdefault(startTime, 0.0);

    this.program = [
        'initMusicClock',
        'musicClockPulse',
        'rotateMusicClock',
        'removeMusicClock',
    ];
    this.startSecond = [
        this.START,
        this.START,
        this.START + 3.3,
        this.START + 8.0
    ]

    this.initMusicClock = function() {

        // var CLOCKS = [
        //     {'majorColor': 'pink',},
        //     {'majorColor': 'pink',},
        //     {'majorColor': 'coral',},
        //     {'majorColor': 'red',},
        //     {'majorColor': 'green',},
        //     {'majorColor': 'yellow',}
        // ]
        // var radius = 300;
        // var startAngle = Math.PI/2;

        // for (var i = 0; i < CLOCKS.length; i++) {
        //     CLOCKS[i]['center_pos'] = [-1000 + i*500, 0, 0];

        //     var musicClock = new MusicClock(
        //         CLOCKS[i]['center_pos'], radius, startAngle, CLOCKS[i]['majorColor']
        //     );
        //     musicClock.name = 'musicClock' + i;
        //     SCENE.add(musicClock);
        // }

        var center_pos = [0, 0, 0],
            radius = 300,
            startAngle = Math.PI/2,
            majorColor = 'pink';

        var musicClock = new MusicClock(
            center_pos, radius, startAngle, majorColor
        );
        musicClock.name = 'musicClock';
        SCENE.add(musicClock);


    };

    this.musicClockPulse = function () {

        // var CHORDS = [
        //     [['l']],
        //     [['r', 's']],
        //     [['s', 'd']],
        //     [['d']],
        //     [['t', 's']],
        //     [['d', 'm', 's', 'd']]
        // ]

        // for (var i = 0; i < CHORDS.length; i++) {
        //     var chords = CHORDS[i];
        //     var musicClock = SCENE.getObjectByName('musicClock' + i);


            var chords = [['d', 'm', 's', 'd'],
                          ['l'],
                          ['r', 's'],
                          ['t', 's']
                         ];
            var musicClock = SCENE.getObjectByName('musicClock');

            // expand
            TweenLite.to(
                musicClock.scale,
                20,
                {ease: Power0.easeNone,
                 x: 8, y: 8, z: 8}
            );

            // pulse
            var timeLapse = .05,
                repeat = 4,
                betweenDelay = .02;

            TweenLite.delayedCall(
                .2,
                musicClock.pulse, [chords, timeLapse, repeat, betweenDelay], musicClock
            );

            TweenLite.delayedCall(
                1.2,
                musicClock.pulse, [chords, timeLapse, repeat, betweenDelay], musicClock
            );

            TweenLite.delayedCall(
                2.2,
                musicClock.pulse, [chords, .8, 1, betweenDelay], musicClock
            );

        // }

    }

    this.rotateMusicClock = function() {

        function cameraLookAt() {
            CAMERA.lookAt(pos2v([0, 0, 0]));
        }

        var t = new TimelineLite();

        t.to(CAMERA.position, 4,
             {
                x: 100,
                z: -800,
                onUpdate: cameraLookAt,
             }
            )
        .to(CAMERA.rotation, 1.0,
            {
                y: Math.PI,
                // ease: Power0.easeNone
            }
        ).to(CAMERA.position, 4,
            { x: 0,
              z: -1000,
              onUpdate: cameraLookAt,
            }
        )

    }

    this.removeMusicClock = function() {
        restoreScene();
    }

}