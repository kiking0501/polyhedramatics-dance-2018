var SoundWave = function(center_pos, xNum, yNum, zNum, majorColor, size, dist, isLattice){
    // if center_pos = (0, 0, 0),
    // then span: [-xNum/2, xNum/2] * [-yNum/2, yNum/2] * [0, -zNum]

    THREE.Group.apply(this, arguments);


    isLattice = setdefault(isLattice, false);

    this.center_pos = center_pos;
    this.xNum = xNum;
    this.yNum = yNum;
    this.zNum = zNum;
    this.color3 = new THREE.Color(setdefault(ColorMap[majorColor], [majorColor])[0]);
    this.size = size;
    this.dist = dist;

    this.vertices = [];

    if (isLattice) {
        for (var i = 0; i < xNum; i++){
            for (var j = 0; j < yNum; j++){
                for (var k = 0; k < zNum; k++) {
                    this.vertices.push(
                        (i - Math.round(xNum / 2.0))*dist + center_pos[0],
                        (j - Math.round(yNum / 2.0))*dist + center_pos[1],
                        center_pos[2] - k*dist,
                    )
                }
            }
        }
    } else {
        for (var m = 0; m < (xNum*yNum*zNum); m++) {

            this.vertices.push(
                (xNum * Math.random() - xNum / 2.0)*dist + center_pos[0],
                (yNum * Math.random() - yNum / 2.0)*dist + center_pos[1],
                center_pos[2] - zNum*Math.random()
            )
        }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
        'position',
        new THREE.Float32BufferAttribute(
            this.vertices,
            3
        )
    )

    var sprite = new THREE.TextureLoader().load('../texture/sprites/disc.png');

    var material = new THREE.PointsMaterial({
        color: this.color3,
        size: size,
        map: sprite,
        transparent: true,
    })

    var particles = new THREE.Points(geometry, material);
    this.particles = particles;
    this.add(particles);

    this.t = 0;
}

SoundWave.prototype = Object.create(THREE.Group.prototype);
SoundWave.prototype.constructor = SoundWave;

SoundWave.prototype.resetTime = function(){
    this.t = 0;
}

SoundWave.prototype.pulseParticle = function(totalTime, minSize, maxSize, finalColor, cycle) {
    this.changeParticleColor(totalTime, finalColor, cycle);
    this.changeParticleSize(totalTime, minSize, maxSize, cycle);
}

SoundWave.prototype.changeParticleColor = function(totalTime, finalColor, cycle){
    changeMaterialColor(this, 'particles', totalTime, finalColor, cycle);

}

SoundWave.prototype.changeParticleSize = function(totalTime, minSize, maxSize, cycle){
    changePointMaterialSize(this, 'particles', totalTime, minSize, maxSize, cycle);

}

SoundWave.prototype.setRandomMovement = function(totalTime, delaySpeed, magnitude, t_scale, timeLine) {
    var waveType = "random";
    var magnitudeFunc = function(m, i) {
        return m;
    };

    var timeLine = this.setMovement(totalTime, delaySpeed, magnitude, t_scale, timeLine, waveType, magnitudeFunc);

    return timeLine;
}


SoundWave.prototype.setLinearMovement = function(totalTime, delaySpeed, magnitude, t_scale, timeLine, waveType) {

    waveType = setdefault(waveType, "plane");
    var magnitudeFunc = function(m, i) {
        return m;
    };

    var timeLine = this.setMovement(totalTime, delaySpeed, magnitude, t_scale, timeLine, waveType, magnitudeFunc);

    return timeLine;

}

SoundWave.prototype.setGeometricMovement = function(totalTime, delaySpeed, magnitude, t_scale, timeLine, waveType) {

    waveType = setdefault(waveType, "cylindrical");
    var magnitudeFunc = function(m, i) {
        return m/(i+1);
    };

    var timeLine = this.setMovement(totalTime, delaySpeed, magnitude, t_scale, timeLine, waveType, magnitudeFunc);

    return timeLine;

}

SoundWave.prototype.setMovement = function(totalTime, delaySpeed, magnitude, t_scale, timeLine, waveType, magnitudeFunc) {
    magnitudeFunc = setdefault(
        magnitudeFunc,
        function(m, i) {
            return m/(i+1);
        }
    );
    waveType = setdefault(waveType, "cylindrical");
    timeLine = setdefault(timeLine, new TimelineLite({pause:true}));

    var that = this;

    function swPulse(m) {
        that._pulse(waveType, m, t_scale);
    }
    var iter_num = Math.round(totalTime *1.0 / delaySpeed);

    for (var i = 0; i < iter_num; i++) {
        var label = "+=" + delaySpeed;
        var m = magnitudeFunc(magnitude, i);
        timeLine = timeLine.call(swPulse, [m], that, label);
    }
    return timeLine;

}


SoundWave.prototype._pulse = function(waveType, magnitude, t_scale) {
    var t = this.t;
    var point = new THREE.Vector3();

    var positions = this.particles.geometry.attributes.position;
    for (var i = 0; i < positions.count; i++) {
        point.fromBufferAttribute(positions, i);

        var offset = this.displacement(waveType, magnitude, point.x, point.y, point.z, t*t_scale);
        positions.setXYZ(i, point.x + offset.x, point.y + offset.y, point.z + offset.z);
    }
    positions.needsUpdate = true;
    this.t += 1;
}

SoundWave.prototype.displacement = function(waveType, magnitude, x, y, z, t) {
    var offset = new THREE.Vector3();

    switch (waveType) {
        case "plane":
            offset.set( magnitude * Math.sin(x - t), 0, 0);
            return offset;

        case "cylindrical":
            if (x*x + y*y < 0.01) {
                return offset.set( 0, 0, 0);
            } else {
               var rho = Math.sqrt( x*x + y*y );
               var phi = Math.atan2(y, x);

               return offset.set(
                  magnitude * Math.cos(phi) * Math.sin(rho - t) / Math.sqrt(rho),
                  magnitude * Math.sin(phi) * Math.sin(rho - t) / Math.sqrt(rho),
                  0
               )
            }

        case "sphere":
            if (x*x + y*y + z*z < 0.01) {
                return offset.set( 0, 0, 0 );

            } else {
                var r = Math.sqrt( x * x + y * y + z * z );
                var theta = Math.acos( z / r );
                var phi = Math.atan2( y, x );

                return offset.set(
                    magnitude * Math.cos( phi ) * Math.sin( theta ) * Math.sin( r - t ) / r ,
                    magnitude * Math.sin( phi ) * Math.sin( theta ) * Math.sin( r - t ) / r ,
                    magnitude * Math.cos( theta ) * Math.sin( r - t ) / r
                );

            }

        case "random":
            return offset.set(
                magnitude * (Math.random()*2-1),
                magnitude * (Math.random()*2-1),
                0
            );
    }
}



