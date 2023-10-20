import moment from "moment"

export const DayTime=()=>{

    const dayTime=moment().format('LL')
    return dayTime
}