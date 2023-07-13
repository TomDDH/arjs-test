// import "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";

import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js'


const ThreeViewer = (
  container,
  setNeedScan,
  tragetUrl,
) => {
  // const THREE = window.MINDAR.IMAGE.THREE;
  // const mindarThree = new window.MINDAR.IMAGE.MindARThree({
  //   container: container,
  //   imageTargetSrc: `/assets/target.mind`,
  //   warmupTolerance: 10,
  //   filterMinCF: 500,
  //   uiError: "no",
  //   uiLoading: "no",
  //   uiScanning: "no",
  // });

  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc: tragetUrl,
    warmupTolerance: 10,
    filterMinCF: 10,
  });

  const { renderer, scene, camera } = mindarThree;


  let videoPlayed = false
  let isTracking = false
  const videoDiv = document.querySelector("#vidoe-texture");

  let playBtn
  let videoPlane
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.outputEncoding = THREE.sRGBEncoding;

  console.log(mindarThree)

  const anchor = mindarThree.addAnchor(0);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.2).translate(0, 0, 0.1), material);


  anchor.group.add(cube);

  anchor.onTargetFound = () => {
    setNeedScan(false);
    isTracking = true
  };

  anchor.onTargetLost = () => {
    console.log("lost target");
    setNeedScan(true);
    isTracking = false

  };

  // redirect-link
  function animate() {
    // cube.rotateZ(0.01);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  const start = async () => {
    await mindarThree.start();
    animate();
    setNeedScan(true)
  };
  start();
};

export default ThreeViewer;
