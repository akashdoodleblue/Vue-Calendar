<template>
<div>
  <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <h2>{{getDate}}</h2>
                <h3 @click="$emit('close',false)">&#10006;</h3>
              </div>

              <div class="modal-body">
                <div class="calendar-time" id="calendar-time"  @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp">
                    <div v-show="showBox" class="drag-calendar" ref="d-calendar" id="d-calendar">
                      <p class="inner-time">{{typeof timeSlot == 'object' ?  `${timeSlot[0]} - ${timeSlot[1] || ''}` :  ''}}</p>
                    </div>
                    <div v-for="(i,index) in time" :key="index" class="calendar-item" @click="calendarItemClicked(i)">
                        <div class="calendar-slot" style="color:#5b5e65">{{i}}</div>
                            <div class="calendar-line"></div>	
                    </div>
                </div>
                <!-- <canvas ref="canvas" id="canvas" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas> -->
              </div>
            </div>
          </div>
        </div>
      </transition>
       <div v-if="eventModal">
        <EventModal
        :day="day"
        :time="timeSlot"
        :currentUser="currentUser"
        @close="closeModal"
        />
    </div>
</div>  
</template>

<script>
import EventModal from "./EventModal";
var calendarBox
const time = ["01 am","02 am","03 am","04 am","05 am","06 am","07 am","08 am","09 am","10 am","11 am","12 pm","01 pm","02 pm","03 pm","04 pm","05 pm","06 pm","07 pm","08 pm","09 pm","10 pm","11 pm"];
let Xstart
let Ystart
export default {
  name: "Modal",
   components: {
     EventModal
   },
  props: {
    day: {
      type: Object,
      required: true
    },
    currentUser:{
      type : Object
    }
  },  
  data(){
      return{
          canvas : null,
          drag : false,
          showBox:false,
          eventModal: false,
          timeSlot:''
      }
  },
  computed: {
    time() {
      return time;
    }, 
    getDate() {
      return new Date(this.day.date).toLocaleDateString("en-US", { weekday: 'long', year:'numeric', month: 'long', day: 'numeric' })
    }
  },
  mounted(){
   this.canvas = document.getElementById("d-calendar");
   calendarBox = document.getElementById("calendar-time");
  },
  methods : {
       mouseDown(e) { 
        this.drag = true;
        this.showBox = true
        Xstart = e.pageX - 5
        Ystart = e.pageY - 5
        this.canvas.style.top = `${e.layerY - 5}px`
        this.canvas.style.left = `60px`
       
        
      },
    
       mouseUp(e) {
         this.canvas.style.top = this.canvas.style.top;
         this.canvas.style.left = '60px';
          if(typeof this.timeSlot == 'string'){
            this.canvas.style.height = '0px'
            this.canvas.style.width = '0px'
          }else{
            this.canvas.style.height = this.canvas.style.height;
            this.canvas.style.width = this.canvas.style.width;
          }
          this.drag = false;
         setTimeout(() =>{
            this.eventModal = true
        },500);
      },
        mouseMove(e) {
        if (this.drag) {
          if(e.target.children.length > 0  && e.target.children[0].innerHTML.length == 5){
            if(this.timeSlot.length == 0){
              this.timeSlot = [e.target.children[0].innerHTML]
            }else if(this.timeSlot.length == 2){
              this.timeSlot[1] = (e.target.children[0].innerHTML)
            }else{
              this.timeSlot.push(e.target.children[0].innerHTML)
            }
            
          }
          if (e.pageX > Xstart) {
                this.canvas.style.width = calendarBox.offsetWidth - 60 + 'px'
            } else {
                this.canvas.style.left = 60 + 'px'
                this.canvas.style.width = calendarBox.offsetWidth - 60 + 'px'
            }
            if (event.pageY > Ystart) {
                this.canvas.style.height = e.pageY-Ystart + 'px'
            } else {
                this.canvas.style.top = e.pageY + 'px'
                this.canvas.style.height = Ystart-e.pageY + 'px'
            }
        }
      },
       calendarItemClicked(i){
         this.timeSlot = i
         this.eventModal = true
       },
        closeModal(value){
             this.showBox = false
             this.canvas.style.height = '0px'
             this.canvas.style.width = '0px'
             this.canvas.style.top = '0px'
             this.canvas.style.left = '0px'
             this.timeSlot = ''
        this.eventModal = false
        this.$emit('close',value)
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
  width: 95%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  height: 100%;
  overflow-y: scroll;
}

.modal-header{
  border-bottom: 0.5px solid #b4b8c1;
  display: flex;
  justify-content: space-between;
}
.modal-header h2 {
 text-align: left;
}

.modal-header h3:hover {
 cursor: pointer;
}
.modal-body {
  position: relative;
  margin: 20px 0;
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
.calendar-time{
  position: relative;
}
.calendar-item{
	display: flex;
  padding: 6px;
  margin-bottom: 10px;
}

.calendar-line{
 border-bottom: 0.5px solid #e9eaec;
 width:95%;
 height : 16px;
 
}
.drag-calendar{
  background-color: #336699;
  border-radius: 5px;
  position: absolute;
}

.inner-time{
  display: flex;
    margin-left: 20px;
    color: white;
}
.calendar-slot{
  user-select: none;
}


</style>
