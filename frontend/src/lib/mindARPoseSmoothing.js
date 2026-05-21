let registered = false;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const registerMindARPoseSmoothing = () => {
  if (typeof window === "undefined" || !window.AFRAME || !window.THREE) return false;
  if (registered || window.AFRAME.components["webar-pose-smoothing"]) {
    registered = true;
    return true;
  }

  const THREE = window.THREE;

  window.AFRAME.registerComponent("webar-pose-smoothing", {
    schema: {
      enabled: { type: "boolean", default: true },
      amount: { type: "number", default: 0.72 },
      positionDeadband: { type: "number", default: 0.0015 },
      rotationDeadband: { type: "number", default: 0.18 }
    },

    init() {
      this.rawPosition = new THREE.Vector3();
      this.rawQuaternion = new THREE.Quaternion();
      this.rawScale = new THREE.Vector3();
      this.smoothedPosition = new THREE.Vector3();
      this.smoothedQuaternion = new THREE.Quaternion();
      this.smoothedScale = new THREE.Vector3();
      this.composedMatrix = new THREE.Matrix4();
      this.initialized = false;

      this.reset = () => {
        this.initialized = false;
      };

      this.el.addEventListener("targetFound", this.reset);
      this.el.addEventListener("targetLost", this.reset);
    },

    remove() {
      this.el.removeEventListener("targetFound", this.reset);
      this.el.removeEventListener("targetLost", this.reset);
    },

    tick() {
      if (!this.data.enabled || !this.el.object3D.visible) {
        this.initialized = false;
        return;
      }

      const object = this.el.object3D;
      object.matrix.decompose(this.rawPosition, this.rawQuaternion, this.rawScale);

      if (!this.initialized) {
        this.smoothedPosition.copy(this.rawPosition);
        this.smoothedQuaternion.copy(this.rawQuaternion);
        this.smoothedScale.copy(this.rawScale);
        this.initialized = true;
      } else {
        const alpha = clamp(1 - this.data.amount, 0.05, 1);
        const positionDistance = this.smoothedPosition.distanceTo(this.rawPosition);
        const rotationDistance = this.smoothedQuaternion.angleTo(this.rawQuaternion);
        const rotationDeadband = THREE.MathUtils.degToRad(this.data.rotationDeadband);

        if (positionDistance > this.data.positionDeadband) {
          this.smoothedPosition.lerp(this.rawPosition, alpha);
        }

        if (rotationDistance > rotationDeadband) {
          this.smoothedQuaternion.slerp(this.rawQuaternion, alpha);
        }

        this.smoothedScale.lerp(this.rawScale, alpha);
      }

      this.composedMatrix.compose(
        this.smoothedPosition,
        this.smoothedQuaternion,
        this.smoothedScale
      );
      object.matrix.copy(this.composedMatrix);
      object.matrix.decompose(object.position, object.quaternion, object.scale);
      object.matrixAutoUpdate = false;
      object.updateMatrixWorld(true);
    }
  });

  registered = true;
  return true;
};
