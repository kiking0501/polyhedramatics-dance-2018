
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