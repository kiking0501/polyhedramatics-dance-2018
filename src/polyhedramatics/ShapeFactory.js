var ShapeFactory = function(shape, color, x, y, z, rx, ry, rz) {
     this.shape = shape;
     this.color = color;
     this.x = x;
     this.y = y;
     this.z = z;
     this.rx = rx;
     this.ry = ry;
     this.rz = rz;

}
ShapeFactory.prototype.addShape = function(shapeType, extrudeSettings, texture) {
     switch(shapeType) {
          case "texture":
               var geometry = new THREE.ShapeBufferGeometry( this.shape );
               var mesh = new THREE.Mesh(
                    geometry,
                    new THREE.MeshPhongMaterial( {
                         side: THREE.DoubleSide,
                         map: texture
                    }));
               mesh.position.set(this.x, this.y, this.z);
               mesh.rotation.set(this.rx, this.ry, this.rz);
               return mesh;

          case "flat":
               var geometry = new THREE.ShapeBufferGeometry( this.shape );
               var mesh = new THREE.Mesh(
                    geometry,
                    new THREE.MeshPhongMaterial({
                         color: this.color,
                         side: THREE.DoubleSide
                    }))
               mesh.position.set(this.x, this.y, this.z);
               mesh.rotation.set(this.rx, this.ry, this.rz);
               return mesh;

          case "extrude":
               var geometry = new THREE.ExtrudeGeometry( this.shape, extrudeSettings);
               var mesh = new THREE.Mesh(
                    geometry,
                    new THREE.MeshPhongMaterial({
                         color: this.color,
                    })
               )
               mesh.position.set(this.x, this.y, this.z);
               mesh.rotation.set(this.rx, this.ry, this.rz);
               return mesh;
     }
}

ShapeFactory.prototype.constructor = ShapeFactory;

ShapeFactory.prototype.addLineShape = function(lineType, lineWidth, segNum, dotSize) {
     this.shape.autoClose = true;

     switch (lineType) {

          // solid line
          case "solid":

               var points = this.shape.getPoints();
               var geometryPoints = new THREE.BufferGeometry().setFromPoints( points )

               var line = new THREE.Line(
                    geometryPoints,
                    new THREE.LineBasicMaterial({
                         color: this.color,
                         linewidth: lineWidth
                    }));

               line.position.set(this.x, this.y, this.z);
               line.rotation.set(this.rx, this.ry, this.rz)
               return line;

          // line from equidistance sampled points
          case "segment":

               var spacedPoints = this.shape.getSpacedPoints( segNum );
               var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );

               var line = new THREE.Line(
                    geometrySpacedPoints,
                    new THREE.LineBasicMaterial({
                         color: this.color,
                         linewidth: lineWidth,
                    })
               );
               line.position.set(this.x, this.y, this.z);
               line.rotation.set(this.rx, this.ry, this.rz);
               return line;

          // vertices from real points
          case "dotted":

               var points = this.shape.getPoints();
               var geometryPoints = new THREE.BufferGeometry().setFromPoints( points )

               var particles = new THREE.Points(
                    geometryPoints,
                    new THREE.PointsMaterial({
                         color: this.color,
                         size: dotSize,
                    })
               );
               particles.position.set(this.x, this.y, this.z);
               particles.rotation.set(this.rx, this.ry, this.rz);
               return particles;

          // equidestance sampled points
          case "dotted2":
               var spacedPoints = this.shape.getSpacedPoints( segNum );
               var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );

               var particles = new THREE.Points(
                    geometrySpacedPoints,
                    new THREE.PointsMaterial({
                         color: this.color,
                         size: dotSize,
                    })
               );
               particles.position.set(this.x, this.y, this.z);
               particles.rotation.set(this.rx, this.ry, this.rz);
               return particles;

     }

}

