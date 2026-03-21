<template>
  <div class="header__content">
    <div class="header__title">
      <h3>Mon tableau de bord</h3>
    </div>
    <div class="tools__framer flex gap-4 p-4">
      <moreButton btn_label="Nouveau"/>
      <profileButton :user="{ firstName: 'Jean Yves ', lastName: 'MIAKO' }"/>
    </div>
  </div>
</template>

<script>
import moreButton from '../buttons/moreButton.vue';
import profileButton from '../buttons/profileButton.vue';
export default {
  components: {
    moreButton,
    profileButton
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

.header__title h3{
  font-size: medium;
  font-weight: 600;
  color: #215083;
}
</style>