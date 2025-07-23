import RcsBotTypeMaster from "../models/rcs/RcsBotTypeMaster.js";

export const InsertRCSBottype=async()=>{
    try {
        const [bottype,created]=await RcsBotTypeMaster.findOrCreate({
            where: { bot_type_name: "promotional" },
            defaults:{bot_type_name: "promotional"}
        })
        if (created) {
             console.log('Bot Type Created');
             
        } else {
             console.log('Bot Type alredy exist');
        }
    } catch (error) {
         console.log({error:error.message});
         
    }
}