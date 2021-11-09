<template>
<div class="calendar-date-group">
  <div class="account">
    <h3 style="margin-right : 10px">{{currentUser.name}}</h3>
  <select v-model="selected" @change="onChangeAccount($event)">
    <option :value="null" disabled>-- Accounts --</option>
      <option v-for="(account, index) in userData" :key="index" v-bind:value="account.id">{{account.name}}</option>   
  </select> 
  </div> 
  <div class="calendar-date-selector">
    <span @click="selectPrevious"> &#60; </span>
    <span >Today</span>
    <span @click="selectNext"> &#62; </span>
  </div>
</div> 
</template>

<script>
import data from '../helper/helper'

export default {
  name: "CalendarModeSelector",

  props: {
    currentDate: {
      type: String,
      required: true
    },

    selectedDate: {
      type: Date,
      required: true
    }
  },
  data(){
    return{
      selected : null,
      dataList : data,
      userData : data,
      currentUser : data[0]
    }
  },
  beforeMount(){
    this.selectAccounts
  },
  computed:{
    selectAccounts(){
      this.userData = this.dataList.filter(e => e.id != this.currentUser.id)
    }
  },
  methods: {
    selectPrevious() {
      let newSelectedDate = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() - 1));
      this.$emit("dateSelected", newSelectedDate);
    },

    selectCurrent() {
      let newSelectedDate = dayjs(this.currentDate);
      this.$emit("dateSelected", newSelectedDate);
    },

    selectNext() {
      let newSelectedDate = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() + 1))
      this.$emit("dateSelected", newSelectedDate);
    },
    onChangeAccount(){
      for(let i = 0; i <this.dataList.length; i++){
        if(this.dataList[i].id == this.selected){
          this.currentUser = this.dataList[i]
          break;
        }
      }
      this.selectAccounts
      this.selected=null
      this.$emit('switchAccount', this.currentUser)
    }
    
  }
};
</script>

<style scoped>
.calendar-date-selector {
  display: flex;
  justify-content: space-between;
  width: 80px;
  color: var(--grey-800);
}

.calendar-date-selector > * {
  cursor: pointer;
  user-select: none;
}
.calendar-date-group{
  display: flex;
  align-items: center;
  width: 35%;
  justify-content: space-between;
}
.account{
  display: flex;
  align-items: center;
}
</style>
