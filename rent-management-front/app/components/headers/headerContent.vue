<template>
  <div class="header__content">
    <div class="header__title">
      <BaseReseachBox :model-value="inputResearch"/>
    </div>
    <div class="tools__framer flex gap-4 p-4">
      <moreButton btn_label="Nouveau"/>
      <roundedButton/>
      <profileButton :user="{ firstName: 'Jean Yves ', lastName: 'MIAKO' }"/>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import moreButton from '../buttons/moreButton.vue';
import profileButton from '../buttons/profileButton.vue';
import roundedButton from '../buttons/roundedButton.vue';
import BaseReseachBox from '../input/BaseReseachBox.vue';
export default {
  components: {
    moreButton,
    profileButton,
    roundedButton,
    BaseReseachBox
  },

  props: {
    title: {
      type: String,
      default: 'Mon tableau de bord'
    }
  },

  setup(){
    const inputResearch = ref('');

    return{
      inputResearch
    }
  }
}
</script>

<style scoped>
.header__content{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>