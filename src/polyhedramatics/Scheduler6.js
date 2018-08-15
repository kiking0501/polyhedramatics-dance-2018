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
        this.START + 5,
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

    this.initMeteor = function(){

        var notes = [
            'r', 'l', 'r', 'f', 'l', 'd', 'r', 'm', ,'f', 'D'
        ]
        var colors = ColorMap['fullblue'];


        for (var i = 0; i < notes.length; i++){
            var center_pos = [-3000, -2000, -7000],
                majorColor = colors[i],
                length = 100,
                size = 100;

            var headPoly = new WoodBlock(
                center_pos,
                size,
                null,
                majorColor,
                setdefault(harmonicShapeMap[notes[i]], 'sphere')
            )

            var meteor = new FlyingNote(
                headPoly,
                center_pos,
                majorColor,
                length
            );

            meteor.name = 'meteor' + i;
            SCENE.add(meteor);
            this.meteorList.push(meteor);
        }
            // meteor.position.set(0, 0, 0);
    }

    this.shootMeteor = function(){

        var bpm = 15.0 / 7 / 4;

        var delayTime = [
            bpm*2, bpm*2, bpm*1.75, bpm*2, bpm*1.75, bpm*1.75, bpm*1.75, bpm*1.5, bpm*1.5, bpm*.5
        ]


        for (var i = 0; i < this.meteorList.length; i++){
            var meteor = this.meteorList[i];

            var t = new TimelineLite();
            t.from(
                meteor.trailHeadPosition, 20,
                {
                    z: 7000,
                    onUpdate: function(ind){
                        // console.log(that.meteorList);
                        var meteor_obj = that.meteorList[ind];
                        // console.log(ind, meteor_obj)
                        var apos = v2pos(meteor_obj.trailHeadPosition.clone());
                        meteor_obj.advance(apos)
                    },
                    onUpdateParams: [i],
                    delay: delayTime[i],
                },
            )
        }

    }


}