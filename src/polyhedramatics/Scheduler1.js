
var Scheduler1 = function(startTime) {

    var that = this;

    this.START = setdefault(startTime, 0.0);

    this.program = [
        'initMusicClock',
        'initSoundWave',
        'musicClockPulse',
        'soundWavePulse',
        'rotateMusicClock',
        'removeMusicClock',
    ];
    this.startSecond = [
        this.START,
        this.START,
        this.START,
        this.START ,
        this.START + 3.8,
        this.START + 8.0
    ]

    this.initMusicClock = function() {

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

    this.initSoundWave = function() {
        var center_pos = [0,0,-1000],
            xNum = 200,
            yNum = 100,
            zNum = 5,
            majorColor = 'dodgerblue',
            size = 20,
            dist = 300;

        var soundWave = new SoundWave(center_pos, xNum, yNum, zNum, majorColor, size, dist);
        soundWave.name = 'soundWave';
        SCENE.add(soundWave);

    }
    this.musicClockPulse = function () {

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
            .8,
            musicClock.pulse, [chords, timeLapse, repeat, betweenDelay], musicClock
        );

        TweenLite.delayedCall(
            1.6,
            musicClock.pulse, [chords, timeLapse, repeat, betweenDelay], musicClock
        );

        TweenLite.delayedCall(
            2.3,
            musicClock.pulse, [chords, .8, 1, betweenDelay], musicClock
        );


    }

    this.soundWavePulse = function() {
        var totalTime,
            delaySpeed,
            magnitude,
            t_scale = 1;


        var soundWave = SCENE.getObjectByName('soundWave');

        totalTime = 3;
        delaySpeed = 0.01;
        magnitude = 0;

        var randomT = soundWave.setRandomMovement(
            totalTime, delaySpeed, magnitude, t_scale
        )
        randomT.play();

        var pulseT = new TimelineLite({pause:true});
        pulseT = pulseT.call(
            function(){
                console.log('hey');
                randomT.kill();
                soundWave.resetTime()
            }, [], this, "2.7");

        totalTime = 5;
        delaySpeed = 0.05;
        magnitude = 100000;
        t_scale = 1;

        pulseT = soundWave.setGeometricPulse(
            totalTime, delaySpeed, magnitude, t_scale, pulseT
        );

        pulseT.play();

    }

    this.rotateMusicClock = function() {

        function cameraLookAt() {
            CAMERA.lookAt(pos2v([0, 0, 0]));
        }

        var t = new TimelineLite();

        t.to(CAMERA.position, 3.5,
             {
                x: 100,
                z: -800,
                onUpdate: cameraLookAt,
             }
            )
        // .to(CAMERA.rotation, 1.0,
        //     {
        //         y: Math.PI,
        //         // ease: Power0.easeNone
        //     }
        // ).to(CAMERA.position, 4,
        //     { x: 0,
        //       z: -1000,
        //       onUpdate: cameraLookAt,
        //     }
        // )

    }

    this.removeMusicClock = function() {
        restoreScene();
    }

}