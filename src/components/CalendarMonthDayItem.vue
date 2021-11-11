<template>
<li
    @click="selectTimeSlot(day)"
    class="calendar-day"
    :class="{
      'calendar-day--not-current': !day.isCurrentMonth,
      'calendar-day--today': isToday
    }"
  >
 
    <span>{{ label }}</span>
 <div class="meetingDay" >
      <span v-for="(value,index) in meetingDay" :key="index">
        <button v-if="value.visible"  @click="onMeetinClicked($event,index)">{{`${value.data.fromTime} / ${value.data.title}`}}</button>
      </span>
    <div v-if="showModal">
        <EventModal
        @close="closeModal"
        @delete="deleteMeeting"
        :day="{date:day.date}"
        :currentUser="currentUser"
        :meeting="meetingDay[meetIndex].data"
        />
    </div>
 </div>
  </li>
  
</template>

<script>
import EventModal from "./EventModal";
export default {
  name: "CalendarMonthDayItem",
   components: {
     EventModal
   },
  data() {
    return {
      showModal : false,
      meetingDay : [],
      meetIndex : null
    };
  },
  mounted(){
       this.meetingDay  = this.meetingSlots.filter(e => e.date == this.day.date)
  },
  props: {
    day: {
      type: Object,
      required: true
    },

    isCurrentMonth: {
      type: Boolean,
      default: false
    },

    isToday: {
      type: Boolean,
      default: false
    },
    meetingSlots:{
      type : Array,
      default : []
    },
    currentUser:{
      type:Object
    }
  },
   watch: { 
        currentUser:function(newVal, oldVal){
          // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
          this.showMeeting(newVal)
        },
      	meetingSlots: function(newVal, oldVal) { // watch it
          //console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        this.showMeeting(newVal)
      }
   },   
  methods : {
    selectTimeSlot(day){
      //console.log(day)
      this.$emit("dateClicked", {popup:true});
    },
    onMeetinClicked(e,value){
      //e.preventDefault()
      e.stopPropagation()
      this.showModal =true
      this.meetIndex  = value
      //this.$emit('date',{popup : true})
    },
    deleteMeeting(value){
      this.showModal = false;
      this.$emit('delete',value);
    },
    closeModal(value){
        this.showModal = false
    },
    showMeeting(newVal){
    
            this.meetingDay = this.meetingSlots.filter(e => e.date == this.day.date)
            for(let i = 0; i < this.meetingDay.length; i++ ){
              if(this.meetingDay[i].data.access == 'Private' && (!this.meetingDay[i].data.guestList.includes(newVal.name)) && this.meetingDay[i].data.host != this.currentUser.name){
                  this.meetingDay[i]['visible'] = false
              }else{
                 this.meetingDay[i]['visible'] = true
              }
            }
          
    }
  },

  computed: {
    label() {
      return new Date(this.day.date).getDate();
    }
  }
};
</script>

<style scoped>
.calendar-day {
  position: relative;
  min-height: 100px;
  font-size: 16px;
  background-color: #fff;
  color: var(--grey-800);
  padding: 5px;
  overflow: hidden;
}

.calendar-day > span {
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;
  width: var(--day-label-size);
  height: var(--day-label-size);
}

.calendar-day--not-current {
  background-color: var(--grey-100);
  color: var(--grey-300);
}

.calendar-day--today {
  padding-top: 4px;
}

.calendar-day--today > span {
  color: #fff;
  border-radius: 9999px;
  background-color: var(--grey-800);
}

.meetingDay {
 width: 100%;
 max-height: 80px;
 display: flex;
 flex-direction: column;
 justify-content: end;
}

.meetingDay button{
      text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    width: 100% !important;
    border: none;
    background-color: #336699;
    color: white;
    padding: 4px;
    max-height: 24px;
    border-radius: 5px;
    font-weight: 550;
    margin-bottom: 2px;
}
</style>
