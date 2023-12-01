'use client'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
// import { Data } from "../../../../../components/data";
import { useRouter } from "next/navigation"
import PieChart from "./pieChart";
import React from "react";
import LineChart, {LineChartTimeFrame} from "./lineChart";
import BarChart from "./barChart";
import PolarAreaChart from "./polarArea";
import ScatterChart from "./scatterChart";
import BubbleChart from "./bubleChart";
import DoughnutChart from "./doughnutChar";
import RadarChart from "./radarChart";
import { ReportData } from "../../../../../src/app/sc/user/medicine/reports/data";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

export default function ViewPredictionPage({pharm, data=[]}:any) {

  let [Data, setData]=React.useState(null)
  // const [chartData, setChartData] = React.useState([])

  // console.log(data);

  const customColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(255, 0, 0, 0.6)",
    "rgba(0, 255, 0, 0.6)",
    "rgba(0, 0, 255, 0.6)",
    "rgba(255, 255, 0, 0.6)",
  ];

  const getReportData=async()=>{

    let response=await axios.get(`/api/v1/controller/medicine?action=getStatisticReport&id=${pharm.id}`)

    if (response.data.success) {

      setData(response.data.reports)

    }
    else{

    }
  }

  const ReportData=async()=>{
  
    let data: { date: any; hour: any; batchNumber: any; medicineName: any; saleAmount: any; medicineCategory: any; quantitySold: any }[]=[]

    let dayReport: any[]=[]
    let hourReport: any[]=[]


    if (Data) {
      Data.map((result:any)=>{

          let documents=result.documents

          documents.map((result:any)=>{

              let details=result.details

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
                  hour:details.moreDateDetails.hour,
                  batchNumber:details.moreDateDetails.moreHourDetails.batchNumber,
                  medicineName:details.moreDateDetails.moreHourDetails.medicineName,
                  saleAmount:details.moreDateDetails.moreHourDetails.saleAmount,
                  medicineCategory:details.moreDateDetails.moreHourDetails.medicineCategory,
                  quantitySold:details.moreDateDetails.moreHourDetails.quantitySold,
      
              }
              

              const indexOfObjectHour=hourReport.findIndex((item)=>(item.batchNumber === objectToBeAdded.batchNumber && item.hour === objectToBeAdded.hour && item.date === objectToBeAdded.date))
              const indexOfObjectDay=dayReport.findIndex((item)=>(item.date === objectToBeAdded.date && item.hour === objectToBeAdded.hour))

              console.log(indexOfObjectDay);

              if (indexOfObjectHour > -1) {
                hourReport[indexOfObjectHour].saleAmount +=objectToBeAdded.saleAmount
              // console.log(hourReport);
                  
              } else {
                hourReport=hourReport.concat(objectToBeAdded)

              }

              if (indexOfObjectDay >-1) {
                dayReport[indexOfObjectDay].saleAmount +=objectToBeAdded.saleAmount
                  
              } else {
                dayReport=[...dayReport,objectToBeAdded]
              }

              // console.log(data);
              // console.log(dayReport);

          })
      })

      // setChartData(hourReport)

      console.log(dayReport);
              // console.log(hourReport);
              // console.log(data);
    }
      
  }

  ReportData()

  let dateInput1=React.useRef()
  let dateInput2=React.useRef()


  React.useEffect(()=>{
    var today = new Date().toISOString().split('T')[0];
    dateInput1.current.setAttribute('min', today);
    dateInput2.current.setAttribute('min', today);
  },[])
  
  // console.log(data);
  let toastId:any

  const pharmacyName=pharm.name

  const router=useRouter()

  // const [chartDataHour, setChartDataHour] = React.useState({
  //   labels: chartData.hourReport.map((data: { medicineName: any; }) => data.medicineName),
  //   datasets: [
  //     {
  //       label: "Sales Per Hour",
  //       data: chartData.hourReport.map((data: { saleAmount: any; }) => data.saleAmount),
  //       backgroundColor: [
  //         "rgba(75,192,192,1)",
  //         "&quot;#ecf0f1",
  //         "#50AF95",
  //         "#f3ba2f",
  //         "#2a71d0"
  //       ],
  //       borderColor: "black",
  //       borderWidth: 2
  //     },
  //     // {
  //     //   label: "Users Lost ",
  //     //   data: chartData.map((data: { userLost: any; }) => data.userLost),
  //     //   backgroundColor: [
  //     //     "rgba(192,75,192,1)",
  //     //     "&quot;#ecf0f1",
  //     //     "#A50F95",
  //     //     "#bf3a2f",
  //     //     "#2d71a0"
  //     //   ],
  //     //   borderColor: "black",
  //     //   borderWidth: 2
  //     // }
  //   ]
  // });
  const refMedName=React.useRef('')
  const refTimeFrame=React.useRef('')
  const refDay=React.useRef('')
  const refDayHour=React.useRef('')
  const text=React.useRef('')

  const [filteredData, setFilteredData] = React.useState();

  const [chartDataHour, setChartDataHour] = React.useState();
  const [chartDataDate, setChartDataDate] = React.useState();
  const [PredictionData, setPredictionData] = React.useState();
  const [formData, setFormData] = React.useState({
    startDate:'',
    endDate:'',
    drug:''
  });

  React.useEffect(()=>{
    refMedName.current=''
    refDay.current=''
    refDayHour.current=data[1][0]?.hour
    loopDataHour({target:{name:'',value:refMedName.current}})
    loopDataDate({target:{name:'',value:refDay.current}})

  },[])

  const loopDataHour=(e: { target: { name: any; value: any; }; })=>{
    const { name, value } = e.target;

    if (name==='medHour') {
      refDayHour.current=value
    }

    if (name==='medName') {
      refMedName.current=value
    }

    let fData:any

    if (refMedName.current ==='' || refMedName.current ===null) {
      fData=data[0]?.filter((item: { medicineName: string, hour:string}) => (item.hour === refDayHour.current))
    }
    else{
      fData=data[0]?.filter((item: { medicineName: string, hour:string}) => (item.medicineName === refMedName.current && item.hour === refDayHour.current))
    }
    
    let CData={
      labels: fData?.map((item: { medicineName: any; }) => item.medicineName || ""),
      datasets: [
        {
          label: `Total Sales Per Medicine`,
          data: fData?.map((item: { saleAmount: any; }) => item.saleAmount),
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },

        {
          label: `Quantity Sold Per Medicine`,
          data: fData?.map((item: { quantitySold: any; }) => item.quantitySold),
          backgroundColor: [
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 0, 0, 0.6)",
            "rgba(0, 255, 0, 0.6)",
            "rgba(0, 0, 255, 0.6)",
            "rgba(255, 255, 0, 0.6)",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    }

    setChartDataHour(CData)

  }

  const loopDataDate=(e: { target: { name: any; value: any; }; })=>{
    const { name, value } = e.target;

    refDay.current=value

    let label:any
    let DataSales:any
    let DataQuantity:any

    if (value==='' || value===null) {
      refDay.current=`Sales In The Past 5 Years`
      text.current='Years'
      label=data[5]?.map((item: { year: any; }) => item.year)
      DataSales=data[5]?.map((item: { saleAmount: any; }) => item.saleAmount)
      DataQuantity=data[5]?.map((item: { quantitySold: any; }) => item.quantitySold)
    }
    else if (value==='Sales Today') {
      text.current="Hours"
      label=data[1]?.map((item: { hour: any; }) => item.hour)
      DataSales=data[1]?.map((item: { saleAmount: any; }) => item.saleAmount)
      DataQuantity=data[1]?.map((item: { quantitySold: any; }) => item.quantitySold)
      
    } else if (value==='Sales This Week'){
      text.current="Dates"

      label=data[2]?.map((item: { date: any; }) => item.date)
      DataSales=data[2]?.map((item: { saleAmount: any; }) => item.saleAmount)
      DataQuantity=data[2]?.map((item: { quantitySold: any; }) => item.quantitySold)
      
    }
    else if (value==='Sales This Month'){
      text.current='Weeks'
      label=data[3]?.map((item: { weekNumber: any; }) => item.weekNumber)
      DataSales=data[3]?.map((item: { saleAmount: any; }) => item.saleAmount)
      DataQuantity=data[3]?.map((item: { quantitySold: any; }) => item.quantitySold)
    }
    else if (value==='Sales This Year'){
      text.current='Months'
      label=data[4]?.map((item: { month: any; }) => item.month)
      DataSales=data[4]?.map((item: { saleAmount: any; }) => item.saleAmount)
      DataQuantity=data[4]?.map((item: { quantitySold: any; }) => item.quantitySold)
    }
    

    let CData={
      labels: label,
      datasets: [
        {
          label: `Total Sales`,
          data: DataSales,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
        {
          label: `Quantity Sold`,
          data: DataQuantity,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    }

    setChartDataDate(CData)

  }

  const hourOptions = [...new Set(data[0].map((item: { medicineName: any; }) => item.medicineName))];
  const dateOption = [...new Set(data[1].map((item: { hour: any; }) => item.hour))];

  const options1 = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Medicine Name",
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Sale Amount",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  const options2 = {
    scales: {
      x: {
        title: {
          display: true,
          text: text.current,
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Sale Amount",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
      
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if ((name==='lastDate' && formData.startDate)) {

            if (formData.startDate > value) {
                toast.error('Invalid prediction date range')
                
            }

        }

        if ((name==='firstDate' && formData.endDate)) {

            if (formData.endDate < value) {
                toast.error('Invalid prediction date range')
                
            }

        }
    };

  const predict=async(e:any)=>{

    e.preventDefault()

    if (formData.endDate < formData.startDate) {
        toast.error('Invalid prediction date range')
        return
        
    }

    toastId=toast.loading('Loading, please wait...',{
      id:toastId
    })

    let response=await axios.post(`/api/v1/controller/medicine?action=predict`,formData)            
    toast.dismiss(toastId)
    if (response.data.success===true) {
      toast.success(`Successful!`,{id:toastId})
      setPredictionData(response.data.prediction)
      // console.log(response.data.prediction);

    }
    else{
        toast.error(`Failed! ${response.data.message}`,{id:toastId})
    }

  }

  const medName=(value:any)=>{

    if (value===0) {
      return 'M01AB'
    }
    else if (value===1) {
      return 'M01AE'
    }else if (value===2) {
      return 'N02BA'
    }else if (value===3) {
      return 'N02BE'
    }else if (value===4) {
      return 'N05B'
    }else if (value===5) {
      return 'N05C'
    }else if (value===6) {
      return 'R03'
    }else if (value===7) {
      return 'R06'
    }
  }

  const weekdayName=(value:any)=>{

    if (value===0) {
      return 'Monday'
    }
    else if (value===1) {
      return 'Tuesday'
    }else if (value===2) {
      return 'Wednesday'
    }else if (value===3) {
      return 'Thursday'
    }else if (value===4) {
      return 'Friday'
    }else if (value===5) {
      return 'Saturday'
    }else if (value===6) {
      return 'Sunday'
    }
  }

  const getTableData=()=>{

    const result=[]

    if (PredictionData) {
      for (const date in PredictionData.Drug) {

        result.push(
          <>
          <tr>
          <td>{date}</td>
          <td>{PredictionData.Year[date]}</td>
          <td>{PredictionData.Month[date]}</td>
          <td>{PredictionData.day[date]}</td>
          <td>{weekdayName(PredictionData['Weekday Name'][date])}</td>
          <td>{medName(PredictionData.Drug[date])}</td>
          <td>{(PredictionData.predicted_quantity[date]).toFixed(4)}</td>
          </tr>
          </>
        )
        
      }
      
    }

    return result
}

  return(
      <>
      <Toaster 

    toastOptions={{
        success:{
            style:{
                background:'green',
                color:'white',
            }
        },
        error:{
            style:{
                background:'red',
                color:'white'
            }
        },
        
    }}

    >
    </Toaster>
      <div className= 'container'> 
      
          <section id= 'eighth' className="nav_section">

          <div className="main-dashboard justify-content-center bg-danger">
              <h3 className="text-light fw-bold m-3 ">Sales Prediction Dashboard</h3>
          </div>
        
        <form onSubmit={predict} style={{background: 'beige'}}>
        <div className="main-dashboard justify-content-center ">
              <h3 className="text-success fw-bold m-3 ">Prediction Form</h3>
          </div>
          <div className="main-dashboard justify-content-center ">
          <div className="d-block">

          <div className="row col col-md-12 form-outline form-white mb-4">
            <div className="col col-md-6 form-group">
              <label className="fw-bold" >Predict From :</label>
              <input ref={dateInput1} onChange={handleInputChange} type="date" className="form-control form-control-lg"  name="startDate" required/>
            </div>

            <div className="col col-md-6 form-group">
              <label className="fw-bold" >Predict To :</label>
              <input ref={dateInput2} onChange={handleInputChange} type="date" className="form-control form-control-lg"  name="endDate" required/>
            </div>
            
          </div>

          <div className="row col col-md-12 form-outline form-white mb-4">
          <div className="col col-md-12 form-group">
              <label className="fw-bold" >Medicine Category :</label>
              <select onChange={handleInputChange} className="form-control form-control-lg" name='drug' required>
                <option></option>
                <option value={'0'}>M01AB</option>
                <option value={'1'}>M01AE</option>
                <option value={'2'}>N02BA</option>
                <option value={'3'}>N02BE</option>
                <option value={'4'}>N05B</option>
                <option value={'5'}>N05C</option>
                <option value={'6'}>R03</option>
                <option value={'7'}>R06</option>
              </select>
              
            </div>

          </div>

          <hr />

          <div className="row col col-md-12 form-outline form-white mb-4">
            &emsp;
            <div className="form-group m-auto">
              <button type="submit" className="btn btn-primary form-control fw-bold" >MAKE PREDICTION</button>
            </div>

          </div>

          </div>
          </div>
        </form>

          <hr />



          <div className="col col-md-12 table-responsive p-3" style={{height:'10%',overflowY:'scroll'}}>
            <div className="col col-md-12 d-flex justify-content-center bg-dark text-warning">
              <h5 className="m-1 fw-bold">Prediction Results</h5>
            </div>
            <div className="table-responsive" >
            	<table className="table table-bordered table-striped table-hover " >
                    <thead >
                        <tr className="bg-secondary">
                        <th>Full Date</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Day</th>
                        <th>WeekDay Name</th>
                        <th>Drug</th>
                        <th>Predicted Quantity</th>
                        
                        </tr>
                        
                    </thead>
                    <tbody>
                        {
                            getTableData()

                        }
                    </tbody>
              </table>
            </div>
          </div>

          {/*<div className="d-flex justify-content-between col-md-8 p-1 m-3">
            <div className="col-md-4 p-1">
              <label className="fw-bold">Select Drug Name</label>
            <select
              className="form-control"
              onChange={loopDataHour}
              name="medName"
            >
                <option></option>
              {hourOptions.map((medicineName) => (
                <>
                <option key={medicineName} value={medicineName}>
                  {medicineName}
                </option>
                </>
                
              ))}
            </select>
            </div>
            <div className="col-md-4 p-1">
              <label className="fw-bold">Select Hour</label>
            <select
              className="form-control"
              onChange={loopDataHour}
              name="medHour"
            >
              {dateOption.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            </div>
            
          </div>
          {
              chartDataHour && (
                <>
              <div className="chartjs">
                
                <PieChart chartDataHour={chartDataHour}  options={options1}  timeDate={refMedName.current}/>
                <LineChart chartDataHour={chartDataHour} options={options1} timeDate={refMedName.current}/>
              
              </div>
              </>
              )
          }
            <hr  />
          <div className="d-flex justify-content-between col-md-8 p-1 m-3">
            <div className="col-md-4 p-1">
              <label className="fw-bold">Select Time Frame</label>
              <select
              className="form-control"
              onChange={loopDataDate}
              name="timeFrame"
            >
              <option ></option>
              <option value={'Sales Today'}>Sales Today</option>
              <option value={'Sales This Week'}>This Week</option>
              <option value={'Sales This Month'}>Sales This Month</option>
              <option value={'Sales This Year'}>Sales This Year</option>
              <option value={''}>Sales In The Past 5 Years</option>
            </select>
            </div>
            </div>
          {
            chartDataDate && (
              <>

              
              <div className="chartjs">
              <BarChart chartDataHour={chartDataDate} options={options2} timeDate={refDay.current}/>
              <PolarAreaChart chartDataHour={chartDataDate} options={options2} timeDate={refDay.current}/>

              </div>
              <div className="chartjs">
              <DoughnutChart chartDataHour={chartDataDate} options={options2} timeDate={refDay.current}/>
              <LineChartTimeFrame chartDataHour={chartDataDate} options={options2} timeDate={refDay.current}/>
              </div>

              </>
              )
          } */}
        

    </section>
    </div>

      
      </>
  )


}