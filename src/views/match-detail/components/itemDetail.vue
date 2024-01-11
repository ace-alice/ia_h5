<script lang="ts">
import { defineComponent, ref } from 'vue'
import teamBox from './teamBox.vue'
export default defineComponent({
  name: 'ItemDetail',
  components: { TeamBox: teamBox },
  props: {
    playInfo: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    return {}
  },
})
</script>

<template>
  <div class="game-card-row-content">
    <TeamBox
      v-for="(team, index) in playInfo.team_points"
      :key="`${team.id}-${team.status}-${team.odds}`"
      :index="index ? index : undefined"
      :item-info="playInfo"
    />
  </div>
</template>

<style scoped lang="scss"></style>
