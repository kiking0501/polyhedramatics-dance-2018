/* [0-8sec] Start of the Song, just before woodBlocks
*/

var Scheduler1 = function(startTime) {

    var that = this;

    this.START = setdefault(startTime, 0.0);

    this.program = [
        'initSoundWave',
        'initMusicClock',
        'musicClockPulse',
        'soundWavePulse',
        'moveCamera',
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

    this.initSoundWave = function() {

        var center_pos = [0,0,-1000],
            xNum = 100,
            yNum = 100,
            zNum = 5,
            majorColor = 'dodgerblue',
            size = 20,
            dist = 500;

        var soundWave = new SoundWave(center_pos, xNum, yNum, zNum, majorColor, size, dist);
        soundWave.name = 'soundWave';
        SCENE.add(soundWave);

    }

    this.soundWavePulse = function(){
        var names = ['soundWave',
                    ];
        for (var i = 0; i < names.length; i++) {
            var soundWave = SCENE.getObjectByName('soundWave');
            this._soundWavePulse(soundWave);
        }

    }

    this._soundWavePulse = function(soundWave, magnitude) {
        var totalTime,
            delaySpeed,
            magnitude,
            t_scale = 1;

        // totalTime = 3;
        // delaySpeed = 0.01;
        // magnitude = 0;

        // var randomT = soundWave.setRandomMovement(
        //     totalTime, delaySpeed, magnitude, t_scale
        // )
        // randomT.play();

        var pulseT = new TimelineLite({pause:true});
        pulseT = pulseT.call(
            function(){
                // randomT.kill();
                soundWave.resetTime()
            }, [], this, "2.7");

        totalTime = 6;
        delaySpeed = 0.02;
        magnitude = 1500;
        t_scale = 1;

        pulseT = soundWave.setLinearMovement(
            totalTime, delaySpeed, magnitude, t_scale, pulseT, "cylindrical"
        );

        var shineColor = "deepskyblue",
            dimColor = "mediumblue";
        pulseT.call(
            soundWave.pulseParticle, [0.5, 20, 21, shineColor, false], soundWave, "2.7"
        ).call(
            soundWave.pulseParticle, [3.5, 21, 20, dimColor, false], soundWave, "3.7"
        )

        pulseT.play();


    }

    this.moveCamera = function() {

        var t = new TimelineLite();

        var soundWave = SCENE.getObjectByName('soundWave');
        var ori_offset = [
            soundWave.center_pos[0] - CAMERA.position.x,
            soundWave.center_pos[1] - CAMERA.position.y,
            soundWave.center_pos[2] - CAMERA.position.z
        ];

        var ori_position = [CAMERA.position.x, CAMERA.position.y, CAMERA.position.z];

        function cameraLookAt() {
            CAMERA.lookAt(pos2v([0, 0, 0]));
            var offset = [
                ori_position[0] - CAMERA.position.x,
                ori_position[1] - CAMERA.position.y,
                ori_position[2] - CAMERA.position.z
            ]

            ori_position = [
                CAMERA.position.x,
                CAMERA.position.y,
                CAMERA.position.z
            ]
            soundWave.position.x += offset[0];
            soundWave.position.y += offset[1];
            soundWave.position.z += offset[2];
        }


        t.to(CAMERA.position, 3.5,
             {
                x: 100,
                z: -800,
                onUpdate: cameraLookAt,
             }
        ).to(CAMERA.position, 4,
             {
                x: -500,
                y: 0,
                z: 1000,
                onUpdate: function(){CAMERA.lookAt(pos2v([0, 0, 0]));}
             }
            )
    }

    this.removeMusicClock = function() {
        var musicClock = SCENE.getObjectByName('musicClock');
        SCENE.remove(musicClock);
        disposeHierarchy(musicClock);

    }

}