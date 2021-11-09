import userData from '../assets/data.json';

let data = userData

export function getData(){
    return data
}

export function updateData(value){
    data = value
    return data

}


export default data