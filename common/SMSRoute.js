import SMSCRoutes from '../models/SMSCRoutes.js'

const InsertSMSRoute=async(req, res)=>{
    
    
    try {
        const [smsRoute, created] = await SMSCRoutes.findOrCreate({
          where: { routeSMPPName: "ETERNODM" },
          defaults: {
            routeSMPPName: "ETERNODM",
            routeDisplayName: "ETERNODM",
            service_id: 1,
          },
        });
        return  console.log(created ? 'SMSRoute created successfully' : 'SMSRoute already exists')
           
    } catch (error) {
       console.log("smsroute error", { error: error });
        
    }
}

export default InsertSMSRoute;