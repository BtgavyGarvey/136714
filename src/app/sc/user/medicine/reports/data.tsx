import authOptions from "@/app/api/auth/[...nextauth]/options"
import { getReportData } from "@/app/api/v1/controller/medicine/route"
import { getServerSession } from "next-auth"
import sugar from 'sugar'
import { Today } from "../../../../../../components/sc/layout/topNav"
import axios from "axios"


function formatDate(inputDate:any) {
  const parts = inputDate.split('-');
  if (parts.length === 3) {

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    const newDate = new Date(`${month}/${day}/${year}`);

    const formattedDate = newDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    
    return formattedDate;
  } else {
    return 'Invalid date format';
  }
}


export const DateWeek=(day:any)=>{

  let date=new Date(day)
  const year=date.getFullYear()
  const month=date.getMonth()

  const firstDay = new Date(year, month, 1);
  const daysOffset = firstDay.getDay();
  const dayOfMonth = date.getDate();

  let weekNumber=Math.ceil((dayOfMonth + daysOffset) / 7);
  

  let data={
    weekNumber,
    year,
    month: month + 1
  }
  
  return data

}


export const ReportData=async()=>{

    const session = await getServerSession(authOptions)
  
    if (session && session.user) {
  
      let id=session.user.id
  
      let result=await getReportData(id)

      let dateHour= Today()

      let data: { date: any; hour: any; batchNumber: any; medicineName: any; saleAmount: any; medicineCategory: any; quantitySold: any }[]=[]

      let dayReport: any[]=[]
      let hourReport: any[]=[]
      let weekReport: any[]=[]
      let monthReport: any[]=[]
      let yearReport: any[]=[]
      let last5YearsReport: any[]=[]
      let indexOfObjectHour:any
      let indexOfObjectDay:any
      let indexOfObjectWeek:any
      let indexOfObjectMonth:any
      let indexOfObjectYear:any
      let indexOfObjectlast5Years:any

      let monthYear=DateWeek(dateHour.date)

      if (result.reports) {
        result.reports.map((result:any)=>{

            let documents=result.documents

            documents.map((result:any)=>{

                let details=result.details
                
                let weekNo=DateWeek(details.date)

                data.push(
                    {
                      date:details.date,
                      hour:details.moreDateDetails.hour,
                      batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                      medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                      saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                      medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                      quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                    }
                  )

                  let objectToBeAdded={
                    date:details.date,
                    weekNumber:weekNo.weekNumber,
                    month:weekNo.month,
                    year:weekNo.year,
                    hour:details.moreDateDetails.hour,
                    batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                    medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                    saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                    medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                    quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                  }
    
                  indexOfObjectHour=hourReport.findIndex((item)=>(item.batchNumber === objectToBeAdded.batchNumber && item.hour === objectToBeAdded.hour && item.date === objectToBeAdded.date))
                  indexOfObjectDay=dayReport.findIndex((item)=>(item.date === objectToBeAdded.date && item.hour === objectToBeAdded.hour))
                  indexOfObjectWeek=weekReport.findIndex((item)=>(dateHour.thisWeek <= objectToBeAdded.date && item.date === objectToBeAdded.date))
                  indexOfObjectMonth=monthReport.findIndex((item)=>(item.weekNumber === objectToBeAdded.weekNumber && item.month === weekNo.month && item.year === weekNo.year))
                  indexOfObjectYear=yearReport.findIndex((item)=>(item.month === weekNo.month && item.year === weekNo.year))
                  indexOfObjectlast5Years=last5YearsReport.findIndex((item)=>(item.year === weekNo.year))
                  
                  if (objectToBeAdded.date===dateHour.date) {
                    if (indexOfObjectHour > -1) {
                      hourReport[indexOfObjectHour].saleAmount +=objectToBeAdded.saleAmount
                      hourReport[indexOfObjectHour].quantitySold +=objectToBeAdded.quantitySold
                    } else {
                      hourReport.push(
                        {
                          date:details.date,
                          hour:details.moreDateDetails.hour,
                          batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                          medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                          saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                          medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                          quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                        }
                      )
                    }

                    if (indexOfObjectDay >-1) {
                      dayReport[indexOfObjectDay].saleAmount +=objectToBeAdded.saleAmount
                      dayReport[indexOfObjectDay].quantitySold +=objectToBeAdded.quantitySold
                    } else {
                      dayReport.push(
                        {
                          date:details.date,
                          hour:details.moreDateDetails.hour,
                          batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                          medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                          saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                          medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                          quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                        }
                      )
                    }
                  }

                  if (dateHour.thisWeek <= objectToBeAdded.date) {
                    if (indexOfObjectWeek > -1) {
                      weekReport[indexOfObjectWeek].saleAmount +=objectToBeAdded.saleAmount
                      weekReport[indexOfObjectWeek].quantitySold +=objectToBeAdded.quantitySold
                    } else {
                      weekReport.push(
                        {
                          date:details.date,
                          hour:details.moreDateDetails.hour,
                          batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                          medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                          saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                          medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                          quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                        }
                      )
                    }
                  }

                  if (monthYear.month===objectToBeAdded.month) {
                    if (indexOfObjectMonth >-1) {
                      monthReport[indexOfObjectMonth].saleAmount +=objectToBeAdded.saleAmount
                      monthReport[indexOfObjectMonth].quantitySold +=objectToBeAdded.quantitySold
                    } else {
                      monthReport.push(
                        {
                          date:details.date,
                          hour:details.moreDateDetails.hour,
                          weekNumber:weekNo.weekNumber,
                          month:weekNo.month,
                          year:weekNo.year,
                          batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                          medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                          saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                          medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                          quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                        }
                      )
                    }
                  }
                  
                  
                  if (indexOfObjectYear >-1) {
                    yearReport[indexOfObjectYear].saleAmount +=objectToBeAdded.saleAmount
                    yearReport[indexOfObjectYear].quantitySold +=objectToBeAdded.quantitySold
                  } else {
                    yearReport.push(
                      {
                        date:details.date,
                        hour:details.moreDateDetails.hour,
                        weekNumber:weekNo.weekNumber,
                        month:weekNo.month,
                        year:weekNo.year,
                        batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                        medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                        saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                        medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                        quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                      }
                    )
                  }
                  
                  if (indexOfObjectlast5Years >-1) {
                    last5YearsReport[indexOfObjectlast5Years].saleAmount +=objectToBeAdded.saleAmount
                    last5YearsReport[indexOfObjectlast5Years].quantitySold +=objectToBeAdded.quantitySold
                  } else {
                    last5YearsReport.push(
                      {
                        date:details.date,
                        hour:details.moreDateDetails.hour,
                        weekNumber:weekNo.weekNumber,
                        month:weekNo.month,
                        year:weekNo.year,
                        batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                        medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                        saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                        medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                        quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
                      }
                    )
                  }
            })

        })

        hourReport.sort((a, b) => b.saleAmount - a.saleAmount);

        const topSalesByHour = {};

        for (const sale of hourReport) {
        const { hour, saleAmount } = sale;

        if (!topSalesByHour[hour]) {
            topSalesByHour[hour] = [];
        }

        if (topSalesByHour[hour].length < 5) {
            topSalesByHour[hour].push(sale);
        }
        }

        // Flatten the top sales for each hour into a single array
        hourReport = Object.values(topSalesByHour).reduce(
            (acc, sales) => [...acc, ...sales],
            []
        );

        let report=[
            hourReport,dayReport,weekReport,monthReport,yearReport,last5YearsReport
        ]

        return report
        
      }
      
    }
  
}