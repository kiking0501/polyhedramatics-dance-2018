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

        // TweenLite.delayedCall( // at 79 sec
        //     6,
        //     backGroundWave.changeParticleSize, [3, 20, 30], backGroundWave
        // )

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
        // start at 87
        var flyingNote = new FlyingNote([0, 0, 0], 'lightblue', 50);
        SCENE.add(flyingNote);

    }
}