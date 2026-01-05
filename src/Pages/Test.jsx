import { useEffect } from "react";
import databaseService from "../Appwrite/databases";

function Test() {
    const call=async ()=>{
        let res=await databaseService.getUserPostRealtime({
            visibility:"Public",
            status:"Post"
        });
        if(res){
            console.log(res.list.documents)
        }
    }
    return (
        <>
        <button onClick={call}>Click Mee</button>
        </>
    )
}
export default Test;