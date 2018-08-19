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

    this.meteorSettings = {
        'notes': [
            'm', 'r', 'l', 'r', 'f', 'l', 'd', 'r', 'm', 'f', 'D'
        ],
        'colors': ColorMap['fullblue'],
        'bpm': 15.0/7/4,
        'delayTime': [
            0, 2, 2, 1.75, 1.75, 1.75, .75, 1.75, 1.5, 1.5, .5
        ],
        'startShootingTime': 2,
        'initZ': 4000,
        'finalZ': -4000,
        'bottomY': -3000,
        'upperY': 3000,
        'center_pos': [
            {
                'initX': -7000,
                'finalX': -10000,
                'num': 5
            },
            {
                'initX': -7000,
                'finalX': -10000,
                'num': 5
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 4
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 4
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 4
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 3
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 3
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 2
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 2
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 2
            },
            {
                'initX': -2000,
                'finalX': -4000,
                'num': 1
            },
        ]
    }


    this.initMeteor = function(){

        var notes = this.meteorSettings['notes'];
        var colors = this.meteorSettings['colors'];
        var bpm = this.meteorSettings['bpm'];

        var sumTime = this.meteorSettings['startShootingTime'];

        for (var i = 0; i < notes.length; i++){
            var initX = this.meteorSettings['center_pos'][i]['initX'];
            var num = this.meteorSettings['center_pos'][i]['num'];

            for (var j = 0; j < num; j ++ ) {
                var centerX = initX + (-initX - initX) * 1.0 / num * j;
                var centerY = this.meteorSettings['bottomY'] + (this.meteorSettings['upperY']
                     - this.meteorSettings['bottomY']) *1.0 / notes.length * i;
                var centerZ = this.meteorSettings['initZ'];

                var center_pos = [centerX, centerY, centerZ],
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
                    center_pos,
                    majorColor,
                    length
                );

                meteor.name = 'meteor' + i + '_' + j;
                SCENE.add(meteor);

                sumTime += this.meteorSettings['delayTime'][i] * bpm;
                TweenLite.delayedCall(
                    sumTime,
                    headPoly.changeColor,
                    [.5, colors[i], false],
                    headPoly
                )
            }

        }
    }

    this.shootMeteor = function(){
        var bpm = this.meteorSettings['bpm'];
        var delayTime = this.meteorSettings['delayTime'];

        var sumTime = this.meteorSettings['startShootingTime'];


        for (var i = 0; i < this.meteorSettings['notes'].length; i++){

            sumTime += delayTime[i] * bpm;
            var num = this.meteorSettings['center_pos'][i]['num'];

            for (var j = 0; j < num; j++) {

                var meteor = SCENE.getObjectByName('meteor' + i + '_' + j);

                TweenLite.to(
                    meteor.trailHeadPosition, 20,
                    {
                        x: that.meteorSettings['center_pos'][i]['finalX'],
                        z: that.meteorSettings['finalZ'],
                        onUpdate: function(ind, jnd){
                            var meteor_obj = SCENE.getObjectByName('meteor' + ind + '_' + jnd);
                            var apos = v2pos(meteor_obj.trailHeadPosition.clone());
                            meteor_obj.advance(apos)
                        },
                        onUpdateParams: [i, j],
                        onUpdateScope: this,
                        delay: sumTime,
                    },
                )
            }
        }

    }


}