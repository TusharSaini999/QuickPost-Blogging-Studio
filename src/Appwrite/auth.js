import env from "../Configenv/env";
import { Account, Client, ID } from "appwrite";
import databaseService from "./databases";
export class AuthService {
    client = new Client()
    account;
    constructor() {
        this.client.setEndpoint(env.APPWRITE_URL).setProject(env.APPWRITE_PROJECT_ID);
        this.account = new Account(this.client);
    }
    async createOathAccount({ value }) {
        let arr = new Array("google", "github");
        if (arr.find(no => no == value)) {
            try {
                let res = this.account.createOAuth2Session(value, env.REDIRECT_SUCCESS, env.REDIRECT_FAILURE, ['email', 'profile']);
                // let res = await this.checkUser();
                // if (res.success) {
                //     let profileURL = this.getRandomAvatar(res.user.name);
                //     databaseService().createProfile(profileURL);
                //     localStorage.setItem("isLogin", true);
                //     return true;
                // }
                // console.log(res);
                localStorage.setItem("isLogin", true);
                return true;
            } catch (err) {
                throw err;
            }
        } else {
            throw "The value is pass not in Array"
        }

    }
    async createAccount({ email, password, name }) {
        console.log("Form Auth Input:", email, password, name);

        try {
            const userID = ID.unique();
            await this.account.create(userID, email.trim(), password.trim(), name.trim());
            const response = await this.login({ email, password });
            if (response.success) {
                let rep = await databaseService.createProfile({ userID, name })
                console.log("At the Create account :", rep);
                if (rep.success) {

                    console.log("Account created")
                    return {
                        success: true,
                        session: rep.token
                    };
                } else {
                    return {
                        success: false,
                        type: rep.type || "Profile_Create",
                        message: rep.message || "Account created but Profile Create failed",
                    };
                }
            } else {
                return {
                    success: false,
                    code: response.code || 500,
                    type: response.type || "login_failed",
                    message: response.message || "Account created but login failed",
                };
            }

        } catch (err) {
            return {
                success: false,
                code: err.code || 500,
                type: err.type || "create_account_error",
                message: err.message || "Something went wrong while creating account",
            };
        }
    }



    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(
                email.trim(),
                password.trim()
            );
            localStorage.setItem("isLogin", true);
            return {
                success: true,
                session: session,
            };
        } catch (err) {
            return {
                success: false,
                code: err.code,
                type: err.type,
                message: err.message,
            };
        }
    }


    async checkUser() {
        try {
            const user = await this.account.get("current");
            return {
                success: true,
                user: user
            };
        } catch (err) {
            console.log("In Catch")
            return {
                success: false,
                code: err.code,
                type: err.type,
                message: err.message,
            };
        }
    }

    async logout({ type }) {
        try {
            let token;
            if (type == "current") {
                token = await this.account.deleteSession("current");
            } else {
                token = await this.account.deleteSessions();
            }
            localStorage.setItem("isLogin", false);
            return {
                status: true,
                token: token
            }
        } catch (err) {
            return {
                status: false,
                Message: err.message,
                Error: err.code,
                type: err.type
            }
        }
    }

    async emailVarification() {
        try {
            let token = await this.account.createVerification(
                env.REDIRECT_EMAIL
            );
            console.log(token);
            if (token) {
                return {
                    status: true,
                    token: token
                };
            } else {
                const customError = new Error("A technical error occurred on the server. Please try again later.");
                customError.code = 500;
                customError.type = "technical_error";
                throw customError;
            }
        } catch (error) {
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong.",
            };
        }
    }
    async updateVerification(userId, secret) {
        try {
            let token = await this.account.updateVerification(userId, secret);
            if (token) {
                return {
                    status: true,
                    token: token
                };
            } else {
                const customError = new Error("A technical error occurred on the server. Please try again later.");
                customError.code = 500;
                customError.type = "technical_error";
                throw customError;
            }
        } catch (error) {
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong.",
            };
        }
    }
    async sendPasswordReset({ email }) {
        try {
            let token = await this.account.createRecovery(
                email.trim(),
                env.REDIRECT_PASSWORD
            );
            console.log(token);
            if (token) {
                return {
                    status: true,
                    token: token
                };
            } else {
                const customError = new Error("A technical error occurred on the server. Please try again later.");
                customError.code = 500;
                customError.type = "technical_error";
                throw customError;
            }
        } catch (error) {
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong.",
            };
        }
    }
    async updatePassword({ userId, secret, password }) {
        try {
            let token = await this.account.updateRecovery(
                userId,
                secret,
                password
            );
            if (token) {
                return {
                    status: true,
                    token: token
                };
            } else {
                const customError = new Error("A technical error occurred on the server. Please try again later.");
                customError.code = 500;
                customError.type = "technical_error";
                throw customError;
            }
        } catch (error) {
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong.",
            };
        }
    }

    async updatePasswordProfile({ oldpassword, password }) {
        console.log(password)
        try {
            const result = await this.account.updatePassword(password, oldpassword);
            console.log(result)
            return {
                status: true,
                data: result
            };
        } catch (error) {
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong."
            };
        }
    }

    getCurrentAndPreviousWeeksObj() {
        function getYearWeekNum(date) {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum); // move to Thursday
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

            // return like "202536" instead of "2025_36"
            return `${d.getUTCFullYear()}${weekNo.toString().padStart(2, "0")}`;
        }

        const result = {};
        const today = new Date();

        for (let i = 0; i < 4; i++) {
            const tempDate = new Date(today);
            tempDate.setUTCDate(today.getUTCDate() - i * 7); // go back i weeks
            const key = getYearWeekNum(tempDate);
            result[key] = 0;
        }

        return result;
    }
    
    async updateLabels({ documentID = null, dataObject = null }) {
        try {
            let result;
            if (dataObject) {
                result = await this.account.updatePrefs(dataObject);
            } else {
                let weekData=JSON.stringify(this.getCurrentAndPreviousWeeksObj());
                result = await this.account.updatePrefs(
                    {
                        Profile_Created: true,
                        Profile_Document: documentID,
                        Public: 0,
                        Private: 0,
                        Drafts: 0,
                        Week:weekData
                    });
            }

            console.log("User labels updated:", result);
            return {
                status: true,
                data: result
            };
        } catch (error) {
            console.error("Error updating labels:", error);
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong."
            };
        }
    }

    async updateName({ name }) {
        try {
            const result = await this.account.updateName(
                name
            );
            return {
                status: true,
                data: result
            };
        } catch (error) {
            console.error("Error updating Name:", error);
            return {
                status: false,
                code: error.code || 500,
                type: error.type || "unknown_error",
                message: error.message || "Something went wrong."
            };
        }
    }
};



const authService = new AuthService();

export default authService;