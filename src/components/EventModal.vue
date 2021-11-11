<template>
  <transition name="modal">
        <div class="modal-mask" @click.stop="">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                  <h2 v-if="meeting" @click="deleteMeeting" style="margin-right:25px">&#128465;</h2>
                  <h2 @click="closeModal">&#10006;</h2>
              </div>

              <div class="modal-body">
                <div class="calendar-body">
                  <div>  
                  <input class="input-title" v-model="eventData.title" placeholder="Add title" />
                  </div> 
                  <div class="meeting-item">
                    <p class="label">{{meetingDate}}</p>
                    <div class="value time-slot">
                      <select class="select-dropdown" v-model="eventData.fromTime">
                        <option v-for="i in timeRange" :key="i">{{i}}</option>
                      </select>
                       <p style="margin: 0 10px">  -  </p>
                        <select class="select-dropdown" v-model="eventData.toTime">
                        <option v-for="i in timeRange" :key="i">{{i}}</option>
                      </select>
                    </div>
                  </div>
                  <div class="meeting-item">
                    <label class="label">&#128113; Add guests</label>
                    <div class="guest-group">
                    <select class="select-dropdown" v-model="selected" @change="onGuestSelect($event)">
                       <option :value="null" disabled>-- Select --</option>
                      <option v-for="(guest, index) in dataList" :key="index">{{guest.name}}</option>   
                    </select>
                    <div class="guest-list" v-if="guestList.length > 0">
                      <div class="guest-item" v-for="i in guestList" :key="i">
                        <p>{{i}}</p> <span @click="removeGuest(i)" class="cross"> &#x2718;  </span>
                      </div>
                    </div>
                    <p v-if="showError" style="color : red">{{showError}}</p>
                    </div> 
                    
                  </div>
                  <div class="meeting-item">
                    <p class="label">&#128188; Privacy setting</p>
                    <div class="value time-slot">
                      <select class="select-dropdown" v-model="eventData.status">
                        <option value="Busy">Busy</option>
                        <option value="Free">Free</option>
                      </select>
                       <p style="margin: 0 10px">  </p>
                        <select class="select-dropdown" v-model="eventData.access">
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                  </div>
                  <div class="meeting-item">
                    <textarea class="description" v-model="eventData.description" placeholder="Add description"></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                  <button class="submit-btn" @click="onSubmit">Save</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
</template>

<script>
import data from '../helper/helper'
let userData = data;
export default {
  name: "EventModal",
   props: {
    day: {
      type: Object
    },
    time: {
      type : [String,Array]
    },
    meeting : {
      type : Object,
      default : null
    },
    currentUser:{
      type : Object
    }
  },  
  data(){
      return{
        dataList : JSON.parse(JSON.stringify(data)),
        guestList : [],
        meetingDate : null,
        selected: null,
        showError : null,
        removeGuestList : [],
        timeRange : [],
        timeSlots : [],
        eventData:{
          title : '',
          fromTime : '',
          toTime : '',
          status : 'Busy',
          access : 'Public',
          description: ''
        }
      }
      
  },
  mounted(){
    if(this.meeting){
        this.timeRange =  this.getTime()
        const { access , fromTime, guestList,status,title, toTime, description} = this.meeting
        this.guestList = this.meeting.guestList
        this.eventData = this.meeting
    }else{
      this.getFromTime;
    }
    this.dataList = this.dataList.filter(e => e.id != this.currentUser.id)

      this.getDate
  },
  computed: {
      getDate() {
      this.meetingDate =  new Date(this.day.date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })
    }, 
    getFromTime(){
      this.getTime()
      console.log(typeof this.time)
      if(typeof this.time == 'object'){
          let arr = this.timeSlots.slice()
          let time = this.time[0].split(" ")
          let index = arr.findIndex(e => (e.substring(0,2) == time[0] && e.substring(e.length - 2) == time[1]))
          this.eventData.fromTime = arr[index]
          if(this.time[1]){
            time = this.time[1].split(" ")
            index = arr.findIndex(e => (e.substring(0,2) == time[0] && e.substring(e.length - 2) == time[1]))
            this.eventData.toTime = arr[index]
          }else{
            this.eventData.toTime = arr[index + 1]  
          }
          
          this.timeRange = arr
      }else{
          let arr = this.timeSlots.slice()
          let time = this.time.split(" ")
          let index = arr.findIndex(e => (e.substring(0,2) == time[0] && e.substring(e.length - 2) == time[1]))
          this.eventData.fromTime = arr[index]
          this.eventData.toTime = arr[index + 1]
          this.timeRange = arr
      }

    },
  }, 
  methods : {
      onGuestSelect(e){
        this.showError = null
        if(this.guestList.length == 10){
          this.showError = 'No more guest can be added'
          return
        }
        let index
        for(let j = 0; j < userData.length; j++){
            if(userData[j].name == e.target.value){
              index = j
              break;
            }
        }
        let fromTimeMiliSeconds = new Date(`${this.day.date} ${this.eventData.fromTime}`).getTime()
        let toTimeMiliSeconds = new Date(`${this.day.date} ${this.eventData.toTime}`).getTime()
        console.log("fromTimeMiliSeconds",fromTimeMiliSeconds)
        console.log("toTimeMiliSeconds",toTimeMiliSeconds)
        let user = userData[index]
        console.log(user)
        for(let i = 0; i < user.slots.length; i++){
            let time = user.slots[i].split('-')
            if(time[0] >= fromTimeMiliSeconds || time[1] >= toTimeMiliSeconds){
              this.selected = null
              this.showError = `${user.name} is already alloted for this time slot.`
              return false
            } 
        }
        user.slots.push(`${new Date(`${this.day.date} ${this.eventData.fromTime}`).getTime()}-${new Date(`${this.day.date} ${this.eventData.toTime}`).getTime()}`)
        userData[index] = user
        this.guestList.push(e.target.value)
        this.selected = null
       let removedItem = this.dataList.splice(this.dataList.findIndex(i => i.name === e.target.value), 1)
       this.removeGuestList.push(removedItem[0])
      },
      closeModal(e,data){
        e.stopPropagation()
        this.dataList = this.data
        this.$emit('close',data)
      },
      removeGuest(item){
         if(this.guestList.length == 10){
          this.showError = null
        }
        let addItem = this.removeGuestList.splice(this.removeGuestList.findIndex(i => i.name === item), 1)
        this.dataList.push(addItem[0])
        this.guestList.splice(this.guestList.indexOf(item),1)
      },
      onSubmit(e){
        let data = {date : this.day.date ,data : {id : Date.now(),...this.eventData, guestList : this.guestList, host : this.currentUser.name}}
        this.closeModal(e,data)
      },
      deleteMeeting(e){
        e.stopPropagation()
        this.$emit('delete',this.eventData)
      },
      getTime(){
        let arr = []
        let j = 1
          while(j < 12){
             if(j < 10){
              arr.push(`0${j}:00 am`)
              arr.push(`0${j}:30 am`)
            }else{
              arr.push(`${j}:00 am`)
              arr.push(`${j}:30 am`)
            }
            j++
          }
          arr.push(`${12}:00 pm`)
          arr.push(`${12}:30 pm`)
          j = 1
          while(j < 12){
             if(j < 10){
              arr.push(`0${j}:00 pm`)
              arr.push(`0${j}:30 pm`)
            }else{
              arr.push(`${j}:00 pm`)
              arr.push(`${j}:30 pm`)
            }
            j++
          }
          this.timeSlots = arr
          return arr      
    }
  }
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width:600px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header{
  height: 45px;
  background-color: #f1f3f4;
  display: flex;
    align-items: center;
    justify-content: end;
}

.modal-header h2 {
    margin: 0;
    margin-right: 10px;
}

.modal-header h2:hover{
  cursor: pointer;
}

.modal-body {
  position: relative;
  margin-top: 10px;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.header{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: left;
    align-items: center;
    height: 36px;
}

.calendar-body{
  padding : 20px
}

.label{
  text-align: left;
  flex-basis: 40%;
}

.input-title{
  outline: 0;
  width: 100%;
  border-width: 0 0 2px;
  border-color: #e1e2e6;
  font-size: 24px;
}
.input-title:focus {
  border-color: black
}
.meeting-item{
  display: flex;
  margin: 10px 0;
}

.time-slot{
  display: flex;
  align-items: center;
}


.guest-list{
  display: flex;
  margin-top: 10px;
   flex-wrap: wrap;
}
.guest-item{
    padding: 5px 15px;
    margin: 0px;
    display: flex;
    align-items: center;
    color: white;
    background-color: #336699;
    margin-right: 10px;
    margin-bottom: 5px;
    border-radius: 4px;
}
.guest-item p {
  margin:  0;
  margin-right: 10px ;
}
.guest-item span{
  border-radius: 50%;
  border-color: white;
  display: none;
}
.guest-item:hover > .cross{
  display: block;
}
.guest-item span:hover {
  cursor: pointer;
}
.guest-group{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-basis: 50%;
}

.description{
  padding: 5px;
  width: 100%;
  height: 100px;
}
.submit-btn{
  background-color: #2c3e50;
    color: white;
    padding: 8px 19px;
    border: none;
    font-size: 17px;
    border-radius: 4px;
}

.modal-footer{
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
.select-dropdown{
  padding: 3px
}

</style>
