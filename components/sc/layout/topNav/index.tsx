import moment from "moment"

export const DayTime=(date:any)=>{

    const dayTime=moment(date).format('LL')
    return dayTime
}

export const Today=()=>{

    let today=new Date()

    const date=moment().format('YYYY-MM-DD')
    const hour=moment().format('H')
    const thisWeek=moment().weekday(1).format('YYYY-MM-DD')
    const thisMonth=moment().format('YYYY')+'-'+moment().format('MM')+'-01'
    const yearsAgo=moment().subtract(5,"years").format('YYYY-MM-DD')
    

    let dayTime={
        date,hour,thisWeek,thisMonth,yearsAgo
    }
    return dayTime
}

