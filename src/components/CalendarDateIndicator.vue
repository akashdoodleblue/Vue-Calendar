<template>
  <div class="calendar-date-indicator">{{ selectedMonth }}</div>
</template>

<script>
export default {
  props: {
    selectedDate: {
      type: Date,
      required: true
    }
  },

  computed: {
    selectedMonth() {
      return this.selectedDate.toLocaleString('default', { month: 'long' }) + ' ' + this.selectedDate.getFullYear();
    }
  }
};
</script>

<style scoped>
.calendar-date-indicator {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--grey-00);
}
</style>

