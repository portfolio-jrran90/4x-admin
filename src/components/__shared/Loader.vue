<template>
  <div>
    <img src="@/assets/logo.png">
    <span>{{ message }} ...</span>
    <!-- https://codepen.io/thetallweeks/pen/yybGra -->

    <!-- Note: -->
    <!-- should have a cut off like 10seconds, then cut off connection -->
    <!-- axios -->
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String }
  },
  created() {
    // Note: if destroyed? should make it able again
    /*// disable tab function
    window.onkeydown = function(e) {
      if (e.keyCode == 9) return false
    }*/
  }
}
</script>

<style lang="scss" scoped>
div {
  position: fixed; left: 0; top: 0; z-index: 999999;
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(0,0,0, .8); color: #fff;
  font-size: 25px;

  img { width: 150px; margin-bottom: 10px }
}
</style>