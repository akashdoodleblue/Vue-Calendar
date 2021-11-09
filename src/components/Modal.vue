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
                <div class="calendar-time">
                    <div v-for="i in time" :key="i" class="calendar-item" @click="calendarItemClicked(i)">
                        <div style="color:#5b5e65">{{i}}</div>
                            <div class="calendar-line"></div>	
                    </div>
                </div>
                <!-- <canvas ref="canvas" id="canvas" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp"></canvas> -->
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  default footer
                  <button class="modal-default-button" @click="$emit('close',false)">
                    OK
                  </button>
                </slot>
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
const time = ["01 am","02 am","03 am","04 am","05 am","06 am","07 am","08 am","09 am","10 am","11 am","12 pm","01 pm","02 pm","03 pm","04 pm","05 pm","06 pm"];
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
          ctx : '',
          rect : {},
          drag : false,
          eventModal: false,
          timeSlot:null
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
  // this.canvas = document.getElementById("canvas");
  // this.ctx = this.canvas.getContext("2d");  
  },
  methods : {
       mouseDown(e) { 
       this.rect.startX = e.offsetX;
        this.rect.startY = e.offsetY - 0 ;
       this.drag = true;
      },
    
       mouseUp() {
        this.drag = false;
        this.rect = {}
        //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      },
        mouseMove(e) {
        if (this.drag) {
            this.rect.w = (e.offsetX);
            this.rect.h = (e.offsetY );
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.draw();
        }
      },
        draw() {
        this.ctx.setLineDash([0]);
        this.ctx.strokeRect(this.rect.startX,this.rect.startY, -989, this.rect.h);
       },
       calendarItemClicked(i){
         this.timeSlot = i
         this.eventModal = true
       },
        closeModal(value){
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
  height: 600px;
  overflow-y: scroll
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

#canvas{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 95%;
    }

</style>
