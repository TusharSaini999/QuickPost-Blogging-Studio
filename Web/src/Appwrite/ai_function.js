import env from "../Configenv/env";
import { Client, Functions, ExecutionMethod } from "appwrite";
export class Ai_function {
    client = new Client();
    function;
    constructor() {
        this.client.setEndpoint(env.APPWRITE_URL).setProject(env.APPWRITE_PROJECT_ID);
        this.function = new Functions(this.client);
    }

    async ai_summery({ title, shortDescription, content, length }) {
        try {
            const execution = await this.function.createExecution(
                env.APPWRITE_FUNCTION_AISUMMMERY, 
                JSON.stringify({
                    title,
                    shortDescription,
                    content,
                    length,
                }),
                false,
                "/summary-ai",
                ExecutionMethod.POST,
                {
                    "Content-Type": "application/json",
                }
            );
            console.log(execution)
            const res = JSON.parse(execution?.responseBody);
            if (res?.success) {
                return {
                    success: res?.success,
                    summary: res?.summary
                }
            } else {
                return{
                    success:false,
                    error:res.error
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error
            }
        }
    }
}

const ai_function = new Ai_function();

export default ai_function