var Scheduler4 = function(startTime) {
    var that = this;

    this.START = setdefault(startTime, 70);
    this.MID = this.START + 17; // 87sec

    this.program = [
        'addBackGroundWave',
        'backGroundWavePulse',
        'startFlyingNotes',
    ];

    this.startSecond = [
        this.START,
        this.START + 6.0,
        this.MID,
    ]

    this.addBackGroundWave = function(){
        // run at 70sec
        // SCENE.fog.near = 3000;
        // SCENE.fog.far = 4000;

        var angle = Math.PI + Math.PI/2/2;
        var dist = 1000;
        var center_pos = [0, Math.cos(angle), -dist + dist* Math.sin(angle)],
            xNum = 50,
            yNum = 50,
            zNum = 30,
            majorColor = 'lightskyblue',
            size = 20,
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

        var t = backGroundWave.setPlanePulse(
            totalTime, delaySpeed, magnitude, t_scale, timeLine
        );

        t.play();

    }

    this.backGroundWavePulse = function() {

        var backGroundWave = SCENE.getObjectByName('backGroundWave');

        var t = new TimelineLite({paused: true});

        t.call( //76 sec
            backGroundWave.changeParticleSize, [5, 20, 35], backGroundWave
        ).call( // 89 sec
            backGroundWave.changeParticleSize, [5, 20, 35], backGroundWave, "+=10"
        )
        t.play();
    }

    this.startFlyingNotes = function() {
        // start at 87 sec
        var center_pos = [2400, 0, 0],
            majorColor = 'lightblue',
            length = 100,
            scale = 50;

        var flyingNote = new FlyingNote(
            center_pos,
            majorColor,
            length,
            scale
        );

        flyingNote.name = "flyingNote";
        SCENE.add(flyingNote);


    }
}