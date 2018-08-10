var Scheduler4 = function(startTime) {
    var that = this;

    this.START = setdefault(startTime, 70);
    this.MID = this.START + 8;

    this.program = [
        'shineTunnel',
        'addBackGroundWave',
        'backGroundWavePulse',
        'startFlyingNotes',
        'killSlowMelody',
        'anotherFlyingNotes',
    ];

    this.startSecond = [
        this.START, // shineTunnel
        this.START,
        this.START + 5.5, //backgroundwave pulse
        this.START, // startflyingNote end at +8 then callback
        this.START + 8,
        this.START + 8.5, // anotherflyingNote end at +8 then callback

    ]

    this._shineTunnel = function(totalTime, minSize, maxSize, layerDelay){

        for (var i = 1; i <= 5; i++){
            var bigNote = SCENE.getObjectByName('bigNote' + i);
            melodyNoteUtil = new MelodyNote();
            melodyNoteUtil.pulsePoints(
                bigNote, totalTime, minSize, maxSize, ColorMap['yellow'][0], layerDelay
            );
        }

    }

    this.shineTunnel = function(){

        TweenLite.delayedCall(
            14,
            this._shineTunnel, [2, 3, 6, 0.1], this
        )
        TweenLite.delayedCall(
            28,
            this._shineTunnel, [2, 3, 6, 0.05], this
        )

    }
    this.addBackGroundWave = function(){
        // run at 70sec
        // SCENE.fog.near = 3000;
        // SCENE.fog.far = 4000;

        var angle = Math.PI + Math.PI/2/2;
        var dist = 2000;
        var center_pos = [0, Math.cos(angle), -dist + dist* Math.sin(angle)],
            xNum = 50,
            yNum = 50,
            zNum = 30,
            majorColor = 'royalblue',
            size = 30,
            dist = 300,
            isLattice = true;

        var backGroundWave = new SoundWave(
            center_pos, xNum, yNum, zNum, majorColor, size, dist, isLattice
        );
        backGroundWave.position.set(0, 0, -1000);
        backGroundWave.name = 'backGroundWave';
        SCENE.add(backGroundWave);

        TweenLite.from(
            backGroundWave.position, 5,
            {
                z: -5000
            }
        )

        var totalTime = 50,
            delaySpeed = 0.1,
            magnitude = 100,
            t_scale = 1,
            timeLine = new TimelineLite({pause:true});

        var t = backGroundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, timeLine
        );

        t.play();

    }

    this.backGroundWavePulse = function() {
        // start at 75.5
        var backGroundWave = SCENE.getObjectByName('backGroundWave');


        var shineColor = "blue";
        var t = new TimelineLite({paused: true});

        t.call(
            backGroundWave.pulseParticle, [5, 30, 45, shineColor], backGroundWave //most at 78
        ).call(
            backGroundWave.pulseParticle, [5, 30, 45, shineColor], backGroundWave, "+=9.5" // most at 92.5sec
        )

        t.play();
    }


    this.startFlyingNotes = function(){
        // arrive start at 70+8, then callback
        var flyingNoteNum = 9;
        var maxH = 2000,
            minH = -3000;

        var colors = [
            'navy',
            'mediumblue',
            'royalblue',
            'dodgerblue',
            'deepskyblue',
            'cornflowerblue',
            'lightskyblue',
            'skyblue',
            'paleturquoise',
        ]

        this.flyingNoteList = [];

        var that = this;

        function flyingNoteAdvance(ind){

            var totalTime = 1,
                finalColor = ColorMap['yellow'][0],
                minSize=3,
                maxSize=5,
                layerId= [1,2];

            for (var i = 1; i <= 5; i++){
                var bigNote = SCENE.getObjectByName('bigNote' + i);
                melodyNoteUtil = new MelodyNote();
                for (var j = 0; j < layerId.length; j++){
                    melodyNoteUtil._changePointColor(
                        bigNote, layerId[j], totalTime, finalColor
                    );
                    melodyNoteUtil._changePointSize(
                        bigNote, layerId[j], totalTime, minSize, maxSize
                    );
                }
            }

            var duration = 60,
                speed = [0, 0, 20];
            that.flyingNoteList[ind].move(duration, speed);
        }

        var delay = .8;

        for (var i = 0; i < flyingNoteNum; i++){

            var center_pos = [0, minH + (maxH-minH)*1.0/flyingNoteNum*i, -4000],
                majorColor = colors[i],
                length = 5.7*Math.pow(flyingNoteNum-i+1, 2),
                size = 30;

            var flyingNote = new FlyingNote(
                center_pos,
                majorColor,
                length,
                size
            );

            flyingNote.name = "flyingNote" + i;
            SCENE.add(flyingNote);
            this.flyingNoteList.push(flyingNote);

            flyingNote.position.set(0,0,0);

            var t = new TimelineLite();
            t.from(
                flyingNote.position, (this.MID - this.START),
                {
                    delay: delay*i,
                    z: -10000,
                }
            ).call(
                flyingNoteAdvance, [i], this, "+=0"
            );
        }

    }

    this.killSlowMelody = function(){

        var names = ['slowMelody', 'slowMelody2'];

        for (var i = 0; i < names.length; i++){
            var slowMelody = SCENE.getObjectByName(names[i]);
            SCENE.remove(slowMelody);
            disposeHierarchy(slowMelody);
        }
    }

    this.anotherFlyingNotes = function(){
        // arrive start at 70+8, then callback
        var flyingNoteNum = 10;
        var maxH = 2500,
            minH = -3500;

        var colors = [
            'darkslategray',
            'navy',
            'mediumblue',
            'royalblue',
            'dodgerblue',
            'deepskyblue',
            'cornflowerblue',
            'lightskyblue',
            'skyblue',
            'paleturquoise',
        ]

        this.flyingNoteList2 = [];

        var that = this;

        function flyingNoteAdvance(ind){

            var totalTime = 1,
                finalColor = ColorMap['yellow'][0],
                minSize=3,
                maxSize=5,
                layerId= [1,2];

            for (var i = 1; i <= 5; i++){
                var bigNote = SCENE.getObjectByName('bigNote' + i);
                melodyNoteUtil = new MelodyNote();
                for (var j = 0; j < layerId.length; j++){
                    melodyNoteUtil._changePointColor(
                        bigNote, layerId[j], totalTime, finalColor
                    );
                    melodyNoteUtil._changePointSize(
                        bigNote, layerId[j], totalTime, minSize, maxSize
                    );
                }
            }

            var duration = 60,
                speed = [0, 0, 15];
            that.flyingNoteList2[ind].move(duration, speed);
        }

        var delay = 1;

        for (var i = 0; i < flyingNoteNum; i++){

            var center_pos = [0, minH + (maxH-minH)*1.0/flyingNoteNum*i, -4000],
                majorColor = colors[i],
                length = 5.5*Math.pow(flyingNoteNum-i+1, 2),
                size = 30;

            var flyingNote = new FlyingNote(
                center_pos,
                majorColor,
                length,
                size
            );

            flyingNote.name = "flyingNote2_" + i;
            SCENE.add(flyingNote);
            this.flyingNoteList2.push(flyingNote);

            flyingNote.position.set(0,0,0);

            var t = new TimelineLite();
            t.from(
                flyingNote.position, (this.MID - this.START),
                {
                    delay: delay*i,
                    z: -10000,
                }
            ).call(
                flyingNoteAdvance, [i], this, "+=0"
            );
        }

    }
}