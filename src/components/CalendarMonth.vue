<template>
  <div>  
  <div class="calendar-month">
    <div class="calendar-month-header">
      <CalendarDateIndicator
        :selected-date="selectedDate"
        class="calendar-month-header-selected-month"
      />

      <CalendarDateSelector
        :current-date="today"
        :selected-date="selectedDate"
        @switchAccount="onAccountSwitch"
        @dateSelected="selectDate"
      />
    </div>

    <CalendarWeekdays/>

    <ol class="days-grid">
      <CalendarMonthDayItem
        v-for="day in days"
        :key="day.date"
        :day="day"
        :meetingSlots="meetingSlots"
        :currentUser="currentUser"
        :is-today="day.date === today"
        @delete="deleteMeeting"
        @dateClicked="openModal(true,day)"
      />
    </ol>
   </div>
    <div v-if="showModal">
        <Modal
        @close="closeModal"
        :currentUser="currentUser"
        :day="day"
        />
    </div>
  </div>
</template>

<script>
import CalendarMonthDayItem from "./CalendarMonthDayItem";
import CalendarWeekdays from "./CalendarWeekdays";
import CalendarDateIndicator from "./CalendarDateIndicator";
import CalendarDateSelector from "./CalendarDateSelector";
import Modal from "./Modal";
import data from '../helper/helper'


export default {
    
  name: "CalendarMonth",

    components: {
    CalendarMonthDayItem,
    CalendarDateIndicator,
    CalendarWeekdays,
    CalendarDateSelector,
    Modal
  }, 
  data() {
    return {
      selectedDate: new Date(),
      showModal: false,
      day : null,
      meetingSlots : [],
      currentUser : data[0]
    };
  },
  computed: {
    days() {
      return [
        ...this.previousMonthDays,
        ...this.currentMonthDays,
        ...this.nextMonthDays,
      ];
    },

    today() {
      return this.selectedDate.toISOString().split('T')[0]
    },

    month() {
        const month = Number(this.selectedDate.getMonth() + 1)

      return month < 10 ? '0'+month : month;
    },

    year() {
      return Number(this.selectedDate.getFullYear());
    },

    numberOfDaysInMonth(year, month) {

        return new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate()
    },

    currentMonthDays() {      
      return [...Array(this.numberOfDaysInMonth)].map((day, index) => {
        return {
            //new Date(`${this.year}-${this.month}-${index + 1}`).toISOString().split('T')[0]
          date:new Date(`${this.year}-${this.month}-${index + 1 < 10 ? '0' + (index + 1) : index + 1}`).toISOString().split('T')[0],
          isCurrentMonth: true
        };
      });
    },

    previousMonthDays() {
        let d = new Date(`${this.year}-${this.month}-01`);
      const firstDayOfTheMonthWeekday = this.getWeekday(
        this.currentMonthDays[0].date
      );
      const previousMonth = new Date(d.setMonth(d.getMonth() - 1));


      // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
        ? firstDayOfTheMonthWeekday - 1
        : 6;
        
      const previousMonthLastMondayDayOfMonth =  this.lastday(this.year, this.month - 1) - visibleNumberOfDaysFromPreviousMonth + 1
    
      return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
          return {
            date: new Date(
              `${previousMonth.getFullYear()}-${ (previousMonth.getMonth() + 1) < 10 ? "0" +  (previousMonth.getMonth()  +1 )  : previousMonth.getMonth()  + 1}-${previousMonthLastMondayDayOfMonth + index}`
            ).toISOString().split('T')[0],
            isCurrentMonth: false
          };
        });
    },

    nextMonthDays() {
        let d = new Date(`${this.year}-${this.month}-01`);
      const lastDayOfTheMonthWeekday = this.getWeekday(
        `${this.year}-${this.month}-${this.currentMonthDays.length}`
      );

      const nextMonth = new Date(d.setMonth(d.getMonth() + 1));

      const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
        ? 7 - lastDayOfTheMonthWeekday
        : lastDayOfTheMonthWeekday;
      return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
          date: new Date(
            `${nextMonth.getFullYear()}-${(nextMonth.getMonth() + 1) < 10 ? '0' + (nextMonth.getMonth() + 1)  : (nextMonth.getMonth() + 1)}-${index + 1 < 10 ? '0' + (index + 1) : index + 1}`
          ).toISOString().split('T')[0],
          isCurrentMonth: false
        };
      });
    }
  },

  methods: {
    getWeekday(date) {
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek;
    },

    lastday(y,m){
        return  new Date(y, m, 0).getDate();
    },

    selectDate(newSelectedDate) {
      this.selectedDate = newSelectedDate;
    },
    openModal(value,day){
        this.day = day
        this.showModal = true
    },
    deleteMeeting(value){
      let index = this.meetingSlots.findIndex(e => e.data.id == value.id)
      this.meetingSlots.splice(index , 1)
      this.meetingData  = this.meetingSlots.slice()
      this.showModal = false
    },
    closeModal(value){
      if(value == undefined){
         return
      }else if(value.data){
          this.meetingSlots.push(value)
          this.meetingData  = this.meetingSlots.slice()  
      }
      this.showModal = false
    },
    onAccountSwitch(value){
      this.currentUser = value
    }
  }
};
</script>

<style scoped>
.calendar-month {
  position: relative;
  background-color: var(--grey-200);
  border: solid 1px var(--grey-300);
}

.day-of-week {
  color: var(--grey-800);
  font-size: 18px;
  background-color: #fff;
  padding-bottom: 5px;
  padding-top: 10px;
}

.day-of-week,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
  text-align: right;
  padding-right: 5px;
}

.days-grid {
  height: 100%;
  position: relative;
  grid-column-gap: var(--grid-gap);
  grid-row-gap: var(--grid-gap);
  border-top: solid 1px var(--grey-200);
}
</style>
