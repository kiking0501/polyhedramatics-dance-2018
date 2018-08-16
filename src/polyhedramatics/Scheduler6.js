var Scheduler6 = function(startTime) {

    var that = this;
    this.START = setdefault(startTime, 200);

    this.program = [
        'initCamera',
        'initMeteor',
        'shootMeteor',

    ]

    this.startSecond = [
        this.START,
        this.START,
        this.START,
    ]

    // Following objects in Scheduler5 are still present
    // - Polyhedra (polyNum)
    // - earthMelody/2/3
    // - randomExplore
    // - soundWave

    // camera position: [0, 40, 5000]
    this.initCamera = function(){
        CAMERA.position.set(0, 39.77, 5000);
    }

    this.meteorList = [];
    this.meteorSettings = {
        'notes': [
            'r', 'l', 'r', 'f', 'l', 'd', 'r', 'm', ,'f', 'D'
        ],
        'colors': ColorMap['fullblue'],
        'bpm': 15.0/7/4,
        'delayTime': [
            2, 2, 1.75, 2, 1.75, 1.75, 1.75, 1.5, 1.5, .5
        ],
        'startShootingTime': 5,
    }


    this.initMeteor = function(){

        var notes = this.meteorSettings['notes'];
        var colors = this.meteorSettings['colors'];

        var sumTime = 0.0;

        for (var i = 0; i < notes.length; i++){
            var center_pos = [-3000, -2000, -7000],
                majorColor = colors[i],
                length = 100,
                size = 100;

            var headPoly = new WoodBlock(
                center_pos,
                size,
                null,
                "black",
                setdefault(harmonicShapeMap[notes[i]], 'sphere')
            )

            var meteor = new FlyingNote(
                headPoly,
                [-3000, -2000, -7000],
                majorColor,
                length
            );

            meteor.name = 'meteor' + i;
            SCENE.add(meteor);
            this.meteorList.push(meteor);

            sumTime += this.meteorSettings['delayTime'][i];
            headPoly.changeColor(sumTime, colors[i], false);
        }
    }

    this.shootMeteor = function(){
        var startShooting = this.meteorSettings['startShooting'];
        var bpm = this.meteorSettings['bpm'];
        var delayTime = this.meteorSettings['delayTime'];

        // var bpm = 15.0 / 7 / 4;

        // var delayTime = [
        //     bpm*2, bpm*2, bpm*1.75, bpm*2, bpm*1.75, bpm*1.75, bpm*1.75, bpm*1.5, bpm*1.5, bpm*.5
        // ]

        var sumTime = startShooting;

        var t = new TimelineLite({paused: true});

        for (var i = 0; i < this.meteorList.length; i++){
            var meteor = this.meteorList[i];

            sumTime += delayTime[i] * bpm;

            TweenLite.from(
                meteor.trailHeadPosition, 20,
                {
                    z: 7000,
                    onUpdate: function(ind){
                        var meteor_obj = that.meteorList[ind];
                        var apos = v2pos(meteor_obj.trailHeadPosition.clone());
                        meteor_obj.advance(apos)
                        console.log(ind);
                    },
                    onUpdateParams: [i],
                    delay: sumTime,
                },
            )

        }
        t.play();

    }


}