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
        this.START + 5.5, //backgroundwave pulse
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
            majorColor = 'royalblue',
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

        var t = backGroundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, timeLine
        );

        t.play();

    }

    this.backGroundWavePulse = function() {

        var backGroundWave = SCENE.getObjectByName('backGroundWave');


        var shineColor = "blue";
        var t = new TimelineLite({paused: true});

        t.call(
            backGroundWave.pulseParticle, [5, 20, 35, shineColor], backGroundWave
        ).call(
            backGroundWave.pulseParticle, [5, 20, 35, shineColor], backGroundWave, "+=9.5"
        )

        t.play();
    }

    this.startFlyingNotes = function() {
        // start at 87 sec
        var center_pos = [0, 0, 0],
            majorColor = 'lightblue',
            length = 100,
            scale = 500;

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