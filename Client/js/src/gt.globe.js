gt.Globe = function (radius, widthSegments, heightSegments, material, cloudMaterial) {
  
  //initialize earth geometry

  this.geometry = geometry = THREE.SphereGeometry.call( this );

  this.radius = radius = radius || 200;

  this.widthSegments = widthSegments = Math.max( 3, Math.floor( widthSegments ) || 40 );
  this.heightSegments = heightSegments = Math.max( 2, Math.floor( heightSegments ) || 30 );
  this.material = material = material || new THREE.MeshPhongMaterial();
  this.matrixAutoUpdate = matrixAutoUpdate = false;
  this.globeMesh = globeMesh = new THREE.Mesh(this.geometry, this.material);

  //initialize cloud geometry
  this.cloudRadius = cloudRadius = this.radius * 102;
  this.cloudGeometry = cloudGeometry = new THREE.SphereGeometry(cloudRadius, 32, 32);
  this.cloudMaterial = cloudMaterial = cloudMaterial;
  this.cloudMesh = new THREE.Mesh(this.cloudGeometry, this.cloudMaterial);

  //initialize earth group object
  this.earth = earth = new THREE.Object3D();
};

gt.Globe.prototype = {
	constructor: gt.Globe(),
	init: function () {		
		this.globeMesh.updateMatrix();
		this.earth.add(globeMesh);
		this.earth.add(cloudMesh);
		this.scene.add(earth);
    },

    material: function ({map:diffuseTexture, bumpMap: bumpTexture, specularMap: specularTexture}) {
    	THREE.MeshPhongMaterial.call(this);
    	this.map = THREE.ImageUtils.loadTexture( diffuse );
    	this.bumpMap = THREE.ImageUtils.loadTexture(bump);
    	this.specularMap = THREE.ImageUtils.loadTexture(specularTexture);

    },
    cloudMaterial: function (cloudTexture){
      new THREE.MeshPhongMaterial({
        map     : THREE.ImageUtils.loadTexture(cloudTexture),
        side        : THREE.DoubleSide,
        opacity     : 0.8,
        transparent : true,
        depthWrite  : false
    };
}




